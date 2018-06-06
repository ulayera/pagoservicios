

const { send } = require('micro');
const { strongSoapB9 } = require('soap-client-bech');
const {
  exito, malRequest,
} = require('arquitecturadigital-bech').mensajeSalida;
const { monitoreoBECH } = require('arquitecturadigital-bech');
const { validaGetPersonaNatural } = require('./getPersonaNatural.scheme');
/**
 * Variables locales dinamicas
 */
let respuesta;

/**
 * Variables locales estaticas
 */
const url = 'http://167.28.65.55:6106/services/QryCustomerInformationForLogin/v1.1?wsdl';
const funcionWSDL = ['QryCustomerInformationForLogin', 'QryCustomerInformationForLogin', 'singleSelectCustomerDataForLogin'];

const obtieneRut = (personaNatural) => {
  const indiceDivision = personaNatural.length - 1;
  const rutSinDigito = personaNatural.slice(0, indiceDivision);
  const digitoVerificador = personaNatural.slice(indiceDivision);
  const rutPersonaNatural = [rutSinDigito, digitoVerificador];
  return rutPersonaNatural;
};

/** Operacion que retorna datos de la persona natural
 * @param {JSON} req request de la llamada
 * @param {JSON} res response de la llamada
 */
const getPersonaNatural = async (req, res) => {
  try {
    await validaGetPersonaNatural(req);
    const { personaNatural } = req.params;
    const rutPersonaNatural = obtieneRut(personaNatural);

    const header = {
      ServiceId: 'singleSelectCustomerDataForLogin',
      Type: 'Request',
      ServiceVersion: '1.0',
      InstitutionType: 'UNDEFINED',
      Locale: 'es_CL',
      ChannelDispatchDate: '',
      CustomProperties: '',
      TraceNumber: '',
      SourceDate: '',
      InstitutionId: '',
      OrganizationId: '',
      BranchId: '',
      ChannelId: 'HB',
      UserId: '',
      FeatureId: 'req.headers.funcionalidad',
      ErrorCode: '',
      Client: {
        UserAgent: '',
        Address: 'req.connection.remoteAddress',
        SessionId: 'datosToken.idSesion',
        UserId: 'identificationNumber',
      },
    };

    const request = {
      customerIdentification: {
        identificationNumber: rutPersonaNatural[0],
        identificationComplement: rutPersonaNatural[1],
      },
    };

    await strongSoapB9(url, header, request, funcionWSDL)
      .then((resp) => {
        respuesta = exito('Exito en la prueba', resp.result).obtieneMensaje();
        monitoreoBECH(req, respuesta);
        send(res, respuesta.codigo, respuesta);
      })
      .catch((error) => {
        respuesta = malRequest('Fallo en la prueba', error.root.Envelope.Body.Fault).obtieneMensaje();
        monitoreoBECH(req, respuesta);
        send(res, respuesta.codigo, respuesta);
      });
  } catch (error) {
    respuesta = malRequest('Fallo en la prueba', error).obtieneMensaje();
    monitoreoBECH(req, respuesta);
    send(res, respuesta.codigo, respuesta);
  }
};

module.exports = { getPersonaNatural };
