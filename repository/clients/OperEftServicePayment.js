const { strongSoapB9 } = require('soap-client-bech');
const { ENV, SERVICES } = require('../../config/config');
/**
 * Variables locales estaticas
 */
// const url = 'http://172.28.115.24:8080/services/OperEftServicePayment/v1.0?wsdl';
const url = SERVICES[ENV].OperEftServicePayment.host + SERVICES[ENV].OperEftServicePayment.wsdl;
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


module.exports.OperEftServicePayment = {
  processEftServicePayments: async (req) => {
    const currHeader = Object.assign(header);
    currHeader.ServiceId = 'processEftServicePayments';
    currHeader.TimeStamp = (new Date()).toISOString().replace(/-|:|T|Z|\./g, '');
    const funcionWSDL = ['OperEftServicePayment', 'OperEftServicePayment', currHeader.ServiceId];
    return new Promise(async (resolve, reject) => {
      await strongSoapB9(url, currHeader, req, funcionWSDL)
        .then((resp) => {
          resolve(resp);
        })
        .catch((error) => {
          console.log("ERRORR",error);
          reject(error.root.Envelope.Body.Fault);
        });
    });
  },
};
