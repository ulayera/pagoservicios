const {router, get, post} = require('microrouter');
//const { getPersonaNatural } = require('../repository/getPersonaNatural/getPersonaNatural.controller');
const {getCuentasInscritas} = require('../repository/getCuentasInscritas/getCuentasInscritas.controller');
const {getDetalleCuenta} = require('../repository/getDetalleCuenta/getDetalleCuenta.controller');
const {healthcheck} = require('../repository/healthcheck/healthcheck');
const {notfound} = require('../repository/notFound/notFound');

const api = router(
    get('/servicios/v1/cuentas-inscritas/:rut', getCuentasInscritas),
    // get('/servicios/v1/cuentas-inscritas/:id/', getDetalleCuenta),
    // get('/servicios/v1/personasnaturales/healthcheck', healthcheck),
    // get('/servicios/v1/personasnaturales/:personaNatural', getPersonaNatural),
    get('/*', notfound),
    post('/*', notfound),
);

module.exports = {api};
