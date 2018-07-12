const chai = require('chai');
const expectToBeAPromise = require('expect-to-be-a-promise');
const chaiHttp = require('chai-http');
const rewiremock = require('rewiremock').default;

chai.use(chaiHttp);
chai.use(expectToBeAPromise);
const expect = chai.expect;

const OperEftServicePaymentResponse = require('../../../repository/clients/OperEftServicePaymentResponse');
const OperEftServicePaymentResponseFault = require('../../../repository/clients/OperEftServicePaymentResponseFault');

const generateMock = function (obj, isOk) {
  return rewiremock.proxy('../../../repository/clients/OperEftServicePayment', function (r) {
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
  }).OperEftServicePayment;
};

describe('TEST realizarPagoCuenta', function () {
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
    const service = generateMock(OperEftServicePaymentResponse, true);
    (async function () {
      const respuesta = await service.processEftServicePayments();
      check(done, function () {
        expect(respuesta.eftDebits).to.have.a.property('referenceNumber');
      });
    }());
  });

  it('Deberia retornar fallo, Strong SOAP retorna error, estado 400', function (done) {
    const service = generateMock(OperEftServicePaymentResponseFault, false);
    (async function () {

      try {
        await service.processEftServicePayments();
      } catch (e) {
        check(done, function () {
          expect(e).to.have.a.property('faultstring');
        });
      }
    }());
  });
});
