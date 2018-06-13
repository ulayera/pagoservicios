const chai = require('chai');
const expectToBeAPromise = require('expect-to-be-a-promise');
const {exito, malRequest} = require('arquitecturadigital-bech').mensajeSalida;
const MockExpressResponse = require('mock-express-response');
const chaiHttp = require('chai-http');
const rewiremock = require('rewiremock').default;

chai.use(chaiHttp);
chai.use(expectToBeAPromise);
const expect = chai.expect;

const QryCustomerOperRelationsProductResponse = require('../../../../repository/clients/QryCustomerOperRelationsProductResponse');

const generateMock = (obj, isOk) => rewiremock.proxy('./getCuentasInscritas.controller', () => ({
  'arquitecturadigital-bech': {
    mensajeSalida: {
      exito,
      malRequest,
    },
    monitoreoBECH: () => {
    },
  },
  '../clients/QryCustomerOperRelationsProduct': {
    QryCustomerOperRelationsProduct: {
      massiveSelectEftAccessionByCustomer: () => new Promise(async (resolve, reject) => {
        if (isOk) resolve(obj);
        else reject(obj);
      }),
    },
  },
}));

describe('TEST getCuentasInscritas', function () {
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
    const controller = generateMock(QryCustomerOperRelationsProductResponse, true);
    const res = new MockExpressResponse();
    const req = {
      params: {
        rut: '19',
      },
    };
    (async function () {
      await controller.getCuentasInscritas(req, res);
      check(done, () => {
        expect(res).to.have.a.property('statusCode', 200);
        const body = res._getJSON();
        expect(body.payload).to.be.an('array').that.is.not.empty;
        expect(body.payload[0]).to.have.a.property('identificacion');
        expect(body.payload[0]).to.have.a.property('clienteOrigen');
        expect(body.payload[0]).to.have.a.property('nombreClienteOrigen');
        expect(body.payload[0]).to.have.a.property('conceptoPago');
        expect(body.payload[0]).to.have.a.property('selloAdicional');
        expect(body.payload[0]).to.have.a.property('objetivoSubproducto');
        expect(body.payload[0]).to.have.a.property('identifiacion');
      });
    }());
  });

  it('Deberia retornar exito lista vacia, estado 200', (done) => {
    const controller = generateMock(QryCustomerOperRelationsProductResponse, true);
    const res = new MockExpressResponse();
    const req = {
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
