const {strongSoapB9} = require('soap-client-bech');
const {exito, malRequest,} = require('arquitecturadigital-bech').mensajeSalida;
const {monitoreoBECH} = require('arquitecturadigital-bech');

/**
 * Variables locales estaticas
 */
const url = 'http://167.28.65.55:6106/services/QryCustomerOperRelationsProduct/v1.0?wsdl';
const header = {
    "Type": "Request",
    "InstitutionType": "BECH",
    "FeatureId": "Prueba_Servicio",
    "ChannelId": "HB",
    "BranchId": "443",
    "TerminalId": "4546",
    "Client": {
        "UserAgent": "browser=IE6.0;platform=WINXP;subChannel=3154;",
        "Address": "167.28.140.55",
        "SessionId": "65454654",
        "UserId": "0036050314",
        "OperatorId": "123744160"
    }
};


module.exports.QryCustomerOperRelationsProduct = {
    massiveSelectEftAccessionByCustomer: async (req) => {
        let currHeader = Object.assign(header);
        currHeader.ServiceId = "massiveSelectEftAccessionByCustomer";
        currHeader.TimeStamp = (new Date()).toISOString().replace(/-|:|T|Z|\./g,'');
        const funcionWSDL = ['QryCustomerOperRelationsProduct', 'QryCustomerOperRelationsProduct', 'massiveSelectEftAccessionByCustomer'];
        return new Promise(async (resolve, reject) => {
            await strongSoapB9(url, currHeader, req, funcionWSDL)
                .then((resp) => {
                    respuesta = exito('Exito en la prueba', resp.result).obtieneMensaje();
                    try {monitoreoBECH(req, respuesta);} catch(e) {console.error(e)}
                    resolve(respuesta);
                })
                .catch((error) => {
                    respuesta = malRequest('Fallo en la prueba', error.root.Envelope.Body.Fault).obtieneMensaje();
                    try {monitoreoBECH(req, respuesta);} catch(e) {console.error(e)}
                    reject(respuesta);
                })
        });
    },
};