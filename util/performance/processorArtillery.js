'use strict';

const procesaRespuestaPersonasNaturales = (requestSpec, response, context, ee, next) => {
    //console.log(context.vars);
    context.vars.test = '182997315'
    return next();
}

module.exports = {
    procesaRespuestaPersonasNaturales
};
