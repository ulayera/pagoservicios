'use strict';

const procesaRespuestaCuentasInscritas = (requestSpec, response, context, ee, next) => {
    //console.log(context.vars);
    context.vars.test = '90267906';
    return next();
}

module.exports = {
    procesaRespuestaCuentasInscritas
};
