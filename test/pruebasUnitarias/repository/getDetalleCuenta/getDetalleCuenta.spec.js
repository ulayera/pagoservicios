const chai = require('chai');
const expectToBeAPromise = require('expect-to-be-a-promise');
const { exito, malRequest } = require('arquitecturadigital-bech').mensajeSalida;
const MockExpressResponse = require('mock-express-response');
const chaiHttp = require('chai-http');
const rewiremock = require('rewiremock').default;

chai.use(chaiHttp);
chai.use(expectToBeAPromise);
const expect = chai.expect;

const QryCustomerOperRelationsProductResponse = require('../../../../repository/clients/QryAgreementDebitResponse');

const generateMock = function (obj, isOk) {
  return rewiremock.proxy('../../../../repository/getDetalleCuenta/getDetalleCuenta.controller', function (r) {
    return {
      'arquitecturadigital-bech': {
        mensajeSalida: {
          exito,
          malRequest,
        },
        monitoreoBECH: function () {
        },
      },
      '../clients/QryAgreementDebit': {
        QryAgreementDebit: {
          singleSelectEftDebitsByIdentification: function () {
            return new Promise(async function (resolve, reject) {
              if (isOk) resolve(obj);
              else reject(obj);
            });
          },
        },
      },
    };
  });
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

  it('Deberia retornar exito, estado 200', function (done) {
    const controller = generateMock(QryCustomerOperRelationsProductResponse, true);
    const res = new MockExpressResponse();
    const req = {
      params: {
        identificacion: '321414312',
        conceptoPago: '234567',
      },
    };
    (async function () {
      await controller.getDetalleCuenta(req, res);
      check(done, function () {
        expect(res).to.have.a.property('statusCode', 200);
        const body = res._getJSON();
        expect(body.payload).to.have.a.property('deudas');
        expect(body.payload).to.have.a.property('deudaVencida');
        expect(body.payload).to.have.a.property('deudaActual');
      });
    }());
  });

  it('Sin parametros, Deberia retornar fallo, estado 400', function (done) {
    const controller = generateMock(QryCustomerOperRelationsProductResponse, true);
    const res = new MockExpressResponse();
    const req = {
      params: {},
    };
    (async function () {
      await controller.getDetalleCuenta(req, res);
      check(done, function () {
        expect(res).to.have.a.property('statusCode', 400);
      });
    }());
  });

  it('Deberia retornar fallo, Strong SOAP retorna error, estado 400', function (done) {
    const controller = generateMock({codigo: 400, mensaje: 'Error', payload: ''}, false);
    const res = new MockExpressResponse();
    const req = {
      headers: {},
      params: {
        rut: '19',
      },
      body: {},
    };
    (async function () {
      await controller.getDetalleCuenta(req, res);
      check(done, function () {
        expect(res).to.have.a.property('statusCode', 400);
      });
    }());
  });
});
