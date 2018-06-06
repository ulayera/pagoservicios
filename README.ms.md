# Microservicio - pagoservicios

Descripción inicial

1. [Ownership](/readme.md#1-ownership)
2. [Estructura](/readme.md#2-Estructura)
3. [Operaciones](/readme.md#2-operaciones)
4. [API Spec](/readme.md#3-api-spec)
5. [Despliegue](/readme.md#4-despliegue)
6. [Colaboración](/readme.md#5-colaboraci%C3%B3n)
7. [Pruebas](/readme.md#5-Pruebas)


## 1. Ownership
Esta sección detalla quién es el responsable del ciclo de vida del microservicio.

### 1.1. Business Owner
Unidad de negocio responsable y dueña del microservicio. 
  - Unidad de Negocio: [Nombre]
  - Responsable: [Nombre]
  --- Contacto: [usuario]@bancoestado.cl - Teléfono: +56-[Teléfono]

### 1.2. Equipos
Células que desarrollan y mantienen el microservicio.

#### 1.2.1 Célula [Nombre] 
  - Proyecto: [Nombre]
  - Scrum Master: [Nombre]
  --- Contacto: [Nombre]@bancoestado.cl - Teléfono: +56-[Teléfono]
  - Arquitecto de Microservicio: [Nombre]
  --- Contacto: [Nombre]@bancoestado.cl- Teléfono: +56-[Teléfono]

## 2. Estructura
### Estructuración de carpetas
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

## 3. Operaciones
Detalla las operaciones que se pueden explotar a través del microservicio. 

| Operación | Descripción Capacidad | Sistemas Involucrados | 
| ------ | ------ | ------ | ------ | 

## 4. API Spec
| HTTP | PATH | Parametros| Descripción|
| ------ | ------ | ------ | ------ |

## 5. Despliegue
Especifica la forma en que se despliega la aplicación:

* Para desplegarlo en local, a efectos de desarrollo se ejecuta con
    ```
    npm run dev
    ```

    Con este comando se ejecuta por defecto en el puerto 3000, para cambiar de puerto setear la variable PORTMICRO

* El despliegue en ambientes banco (desarrollo, QA y prod) se hace con npm start, el cual implica que este la variable de entorno PORTMICRO con el número de puerto definido

## 6. Colaboración
En el caso de que se desea iniciar un nuevo desarrollo a partir de la última versión en producción o colaborar.

### 6.1. Iniciar un Nuevo Desarrollo
Iniciar un nuevo desarrollo a partir de la última versión en producción.

| Ambiente de Trabajo | Nombre del Branch |
| ------ | ------ |
| Desarrollo | master |

### 6.2. Colaborar en Actual Desarrollo
Comenzar a colaborar en la creación de un microservicio ya ha iniciado su desarrollo.

| Ambiente de Trabajo | Nombre del Branch |
| ------ | ------ |
| Integración Continua | Desarrollo_CI |

## 7. Pruebas
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


