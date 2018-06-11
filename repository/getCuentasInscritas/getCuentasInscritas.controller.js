const { send } = require('micro');
const { validaGetPersonaNatural } = require('./getCuentasInscritas.scheme');
const { QryCustomerOperRelationsProduct } = require('../clients/QryCustomerOperRelationsProduct');

/**
 * Variables locales dinamicas
 */
let respuesta;

/**
 * Variables locales estaticas
 */
const url = 'http://167.28.65.55:6106/services/QryCustomerOperRelationsProduct/v1.0?wsdl';
const funcionWSDL = ['QryCustomerOperRelationsProduct', 'QryCustomerOperRelationsProduct', 'massiveSelectEftAccessionByCustomer'];
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

/**
 * TODO: docs
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
module.exports.getCuentasInscritas = async (req, res) => {

    try {
        await validaGetPersonaNatural(req);
        const { rut } = req.params;
        const rutSplitted = obtieneRut(rut);

        const request = {
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
        send(res, respuesta.codigo, respuesta);
    } catch (error) {
        respuesta = malRequest('Fallo en la prueba', error).obtieneMensaje();
        try {monitoreoBECH(req, respuesta);} catch(e) {console.error(e)}
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