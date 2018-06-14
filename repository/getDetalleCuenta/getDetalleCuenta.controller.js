const { send } = require('micro');
const { validaGetDetalleCuenta } = require('./getDetalleCuenta.scheme');
const { exito, malRequest } = require('arquitecturadigital-bech').mensajeSalida;
const { monitoreoBECH } = require('arquitecturadigital-bech');
const { QryAgreementDebit } = require('../clients/QryAgreementDebit');

/**
 * TODO: docs
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
module.exports.getDetalleCuenta = async (req, res) => {
  let respuesta;
  try {
    await validaGetDetalleCuenta(req);
    const request = {
      eftAccessions: {
        identification: req.params.identificacion,
        originCustomer: req.params.conceptoPago,
      },
    };
    respuesta = await QryAgreementDebit.singleSelectEftDebitsByIdentification(request);
    if (respuesta.result.eftDebits &&
        respuesta.result.eftDebitsOverdue &&
        respuesta.result.eftDebitsImprov) {
      const e = respuesta.result;
      respuesta = {
        deudas: {
          monto: e.eftDebits.amount,
          numeroDocumento: e.eftDebits.documentNumber,
        },
        deudaVencida: {
          fechaVencimiento: e.eftDebitsOverdue.dueDate,
          monto: e.eftDebitsOverdue.amount,
        },
        deudaActual: {
          fechaVencimiento: e.eftDebitsImprov.dueDate,
          monto: e.eftDebitsImprov.amount,
        },
      };
    } else respuesta = {};
    respuesta = exito('Exito', respuesta);
    monitoreoBECH(req, respuesta);
    send(res, respuesta.codigo, respuesta);
  } catch (error) {
    respuesta = malRequest('Fallo en la prueba', error).obtieneMensaje();
    monitoreoBECH(req, respuesta);
    send(res, respuesta.codigo, respuesta);
  }
};
