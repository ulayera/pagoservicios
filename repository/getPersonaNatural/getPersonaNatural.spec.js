const chai = require('chai');
const response = require('mock-express-response');
const chaiHttp = require('chai-http');
const expectToBeAPromise = require('expect-to-be-a-promise');
const proxyquire = require('proxyquire').noCallThru();

chai.use(chaiHttp);
chai.use(expectToBeAPromise);
const expect = chai.expect;

let controller = undefined,
    req = undefined,
    res = undefined;


beforeEach(() => {
    controller = proxyquire('./getPersonaNatural', {
        'soap-client-bech': {
            strongSoapB9: (url, header, request, wsdl) => {
                return Promise.resolve({ ok: 'ok' });
            }
        }
    });
});
describe('TEST getPersonaNatural', () => {
    function check(done, f) {
        try {
            f();
            done();
        } catch (e) {
            done(e);
        }
    }
    it('Deberia retornar exito, estado 200', (done) => {
        res = new response();
        req = {
            headers: {
            },
            params: {
                personaNatural: '19'
            },
            body: {
            }
        }
        controller.getPersonaNatural(req, res);
        setTimeout(function () {
            check(done, function () {
                expect(res).to.have.a.property('statusCode', 200);
            });
        }, 100);
    });

    it('Deberia retornar exito RUT terminado en K, estado 200', (done) => {
        res = new response();
        req = {
            headers: {
            },
            params: {
                personaNatural: '20901792K'
            },
            body: {
            }
        }
        controller.getPersonaNatural(req, res);
        setTimeout(function () {
            check(done, function () {
                expect(res).to.have.a.property('statusCode', 200);
            });
        }, 100);
    });

    it('Deberia retornar exito RUT terminado en 0, estado 200', (done) => {
        res = new response();
        req = {
            headers: {
            },
            params: {
                personaNatural: '111120'
            },
            body: {
            }
        }
        controller.getPersonaNatural(req, res);
        setTimeout(function () {
            check(done, function () {
                expect(res).to.have.a.property('statusCode', 200);
            });
        }, 100);
    });

    it('Deberia retornar fallo, Strong SOAP retorna error, estado 400', (done) => {
        controller = proxyquire('./getPersonaNatural', {
            'soap-client-bech': {
                strongSoapB9: (url, header, request, wsdl) => {
                    return Promise.reject({ root: { Envelope: { Body: { Fault: "NOTOK" } } } });
                }
            }
        });
        res = new response();
        req = {
            headers: {
            },
            params: {
                personaNatural: '19'
            },
            body: {
            }
        }
        controller.getPersonaNatural(req, res);
        setTimeout(function () {
            check(done, function () {
                expect(res).to.have.a.property('statusCode', 400);
            });
        }, 100);
    });

    it('Deberia retornar Fallo, Rut Invalido, estado 400', (done) => {
        res = new response();
        req = {
            headers: {
            },
            params: {
                personaNatural: '18'
            },
            body: {
            }
        }
        controller.getPersonaNatural(req, res);
        setTimeout(function () {
            check(done, function () {
                expect(res).to.have.a.property('statusCode', 400);
            });
        }, 100);
    });

    it('Deberia retornar Fallo, in param personaNatural, estado 400', (done) => {
        res = new response();
        req = {
            headers: {
            },
            params: {
            },
            body: {
            }
        }
        controller.getPersonaNatural(req, res);
        setTimeout(function () {
            check(done, function () {
                expect(res).to.have.a.property('statusCode', 400);
            });
        }, 100);
    });

    

});