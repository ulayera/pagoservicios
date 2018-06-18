const chai = require('chai');
const expectToBeAPromise = require('expect-to-be-a-promise');
const chaiHttp = require('chai-http');
const rewiremock = require('rewiremock').default;

chai.use(chaiHttp);
chai.use(expectToBeAPromise);
const expect = chai.expect;

const QryAgreementDebitResponse = require('../../../repository/clients/QryAgreementDebitResponse');
const QryAgreementDebitResponseFault = require('../../../repository/clients/QryAgreementDebitResponseFault');

const generateMock = function (obj, isOk) {
  return rewiremock.proxy('../../../repository/clients/QryAgreementDebit', function (r) {
    return {
      'soap-client-bech': {
        strongSoapB9: function (url, currHeader, req, funcionWSDL) {
          return new Promise(function (resolve, reject) {
            if (isOk) resolve(obj.result);
            else reject(obj);
          });
        },
      },
    };
  }).QryAgreementDebit;
};

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

  it('Deberia retornar exito, estado 200', function (done) {
    const service = generateMock(QryAgreementDebitResponse, true);
    (async function () {
      const respuesta = await service.singleSelectEftDebitsByIdentification();
      check(done, function () {
        expect(respuesta.eftDebits).to.have.a.property('amount');
        expect(respuesta.eftDebits).to.have.a.property('documentNumber');
        expect(respuesta.eftDebitsOverdue).to.have.a.property('dueDate');
        expect(respuesta.eftDebits).to.have.a.property('amount');
        expect(respuesta.eftDebitsImprov).to.have.a.property('dueDate');
        expect(respuesta.eftDebits).to.have.a.property('amount');
      });
    }());
  });

  it('Deberia retornar fallo, Strong SOAP retorna error, estado 400', function (done) {
    const service = generateMock(QryAgreementDebitResponseFault, false);
    (async function () {

      try {
        await service.singleSelectEftDebitsByIdentification();
      } catch (e) {
        check(done, function () {
          expect(e).to.have.a.property('faultstring');
        });
      }
    }());
  });
});
