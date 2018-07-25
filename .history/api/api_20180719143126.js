const { router, get, post } = require('microrouter');
const { getCuentasInscritas } = require('../repository/getCuentasInscritas/getCuentasInscritas.controller');
const { getDetalleCuenta } = require('../repository/getDetalleCuenta/getDetalleCuenta.controller');
const { realizarPagoCuenta } = require('../repository/realizarPagoCuenta/realizarPagoCuenta.controller');
const { healthcheck } = require('../repository/healthcheck/healthcheck');
const { notfound } = require('../repository/notFound/notFound');

const api = router(
  get('/microservicio/v1/pagoservicios/cuentasInscritas/:rut', getCuentasInscritas),
  get('/microservicio/v1/pagoservicios/detalleCuenta/:identificacion/:conceptoPago', getDetalleCuenta),
  post('/microservicio/v1/pagoservicios/realizarPagoCuenta', realizarPagoCuenta),
  get('/*', notfound),
  post('/*', notfound),
);

module.exports = { api };
