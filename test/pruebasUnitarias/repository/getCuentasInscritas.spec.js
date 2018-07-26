const chai = require('chai');
const expectToBeAPromise = require('expect-to-be-a-promise');
const { exito, malRequest } = require('arquitecturadigital-bech').mensajeSalida;
const MockExpressResponse = require('mock-express-response');
const MockExpressRequest = require('mock-express-request');
const chaiHttp = require('chai-http');
const rewiremock = require('rewiremock').default;
const { Stream } = require('stream');
const { readable } = require('is-stream');

chai.use(chaiHttp);
chai.use(expectToBeAPromise);
const expect = chai.expect;

const QryCustomerOperRelationsProductResponse = require('../../../repository/clients/QryCustomerOperRelationsProductResponse');

const generateMock = function (obj, isOk) {
  return rewiremock.proxy('../../../repository/getCuentasInscritas/getCuentasInscritas.controller', r => ({
    micro: {
      send: (res, code, obj = null) => {
        res.statusCode = code;
        if (obj === null) {
          res.end();
          return;
        }
        if (Buffer.isBuffer(obj)) {
          if (!res.getHeader('Content-Type')) {
            res.setHeader('Content-Type', 'application/octet-stream');
          }

          res.setHeader('Content-Length', obj.length);
          res.end(obj);
          return;
        }
        if (obj instanceof Stream || readable(obj)) {
          if (!res.getHeader('Content-Type')) {
            res.setHeader('Content-Type', 'application/octet-stream');
          }

          obj.pipe(res);
          return;
        }
        let str = obj;
        if (typeof obj === 'object' || typeof obj === 'number') {
          str = JSON.stringify(obj, null, 2);
          if (!res.getHeader('Content-Type')) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
          }
        }

        res.setHeader('Content-Length', Buffer.byteLength(str));
        res.end(str);
      },
    },
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
            if (isOk)
              resolve(obj);
            else
              reject(obj);
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
      await controller.getCuentasInscritas(req, res);
      check(done, () => {
        expect(res).to.have.a.property('statusCode', 200);
        const body = res._getJSON();
        expect(body.paylload[0]).to.have.a.property('objetivoSubproducto');
      });
    }());
  });

  it('Deberia retornar exito lista vacia, estado 200', (done) => {
    const controller = generateMock(QryCustomerOperRelationsProductResponse, true);
    const res = new MockExpressResponse();
    const req = {
      headers: {},
      params: {
        rut: '20901792K',
      },
    };
    (async function () {
      await controller.getCuentasInscritas(req, res);
      check(done, () => {
        expect(res).to.have.a.property('statusCode', 200);
        const body = res._getJSON();
        expect(body.payload).to.be.an('array');
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
      await controller.getCuentasInscritas(req, res);
      check(done, () => {
        expect(res).to.have.a.property('statusCode', 400);
      });
    }());
  });

  it('Deberia retornar Fallo, Rut Invalido, estado 400', (done) => {
    const controller = generateMock(QryCustomerOperRelationsProductResponse, true);
    const res = new MockExpressResponse();
    const req = {
      headers: {},
      params: {
        rut: '18',
      },
      body: {},
    };
    (async function () {
      await controller.getCuentasInscritas(req, res);
      check(done, () => {
        expect(res).to.have.a.property('statusCode', 400);
      });
    }());
  });

  it('Deberia retornar Fallo, in param rut, estado 400', (done) => {
    const controller = generateMock(QryCustomerOperRelationsProductResponse, true);
    const res = new MockExpressResponse();
    const req = {
      headers: {},
      params: {},
      body: {},
    };
    (async function () {
      await controller.getCuentasInscritas(req, res);
      check(done, () => {
        expect(res).to.have.a.property('statusCode', 400);
      });
    }());
  });
});
