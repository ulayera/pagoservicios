const { send } = require('micro');
const { strongSoapB9 } = require('soap-client-bech');
const {exito, malRequest,} = require('arquitecturadigital-bech').mensajeSalida;
const { validaGetPersonaNatural } = require('./getDetalleCuenta.scheme');

/**
 * Variables locales dinamicas
 */
let respuesta;

/**
 * TODO: docs
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
module.exports.getDetalleCuenta = async (req, res) => {

    try {
        await validaGetPersonaNatural(req);
        const { rut } = req.params;
        const rutSplitted = obtieneRut(rut);

        const request = {
            customerIdentification: {
                identificationNumber: rutSplitted[0],
                identificationComplement: rutSplitted[1],
            },
        };
        let json = require('./getDetalleCuenta.example.response');
        respuesta = exito('Exito en la consulta', json.eftAccessions).obtieneMensaje();
        send(res, respuesta.codigo,respuesta);
    } catch (error) {
        respuesta = malRequest('Fallo en la prueba', error).obtieneMensaje();
        monitoreoBECH(req, respuesta);
        send(res, respuesta.codigo, respuesta)
    }
};


const obtieneRut = (personaNatural) => {
    const indiceDivision = personaNatural.length - 1;
    const rutSinDigito = personaNatural.slice(0, indiceDivision);
    const digitoVerificador = personaNatural.slice(indiceDivision);
    const rutPersonaNatural = [rutSinDigito, digitoVerificador];
    return rutPersonaNatural;
};