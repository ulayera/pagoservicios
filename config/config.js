const JWT = {
    expiracion: process.env.EXPIRACIONJWT || 120,
    secreto: process.env.SECRETO || 'tokenultrasecreto',
    tipoExpiracion: process.env.TIPOEXPIRACION || 'second'
}

const SOAPLOGINVALIDATION = {
    host: process.env.HOSTSERVICIO || 'http://192.168.228.3:5154',
    path: process.env.PATHSERVICIO || '/services/QryCustomerOperationState/v1.0',
    wsdl: process.env.WSDLSERVICIO || '/services/QryCustomerOperationState/v1.0?WSDL'
}

const MYSQL = {
    host: process.env.HOSTMYSQL || '172.17.200.26',
    port: process.env.PORTMYSQL || '6446',
    user: process.env.USERMYSQL || 'usr_art',
    password: process.env.PASSMYSQL || 'UsrArt.2018',
    database: process.env.DBMYSQL || 'btra_art_mse'
};

const CACHE = {
    expiracion: process.env.EXPIRACIONCACHE || 120
}

const GENERAL = {
    protocoloMS: process.env.PROTOCOLOMS || 'https',
    protocoloPacto: process.env.PROTOCOLOPACTO || 'http',
    hostMS: process.env.HOSTMICROSERVICIO || '172.17.200.7',
    puertoMS: process.env.PUERTOMICROSERVICIO || '443',
    hostContrato: process.env.HOSTCONTRATO || '172.17.200.7',
    puertoContrato: process.env.PUERTOMICROSERVICIO || '8187',
}
module.exports = { JWT, SOAPLOGINVALIDATION, CACHE, GENERAL, MYSQL }