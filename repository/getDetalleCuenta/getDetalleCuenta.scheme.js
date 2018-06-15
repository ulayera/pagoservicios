

const { Validator, SchemaError } = require('jsonschema');

const v = new Validator();

let schema;

v.attributes.identificacion = function validarIdentificacion(instance, schemaParams) {
  if (instance &&
    schemaParams.identificacion &&
    schemaParams.identificacion !== '') {
    return true;
  }
  throw new SchemaError('Falta el parámetro identificacion', schema);
};

v.attributes.conceptoPago = function validarConceptoPago(instance, schemaParams) {
  if (instance &&
    schemaParams.conceptoPago &&
    schemaParams.conceptoPago !== '') {
    return true;
  }
  throw new SchemaError('Falta el parámetro clienteOrigen', schema);
};

const validaGetDetalleCuenta = (req) => {
  const test = req.params;
  schema = {
    type: 'object',
    properties: {
      identificacion: {
        type: 'string',
        required: true,
        identificacion: true,
      },
      conceptoPago: {
        type: 'string',
        required: true,
        conceptoPago: true,
      },
    },
  };
  v.validate(test, schema);
};

module.exports = { validaGetDetalleCuenta };
