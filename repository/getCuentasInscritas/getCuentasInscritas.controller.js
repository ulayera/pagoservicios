const { send } = require('micro');
const { validaGetPersonaNatural } = require('./getCuentasInscritas.scheme');
const { exito, malRequest } = require('arquitecturadigital-bech').mensajeSalida;
const { monitoreoBECH } = require('arquitecturadigital-bech');
const { logger } = require('arquitecturaDigital');
const { QryCustomerOperRelationsProduct } = require('../clients/QryCustomerOperRelationsProduct');

/**
 * TODO: docs
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const getCuentasInscritas = async (req, res) => {
  let respuesta;
  try {
    await validaGetPersonaNatural(req);
    const { rut } = req.params;
    const rutSplitted = obtieneRut(rut);
    const request = {
      heasders: {},
      customerIdentification: {
        identificationNumber: rutSplitted[0],
        identificationComplement: rutSplitted[1],
      },
      customerIdentificationUser: {
        identificationNumber: rutSplitted[0],
        identificationComplement: rutSplitted[1],
      },
    };
    respuesta = await QryCustomerOperRelationsProduct.massiveSelectEftAccessionByCustomer(request);
    if (respuesta.result.eftsAccessions.eftAccessions.length > 0
    ) {
      respuesta = respuesta.result.eftsAccessions.eftAccessions.map(e => ({
        identificacion: e.identification,
        clienteOrigen: e.originCustomer,
        nombreClienteOrigen: e.originCustomerName,
        conceptoPago: e.paymentConcept,
        selloAdicional: e.stampAdditional,
        objetivoSubproducto: { descripcionCorta: e.subproductTarget.shortDesc },
        nombreCuentaDestino: e.targetAccountName,
      }));
    } else respuesta = [];
    respuesta = exito('Exito', respuesta);
    monitoreoBECH(req, respuesta);
    send(res, respuesta.codigo, respuesta);
    logger.system.info('[MS pagoservicios] GET CUENTAS INSCRITAS - OK');
  } catch (error) {
    logger.error.error('[MS pagoservicios] GET CUENTAS INSCRITAS - ERROR');
    respuesta = malRequest('Fallo en la prueba', error).obtieneMensaje();
    monitoreoBECH(req, respuesta);
    send(res, respuesta.codigo, respuesta);
  }
};


const obtieneRut = (personaNatural) => {
  const indiceDivision = personaNatural.length - 1;
  const rutSinDigito = personaNatural.slice(0, indiceDivision);
  const digitoVerificador = personaNatural.slice(indiceDivision);
  const rutPersonaNatural = [rutSinDigito, digitoVerificador];
  return rutPersonaNatural;
};

module.exports = { getCuentasInscritas };
