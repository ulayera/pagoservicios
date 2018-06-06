const { api } = require('./api/api');
const { crearYconectarCache } = require('redis-bech').cache;
crearYconectarCache();
module.exports = api;