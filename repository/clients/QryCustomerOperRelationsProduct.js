const { strongSoapB9 } = require('soap-client-bech');
const { ENV, SERVICES } = require('../../config/config');

/**
 * Variables locales estaticas
 */
const url = SERVICES[ENV].QryCustomerOperRelationsProduct.host + SERVICES[ENV].QryCustomerOperRelationsProduct.wsdl;
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
    strongSoapB9(url, currHeader, req, funcionWSDL)
      .then((resp) => {
        return resp;
      })
      .catch((error) => {
        throw error.root.Envelope.Body.Fault;
      });
  },
};
