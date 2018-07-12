const { router, get, post } = require('microrouter');
const { getCuentasInscritas } = require('../repository/getCuentasInscritas/getCuentasInscritas.controller');
const { getDetalleCuenta } = require('../repository/getDetalleCuenta/getDetalleCuenta.controller');
const { realizarPagoCuenta } = require('../repository/realizarPagoCuenta/realizarPagoCuenta.controller');
const { healthcheck } = require('../repository/healthcheck/healthcheck');
const { notfound } = require('../repository/notFound/notFound');

const api = router(
  get('/microservicio/v1/pagoservicios/personasnaturales/healthcheck', healthcheck),
  get('/microservicio/v1/pagoservicios/cuentas-inscritas/:rut', getCuentasInscritas),
  get('/microservicio/v1/pagoservicios/detalle-cuenta/:identificacion/:conceptoPago', getDetalleCuenta),
  post('/microservicio/v1/pagoservicios/realizar-pago-cuenta', realizarPagoCuenta),
  get('/*', notfound),
  post('/*', notfound),
);

module.exports = { api };
