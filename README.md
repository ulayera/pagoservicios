# Microservicio
## Micro — Asynchronous HTTP microservices
Es una librería de bajo tamaño que permite el rápido desarrollo de aplicaciones de tipo HTTP, la cual además posee un modo desarrollador para la depuración de esta y el trabajo ágil, deployando en el mismo segmento de red para el trabajo en equipo.

### Características
* Fácil: Diseñado para el uso de async y await
* Rápido: Ultra-high performance (Includo el parseo JSON)
* Micro: El proyecto completo son ~260 lineas
* Ágil: Fácil despliegue and contenerización
* Simple: Orientado para simples propositos (Función)
* Standard: Sólo HTTP!
* Explicito: No middleware - modulos declaran todas las dependencias
* Liviano: Con todas sus dependencias, el paquete completo pesa menos de un mega

## Estructuración de carpetas
Parte de la definición del artefacto de Microservicios, la estructuración de carpetas se distribuyen en 3 grupos: *api*,*config*, y *repository*. En donde *api* se encontrará todas las definiciones de las APIs expuestas por el Microservicio, *config* se encontrarán todas las configuraciones pertinentes para la ejecución del Microservicio, y finalmente *repository* en donde se encuentran separadas por componentes las operaciones del Microservicio.

### Componentes
La estructuración por componentes da un mayor sentido a las operaciones que se están generando, porque cada una de estas contendrá por si misma un controlador, un esquema de validación, una prueba unitaria, una prueba de contrato, y una prueba de performance. El **nombramiento** de esta operación tiene que tener sentido con la operación que realiza dentro del dominio que se encuentra.

| Tipo Archivo | Nombre Archivo | Requerido |
| :-------------: |:-------------:|:-------------:|
| Controlador | {nombreOperacion}.js | SI |
| Esquema Validador | {nombreOperacion}.scheme.js | NO |
| Prueba Unitaria | {nombreOperacion}.spec.js | SI |
| Prueba de Contrato | {nombreOperacion}.contrato.js | SI |
| Prueba de Performance | {nombreOperacion}.performance.json | SI |

### Repository Tree
```
.
├── api
│   └── api.js
├── config
│   ├── artillery.js
│   ├── config.js
│   ├── desarrollo.csv
│   ├── processorArtillery.js
│   ├── produccion.csv
│   └── qa.csv
├── index.js
├── package.json
├── package-lock.json
├── README.md
├── repository
│   ├── getPersonaNatural
│   │   ├── getPersonaNatural.contrato.js
│   │   ├── getPersonaNatural.contrato.txt
│   │   ├── getPersonaNatural.js
│   │   ├── getPersonaNatural.performance.json
│   │   ├── getPersonaNatural.scheme.js
│   │   └── getPersonaNatural.spec.js
│   └── notFound
│       ├── notFound.js
│       ├── notFound.performance.json
│       └── notFound.spec.js
├── sonarlint.json
└── sonar-project.properties
```

## Pruebas
En el siguiente apartado se comentarán las pruebas requeridas para completitud del microservicio. Cabe agregar que los comandos de ejecuciones se encuentran dentro del **package.json**.
### Unitarias
Son aquellas que se generan con la extensión ***.spec.js** y estas deberán contener las pruebas necesarias para la validación de la operación.
```javascript
//Ejecución de pruebas Unitarias
npm run test
```
### Contrato
Son aquellas que se generan con la extensión ***.contrato.json** y estas deberán contener las pruebas necesarias para la validación de la operación. Cabe agregar que se deberá crear el contrato ([Broker de pactos](http://172.17.200.7:8187)), en donde se definirá las interacciones necesarias de la API expuesta por la operación.
```javascript
//Ejecución de pruebas de Contrato
npm run contrato
```
### Performance
Son aquellas que se generan con la extensión ***.performance.js** y estas deberán contener las pruebas necesarias para la validación de la operación. Cabe agregar que estas pruebas se realizan con una libreria llamada **Artillery**, la cual ya todos los proyectos a partir de este Artefacto tiene configurado por defecto su ejecución.

Para mayor información del uso de esta libería, revisar la [Página Oficial](https://artillery.io/)
```javascript
//Ejecución de pruebas de performance
npm run performance
```


