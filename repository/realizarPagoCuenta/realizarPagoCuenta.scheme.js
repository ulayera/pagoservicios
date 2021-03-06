

const { Validator, SchemaError } = require('jsonschema');

const v = new Validator();

let schema;

const obtieneRut = (personaNatural) => {
  const indiceDivision = personaNatural.length - 1;
  const rutPersonaNatural = [personaNatural.slice(0, indiceDivision),
    personaNatural.slice(indiceDivision)];
  return rutPersonaNatural;
};

v.attributes.rut = function validarRut(instance, schema, options, ctx) {
  /* istanbul ignore else */
  if (schema.rut) {
    let suma = 0;
    const arrRut = obtieneRut(instance);
    let rutSolo = arrRut[0];
    const verif = arrRut[1];
    let continuar = true;
    for (let i = 2; continuar; i++) {
      suma += (rutSolo % 10) * i;
      rutSolo = parseInt((rutSolo / 10));
      i = (i == 7) ? 1 : i;
      continuar = rutSolo !== 0;
    }
    const resto = suma % 11;
    const dv = 11 - resto;
    if (dv == 10) {
      /* istanbul ignore else */
      if (verif.toUpperCase() === 'K') { return true; }
    } else if (dv == 11 && verif == 0) {
      return true;
    } else if (dv == verif) {
      return true;
    } else {
      throw new SchemaError('Es rut tiene un formato invalido', schema);
    }
  } else {
    return true;
  }
};

const validaRealizarPagoCuenta = (req) => {
  const test = req.params;
  schema = {
    type: 'object',
    properties: {
      rut: {
        type: 'string',
        required: true,
        rut: true,
        pattern: '^0*(\d{1,3}(\.?\d{3})*)\-?([\dkK])$',
      },
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
      monto: {
        type: 'string',
        required: true,
        cantidad: true,
      },
      cuentaOrigen: {
        type: 'string',
        required: true,
        cantidad: true,
      },
      idOperacion: {
        type: 'string',
        required: true,
        cantidad: true,
      },
      numeroDocumento: {
        type: 'string',
        required: true,
        cantidad: true,
      },
    },
  };
  v.validate(test, schema);
};

module.exports = { validaRealizarPagoCuenta };
