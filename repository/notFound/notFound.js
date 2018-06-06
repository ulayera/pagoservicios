const { send } = require('micro');
const notfound = (req, res) => send(res, 404, {error:'Ruta no encontrada'});

module.exports = { notfound }