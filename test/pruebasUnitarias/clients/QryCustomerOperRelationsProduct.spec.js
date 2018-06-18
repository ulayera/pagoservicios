const chai = require('chai');
const expectToBeAPromise = require('expect-to-be-a-promise');
const chaiHttp = require('chai-http');
const rewiremock = require('rewiremock').default;

chai.use(chaiHttp);
chai.use(expectToBeAPromise);
const expect = chai.expect;

const QryCustomerOperRelationsProductResponse = require('../../../repository/clients/QryCustomerOperRelationsProductResponse');
const QryCustomerOperRelationsProductResponseFault = require('../../../repository/clients/QryCustomerOperRelationsProductResponseFault');

const generateMock = (obj, isOk) => rewiremock.proxy('../../../repository/clients/QryCustomerOperRelationsProduct', r => ({
  'soap-client-bech': {
    strongSoapB9: (url, currHeader, req, funcionWSDL) => new Promise((resolve, reject) => {
      if (isOk) resolve(obj.result);
      else reject(obj);
    }),
  },
})).QryCustomerOperRelationsProduct;

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
    const service = generateMock(QryCustomerOperRelationsProductResponse, true);
    (async function () {
      const respuesta = await service.massiveSelectEftAccessionByCustomer();
      check(done, () => {
        expect(respuesta.eftsAccessions.eftAccessions).to.be.an('array').that.is.not.empty;
        expect(respuesta.eftsAccessions.eftAccessions[0]).to.have.a.property('targetAccountName');
        expect(respuesta.eftsAccessions.eftAccessions[0]).to.have.a.property('paymentConcept');
        expect(respuesta.eftsAccessions.eftAccessions[0]).to.have.a.property('identification');
        expect(respuesta.eftsAccessions.eftAccessions[0]).to.have.a.property('stampAdditional');
        expect(respuesta.eftsAccessions.eftAccessions[0]).to.have.a.property('originCustomerName');
        expect(respuesta.eftsAccessions.eftAccessions[0]).to.have.a.property('subproductTarget');
        expect(respuesta.eftsAccessions.eftAccessions[0].subproductTarget).to.have.a.property('shortDesc');
        expect(respuesta.eftsAccessions.eftAccessions[0]).to.have.a.property('originCustomer');
      });
    }());
  });

  it('Deberia retornar fallo, Strong SOAP retorna error, estado 400', (done) => {
    const service = generateMock(QryCustomerOperRelationsProductResponseFault, false);
    (async function () {
      try {
        await service.massiveSelectEftAccessionByCustomer();
      } catch (e) {
        check(done, () => {
          expect(e).to.have.a.property('faultstring');
        });
      }
    }());
  });
});
