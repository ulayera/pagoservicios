const fse = require('fs-extra');
const path = require('path');
const dirFolder = path.resolve(__dirname, '../../output');
try {
  const files = fse.readdirSync(dirFolder);
  let dirArchivo = '',
    err = 0;
  for (file of files) {
    if (file !== '.gitkeep') {
      obj = fse.readJsonSync(path.resolve(__dirname, '../../output/' + file))
      objetoPrueba = obj.aggregate;
      if (Object.keys(objetoPrueba.errors).length !== 0 || objetoPrueba.errors.constructor !== Object) {
        err++;
        console.log(`Archivo: ${file} - NOTOK`);
      }
      if (Object.keys(objetoPrueba.codes).length === 1 && objetoPrueba.codes.constructor === Object && objetoPrueba.codes.hasOwnProperty('200')) {
        console.log(`Archivo: ${file} - OK`);
      } else {
        err++;
        console.log(`Archivo: ${file} - NOTOK`);
      }
    }
  }
  if (err > 0) {
    throw new Error('Error en los resultados de las pruebas!');
  }
} catch (error) {
  throw new Error(error);
}