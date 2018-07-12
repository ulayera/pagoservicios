const { send, json } = require('micro');
const { exito, malRequest } = require('arquitecturadigital-bech').mensajeSalida;
const { monitoreoBECH } = require('arquitecturadigital-bech');
const { logger } = require('arquitecturaDigital');

const { validaRealizarPagoCuenta } = require('./realizarPagoCuenta.scheme');
const { OperEftServicePayment } = require('../clients/OperEftServicePayment');

/**
 * TODO: docs
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
module.exports.realizarPagoCuenta = async (req, res) => {
  let respuesta;
  try {
    req.params = await json(req);
    await validaRealizarPagoCuenta(req);
    const {
      rut,
      identificacion,
      conceptoPago,
      monto,
      cuentaOrigen,
      idOperacion,
      numeroDocumento,
    } = req.params;
    const rutSplitted = obtieneRut(rut);
    const request = {
      customerIdentification: {
        identificationNumber: rutSplitted[0],
        identificationComplement: rutSplitted[1],
      },
      eftDebits: {
        originAccount: cuentaOrigen,
        operationId: idOperacion,
        dueDate: '',
        amount: monto,
        paymentConcept: conceptoPago,
        documentNumber: numeroDocumento,
        stampAdditional: conceptoPago,
        identification: identificacion,
        sentDate: '',
      },
    };
    respuesta = await OperEftServicePayment.processEftServicePayments(request);
    respuesta = exito('Exito', {
      codigoReferencia: respuesta.result.eftDebits.referenceNumber,
    });
    monitoreoBECH(req, respuesta);
    send(res, respuesta.codigo, respuesta);
    logger.system.info('[MS pagoservicios] REALIZAR PAGO CUENTA - OK');
  } catch (error) {
    logger.error.error('[MS pagoservicios] REALIZAR PAGO CUENTA - ERROR');
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
