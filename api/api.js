const { router, get, post } = require('microrouter');
const { getPersonaNatural } = require('../repository/getPersonaNatural/getPersonaNatural.controller');
const { healthcheck } = require('../repository/healthcheck/healthcheck');
const { notfound } = require('../repository/notFound/notFound');

const api = router(
  get('/servicios/v1/personasnaturales/healthcheck', healthcheck),
  get('/servicios/v1/personasnaturales/:personaNatural', getPersonaNatural),
  get('/*', notfound),
  post('/*', notfound),
);

module.exports = { api };
