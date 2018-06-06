'use strict';
const mysql = require('promise-mysql');
const { MYSQL: configMYSQL } = require('../config/config');

/** Modulo para la ejecucion de querys en la BD mysql
 * 
 * @param {string} query 
 */
const queryMYSQL = (query) => {
    let conexion = undefined;
    return mysql.createConnection(configMYSQL)
        .then(
            (conn) => {
                //definimos la conexion de manera global
                conexion = conn;
                //Utilizamos la conexion para realizar el Query requerido y lo retornamos a la cadena
                return conn.query(query);
            }
        )
        .then(
            (response) => {
                //Si y solo si se realiza la llamada correctamente la cerramos la conexion y devolvemos respuesta.
                conexion.end();
                //retornamos la data resuelta
                return response;
            }
        )
        .catch(
            (error) => {
                //Si es que existe error en algun proceso, lo capturamos y cerramos conexion
                conexion.end();
                //retornamos el error rechazado
                return error;
            }
        );
}
module.exports = { queryMYSQL }