const { strongSoapB9 } = require('soap-client-bech');

/**
 * Variables locales estaticas
 */
const url = 'http://167.28.65.55:6106/services/QryCustomerOperRelationsProduct/v1.0?wsdl';
const header = {
  Type: 'Request',
  InstitutionType: 'BECH',
  FeatureId: 'Prueba_Servicio',
  ChannelId: 'HB',
  BranchId: '443',
  TerminalId: '4546',
  Client: {
    UserAgent: 'browser=IE6.0;platform=WINXP;subChannel=3154;',
    Address: '167.28.140.55',
    SessionId: '65454654',
    UserId: '0036050314',
    OperatorId: '123744160',
  },
};


module.exports.QryCustomerOperRelationsProduct = {
  massiveSelectEftAccessionByCustomer: async (req) => {
    const currHeader = Object.assign(header);
    currHeader.ServiceId = 'massiveSelectEftAccessionByCustomer';
    currHeader.TimeStamp = (new Date()).toISOString().replace(/-|:|T|Z|\./g, '');
    const funcionWSDL = ['QryCustomerOperRelationsProduct', 'QryCustomerOperRelationsProduct', currHeader.ServiceId];
    return new Promise(async (resolve, reject) => {
      await strongSoapB9(url, currHeader, req, funcionWSDL)
        .then((resp) => {
          resolve(resp);
        })
        .catch((error) => {
          reject(error.root.Envelope.Body.Fault);
        });
    });
  },
};
