const { validaGetPersonaNatural } = require('./getCuentasInscritas.scheme');
const { exito, malRequest } = require('arquitecturadigital-bech').mensajeSalida;
const { monitoreoBECH } = require('arquitecturadigital-bech');
const { logger } = require('arquitecturaDigital');
const { QryCustomerOperRelationsProduct } = require('../clients/QryCustomerOperRelationsProduct');
const { send } = require('micro');

/**
 * TODO: docs
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const getCuentasInscritas = async (req, res) => {
  try {
    validaGetPersonaNatural(req);
    const { rut } = req.params;
    const rutSplitted = obtieneRut(rut);
    const request = {
      headers: {},
      customerIdentification: {
        identificationNumber: rutSplitted[0],
        identificationComplement: rutSplitted[1],
      },
      customerIdentificationUser: {
        identificationNumber: rutSplitted[0],
        identificationComplement: rutSplitted[1],
      },
    };
    QryCustomerOperRelationsProduct.massiveSelectEftAccessionByCustomer(request)
      .then((respuesta) => {
        let arreglo;
        if (respuesta.result.eftsAccessions.eftAccessions.length > 0) {
          arreglo = respuesta.result.eftsAccessions.eftAccessions.map(e => ({
            identificacion: e.identification,
            clienteOrigen: e.originCustomer,
            nombreClienteOrigen: e.originCustomerName,
            conceptoPago: e.paymentConcept,
            selloAdicional: e.stampAdditional,
            objetivoSubproducto: { descripcionCorta: e.subproductTarget.shortDesc },
            nombreCuentaDestino: e.targetAccountName,
          }));
        } else arreglo = [];
        const retorno = exito('Exito', arreglo);
        monitoreoBECH(req, retorno);
        logger.system.info('[MS pagoservicios] GET CUENTAS INSCRITAS - OK');
        send(res, retorno.codigo, retorno);
      })
      .catch((error) => {
        logger.error.error('[MS pagoservicios] GET CUENTAS INSCRITAS - ERROR');
        const respuesta = malRequest('Fallo en la prueba', error).obtieneMensaje();
        monitoreoBECH(req, respuesta);
        send(res, respuesta.codigo, respuesta);
      });
  } catch (error) {
    logger.error.error('[MS pagoservicios] GET CUENTAS INSCRITAS - ERROR');
    const respuesta = malRequest('Fallo en la prueba', error).obtieneMensaje();
    monitoreoBECH(req, respuesta);
    send(res, respuesta.codigo, respuesta);
  }
};

const obtieneRut = (personaNatural) => {
  const indiceDivision = personaNatural.length - 1;
  const rutSinDigito = personaNatural.slice(0, indiceDivision);
  const digitoVerificador = personaNatural.slice(indiceDivision);
  return [rutSinDigito, digitoVerificador];
};

module.exports = { getCuentasInscritas };
