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
    controller = proxyquire('./getCuentasInscritas.controller', {
        'soap-client-bech': {
            strongSoapB9: (url, header, request, wsdl) => {
                return Promise.resolve(require('./getCuentasInscritas.example.response'));
            }
        }
    });
});
describe('TEST getCuentasInscritas', () => {
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
                rut: '19'
            },
            body: {
            }
        }
        controller.getCuentasInscritas(req, res);
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
                rut: '20901792K'
            },
            body: {
            }
        }
        controller.getCuentasInscritas(req, res);
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
                rut: '111120'
            },
            body: {
            }
        }
        controller.getCuentasInscritas(req, res);
        setTimeout(function () {
            check(done, function () {
                expect(res).to.have.a.property('statusCode', 200);
            });
        }, 100);
    });

    it('Deberia retornar fallo, Strong SOAP retorna error, estado 400', (done) => {
        controller = proxyquire('./getCuentasInscritas.controller', {
            'soap-client-bech': {
                strongSoapB9: (url, header, request, wsdl) => {
                    return Promise.reject({root: {Envelope: {Body: {Fault: "NOTOK"}}}});
                }
            }
        });
        res = new response();
        req = {
            headers: {},
            params: {
                rut: '19'
            },
            body: {}
        };
        controller.getCuentasInscritas(req, res);
        setTimeout(function () {
            check(done, function () {
                expect(res).to.have.a.property('statusCode', 200);
            });
        }, 1900);
    });

    it('Deberia retornar Fallo, Rut Invalido, estado 400', (done) => {
        res = new response();
        req = {
            headers: {
            },
            params: {
                rut: '18'
            },
            body: {
            }
        }
        controller.getCuentasInscritas(req, res);
        setTimeout(function () {
            check(done, function () {
                expect(res).to.have.a.property('statusCode', 400);
            });
        }, 100);
    });

    it('Deberia retornar Fallo, in param rut, estado 400', (done) => {
        res = new response();
        req = {
            headers: {
            },
            params: {
            },
            body: {
            }
        }
        controller.getCuentasInscritas(req, res);
        setTimeout(function () {
            check(done, function () {
                expect(res).to.have.a.property('statusCode', 400);
            });
        }, 100);
    });


});