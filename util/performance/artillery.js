const exec = require('child-process-promise').exec;
//let override = process.env.OVERRIDEPRUEBAPERFORMANCE || {};
let override = {
  "config": {
    "target": process.env.TARGETPP || "http://localhost:3000",
    "phases": [
      {
        "duration": "1",
        "arrivalRate": 1
      }
    ],
    "processor": "../../util/performance/processorArtillery.js",
    "payload": [
      {
        "path": `../../config/${process.env.ENVIRONMENTCSV || 'desarrollo'}.csv`,
        "fields": [
          "x",
          "rut"
        ]
      }
    ]
  }
};
let pathResult = process.env.OUTPUTPRUEBAPERFORMANCE || './output';

exec('find ./repository/ -name "*.performance.json"')
  .then(
    (result) => {
      const stdout = result.stdout;
      const direccionArchivosPP = stdout.split('\n');
      for (let i = 0, nombrePrueba = ''; i < direccionArchivosPP.length - 1; i++) {
        const toOverride = JSON.stringify(override);
        nombrePrueba = direccionArchivosPP[i].split('/');
        nombrePrueba = nombrePrueba[nombrePrueba.length - 1].split('.')[0];
        exec(`artillery run -q --overrides ${JSON.stringify(toOverride)} -o ${pathResult}/${nombrePrueba}.json ${direccionArchivosPP[i]}`)
          .then(
            (result) => {
              //console.log(result.stdout);
            }
          )
          .catch(
            (err) => {
              //console.error('ERROR: ', err);
            }
          );
      }


    }
  ).catch(
  (err) => {
    console.error('ERROR: ', err);
  }
);

