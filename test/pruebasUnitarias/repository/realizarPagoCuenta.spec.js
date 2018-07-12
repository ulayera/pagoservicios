const chai = require('chai');
const expectToBeAPromise = require('expect-to-be-a-promise');
const { exito, malRequest } = require('arquitecturadigital-bech').mensajeSalida;
const { send, json } = require('micro');
const MockExpressResponse = require('mock-express-response');
const chaiHttp = require('chai-http');
const rewiremock = require('rewiremock').default;

chai.use(chaiHttp);
chai.use(expectToBeAPromise);
const expect = chai.expect;

const OperEftServicePaymentResponse = require('../../../repository/clients/OperEftServicePaymentResponse');
const OperEftServicePaymentResponseFault = require('../../../repository/clients/OperEftServicePaymentResponseFault');

const generateMock = function (obj, isOk) {
  return rewiremock.proxy('../../../repository/realizarPagoCuenta/realizarPagoCuenta.controller', r => ({
    'arquitecturadigital-bech': {
      mensajeSalida: {
        exito,
        malRequest,
      },
      monitoreoBECH() {
      },
    },
    micro: {
      json: req => req.params,
      send,
    },
    '../clients/OperEftServicePayment': {
      OperEftServicePayment: {
        processEftServicePayments() {
          return new Promise((async (resolve, reject) => {
            if (isOk) resolve(obj);
            else reject(obj);
          }));
        },
      },
    },
  }));
};

describe('TEST getDetalleCuenta', function () {
  this.timeout(3000);

  function check(done, f) {
    try {
      f();
      done();
    } catch (e) {
      done(e);
    }
  }

  it('Deberia retornar exito, estado 200', (done) => {
    const controller = generateMock(OperEftServicePaymentResponse, true);
    const res = new MockExpressResponse();
    const req = {
      params: {
        rut: '59521268',
        identificacion: '83496533',
        conceptoPago: '2354106996',
        monto: '44614',
        cuentaOrigen: '23200005252',
        idOperacion: 'uriSFB=CCT#CCT#23200005252',
        numeroDocumento: 'V035594',
      },
    };
    (async function () {
      await controller.realizarPagoCuenta(req, res);
      check(done, () => {
        expect(res).to.have.a.property('statusCode', 200);
        const body = res._getJSON();
        expect(body.payload).to.have.a.property('codigoReferencia');
      });
    }());
  });

  it('Sin parametros, Deberia retornar fallo, estado 400', (done) => {
    const controller = generateMock(OperEftServicePaymentResponseFault, true);
    const res = new MockExpressResponse();
    const req = {
      params: {},
    };
    (async function () {
      await controller.realizarPagoCuenta(req, res);
      check(done, async () => {
        expect(res).to.have.a.property('statusCode', 400);
      });
    }());
  });

  it('Deberia retornar fallo, Strong SOAP retorna error, estado 400', (done) => {
    const controller = generateMock({ codigo: 400, mensaje: 'Error', payload: '' }, false);
    const res = new MockExpressResponse();
    const req = {
      headers: {},
      params: {
        rut: '19',
      },
      body: {},
    };
    (async function () {
      await controller.realizarPagoCuenta(req, res);
      check(done, () => {
        expect(res).to.have.a.property('statusCode', 400);
      });
    }());
  });
});
