const rp = require('request-promise');
const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
let test = undefined,
    cacheado = false;
chai.use(chaiAsPromised);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


const consulta = async () => {
    const optionsPacto = {
        uri: `http://172.17.200.7:8187/pacts/provider/personaNatural/consumer/MS/latest`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    test = await rp(optionsPacto)
        .then(
            (resp) => {
                const optionsTokenEnrolamientoPJ = {
                    method: 'GET',
                    uri: 'http://localhost:3000/servicios/v1/personasnaturales/19',
                    path: '/v2/personasnaturales/19',
                    headers: {
                    },
                    body: {
                    },
                    json: true
                };
                return Promise.all([JSON.parse(resp).interactions[0], rp(optionsTokenEnrolamientoPJ), optionsTokenEnrolamientoPJ]);
            })
        .catch(
            (err) => {
                console.log(`Error: ${err}`);
            });
    cacheado = true;
}

beforeEach(async () => {
    !cacheado ? await consulta() : true;
});

describe('Pruebas de Contrato entre MS y personaNatural', () => {
    it('Deberia tener en mismo codigo de exito 200', () => {
        expect(test[0].response.status).to.be.equal(test[1].codigo);
    });

    it('Deberia enviarse por el mismo metodo "GET"', () => {
        expect(test[0].request.method.toUpperCase()).to.be.equal(test[2].method.toUpperCase());
    });

    it('Deberia solicitarse el request al mismo PATH', () => {
        expect(test[0].request.path.toUpperCase()).to.be.equal(test[2].path.toUpperCase());
    });

    it('Deberia tener el mismo payload de respuesta', () => {
        expect(test[0].response.body).to.deep.equal(test[1]);
    });

});
