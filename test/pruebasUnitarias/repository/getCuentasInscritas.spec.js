const chai = require('chai');
const expectToBeAPromise = require('expect-to-be-a-promise');
const { exito, malRequest } = require('arquitecturadigital-bech').mensajeSalida;
const MockExpressResponse = require('mock-express-response');
const MockExpressRequest = require('mock-express-request');
const chaiHttp = require('chai-http');
const rewiremock = require('rewiremock').default;
const { json } = require('micro');

chai.use(chaiHttp);
chai.use(expectToBeAPromise);
const expect = chai.expect;

const QryCustomerOperRelationsProductResponse = require('../../../repository/clients/QryCustomerOperRelationsProductResponse');

const generateMock = function (obj, isOk) {
  return rewiremock.proxy('../../../repository/getCuentasInscritas/getCuentasInscritas.controller', r => ({
    micro: {
      send: (res, statusCode, data) => {
        res.status(statusCode).send(data);
      },
    },
    arquitecturaDigital: { logger: { error: { error: () => {} }, system: { info: () => {} } } },
    'arquitecturadigital-bech': {
      mensajeSalida: {
        exito,
        malRequest,
      },
      monitoreoBECH() {
      },
    },
    '../clients/QryCustomerOperRelationsProduct': {
      QryCustomerOperRelationsProduct: {
        massiveSelectEftAccessionByCustomer() {
          return new Promise((async (resolve, reject) => {
            if (isOk) { resolve(obj); } else { reject(obj); }
          }));
        },
      },
    },
  }));
};

describe('TEST getCuentasInscritas', function () {
  this.timeout(20000);

  function check(done, f) {
    try {
      f();
      done();
    } catch (e) {
      done(e);
    }
  }

  it('Deberia retornar exito, estado 200', (done) => {
    const controller = generateMock(QryCustomerOperRelationsProductResponse, true);
    const res = new MockExpressResponse();
    const req = new MockExpressRequest();
    req.params = { rut: '19' };
    (async function () {
      res.callback = (function () {
        check(done, () => {
          expect(res).to.have.a.property('statusCode', 200);
          const body = res._getJSON();
          expect(body.payload[0]).to.have.a.property('objetivoSubproducto');
        });
      });
      await controller.getCuentasInscritas(req, res);
      res.callback();
    }());
  });

  it('Deberia retornar exito lista vacia, estado 200', (done) => {
    const controller = generateMock(QryCustomerOperRelationsProductResponse, true);
    const res = new MockExpressResponse();
    const req = new MockExpressRequest();
    req.params = { rut: '20901792K' };
    (async function () {
      res.callback = (function cb() {
        check(done, () => {
          expect(res).to.have.a.property('statusCode', 200);
          const body = res._getJSON();
          expect(body.payload).to.be.an('array');
        });
      });
      await controller.getCuentasInscritas(req, res);
      res.callback();
    }());
  });

  it('Deberia retornar fallo, Strong SOAP retorna error, estado 400', (done) => {
    const controller = generateMock({ codigo: 400, mensaje: 'Error', payload: '' }, false);
    const res = new MockExpressResponse();
    const req = new MockExpressRequest();
    req.params = { rut: '19' };
    (async function () {
      res.callback = (function cb() {
        check(done, () => {
          expect(res).to.have.a.property('statusCode', 400);
        });
      });
      await controller.getCuentasInscritas(req, res);
      res.callback();
    }());
  });

  it('Deberia retornar Fallo, Rut Invalido, estado 400', (done) => {
    const controller = generateMock(QryCustomerOperRelationsProductResponse, true);
    const res = new MockExpressResponse();
    const req = new MockExpressRequest();
    req.params = { rut: '19' };
    (async function () {
      res.callback = (function cb() {
        check(done, () => {
          expect(res).to.have.a.property('statusCode', 400);
        });
      });
      await controller.getCuentasInscritas(req, res);
      res.callback();
    }());
  });

  it('Deberia retornar Fallo, in param rut, estado 400', (done) => {
    const controller = generateMock(QryCustomerOperRelationsProductResponse, true);
    const res = new MockExpressResponse();
    const req = new MockExpressRequest();
    (async function () {
      await controller.getCuentasInscritas(req, res);
      check(done, () => {
        expect(res).to.have.a.property('statusCode', 400);
      });
    }());
  });
});
