# Markdown Links

## Índice

* [1. Preámbulo](#1-preámbulo)
* [2. Resumen del proyecto](#2-resumen-del-proyecto)
* [3. Características principales](#3-caracteristicas-principales)
* [4. Flujo funcion Md-Links](#4-flujo-funcion-Md-Links)
* [5. Instalacion](#5-instalacion)
* [6. Entregables](#6-entregables)

***

## 1. Preámbulo

[Markdown](https://es.wikipedia.org/wiki/Markdown) es un lenguaje de marcado
ligero muy popular entre developers. Es usado en muchísimas plataformas que
manejan texto plano (GitHub, foros, blogs, ...) y es muy común
encontrar varios archivos en ese formato en cualquier tipo de repositorio
(empezando por el tradicional `README.md`).

Estos archivos `Markdown` normalmente contienen _links_ (vínculos/ligas) que
muchas veces están rotos o ya no son válidos y eso perjudica mucho el valor de
la información que se quiere compartir.

## 2. Resumen del proyecto

El proyecto "Md-Links" es una herramienta que permite analizar archivos Markdown (.md) en busca de enlaces y validar su estado de disponibilidad en la web.
Esta aplicación ha sido desarrollada utilizando JavaScript y Node.js, brindando una solución efectiva y versátil para aquellos que trabajan con documentos Markdown y desean verificar la integridad de los enlaces que contienen.

## 3. Características principales

* `Extracción de enlaces`: La herramienta es capaz de extraer todos los enlaces presentes en los archivos Markdown de forma precisa, 
                       identificando tanto el texto del enlace como su URL.
* `Validacion de enlaces`: Para aquellos usuarios que deseen asegurarse de que los enlaces dentro de sus archivos siguen siendo válidos,
                      la herramienta ofrece una opción para validar el estado de cada enlace mediante peticiones HTTP.
* `Información detallada`: El resultado del análisis muestra información detallada sobre cada enlace, incluyendo su estado HTTP y si ha pasado la validación, 
                        lo que permite identificar enlaces rotos y realizar correcciones necesarias.

## 4. Flujo funcion Md-Links

<img width="489" alt="image" src="https://github.com/NahomiVRojas/DEV009-md-links/assets/127104999/e029125d-a82b-4b1c-a740-7be3f224c590">

## 5. Instalacion

Para poder Instalar la libreria se debera ejecutar el siguiente comando:

```npm install NahomiVRojas/md-links```

## 6. Especificaciones

### Para mostrar en consola la informacion de los archivos .md
```md-links 'path'```

Ejemplo:
```
PS C:\LABORATORIA\DEV009-md-links> md-links 'C:\LABORATORIA\DEV009-md-links\Carpeta Prueba'
C:\LABORATORIA\DEV009-md-links\Carpeta Prueba\archivoHito3.md https://www.google.com  Enlace a Google
C:\LABORATORIA\DEV009-md-links\Carpeta Prueba\archivoHito3.md https://www.wikipedia.org  Enlace a Wikipedia
C:\LABORATORIA\DEV009-md-links\Carpeta Prueba\archivoHito3.md https://www.github.com  Enlace a GitHub
C:\LABORATORIA\DEV009-md-links\Carpeta Prueba\Prueba Hito 5\js.md https://developer.mozilla.org/es/docs/Web/JavaScript  Documentación oficial de JavaScript
C:\LABORATORIA\DEV009-md-links\Carpeta Prueba\Prueba Hito 5\js.md https://javascript30.com/  JavaScript en 30 minutos
C:\LABORATORIA\DEV009-md-links\Carpeta Prueba\Prueba Hito 5\js.md https://github.com/yourusername/tus-ejemplos-js  Ejemplos de código
PS C:\LABORATORIA\DEV009-md-links>```

### Para mostrar los links validados
```md-links 'path' --validate ```

Ejemplo:
```
PS C:\LABORATORIA\DEV009-md-links> md-links 'C:\LABORATORIA\DEV009-md-links\Carpeta Prueba' --validate
C:\LABORATORIA\DEV009-md-links\Carpeta Prueba\archivoHito3.md https://www.google.com ok <span style="color: red;">200 </span>Enlace a Google
C:\LABORATORIA\DEV009-md-links\Carpeta Prueba\archivoHito3.md https://www.wikipedia.org ok <span style="color: red;">200 </span> Enlace a Wikipedia
C:\LABORATORIA\DEV009-md-links\Carpeta Prueba\archivoHito3.md https://www.github.com ok <span style="color: red;">200 </span> Enlace a GitHub
C:\LABORATORIA\DEV009-md-links\Carpeta Prueba\Prueba Hito 5\js.md https://developer.mozilla.org/es/docs/Web/JavaScript ok <span style="color: red;">200 </span> Documentación oficial de JavaScript
C:\LABORATORIA\DEV009-md-links\Carpeta Prueba\Prueba Hito 5\js.md https://javascript30.com/ ok <span style="color: red;">200 </span> JavaScript en 30 minutos
C:\LABORATORIA\DEV009-md-links\Carpeta Prueba\Prueba Hito 5\js.md https://github.com/yourusername/tus-ejemplos-js fail <span style="color: red;">404 </span> Ejemplos de código ```

### Para mostrar la cantidad de links unicos encontrados
```md-links 'path' --stats ```

Ejemplo:
```PS C:\LABORATORIA\DEV009-md-links> md-links 'C:\LABORATORIA\DEV009-md-links\Carpeta Prueba' --stats
Total: 6
Únicos: 6 ```

### Para mostrar los links rotos
```md-links 'path' --validate --stats ```

Ejemplo:
```PS C:\LABORATORIA\DEV009-md-links> md-links 'C:\LABORATORIA\DEV009-md-links\Carpeta Prueba' --validate --stats
Total: 6
Únicos: 6
Rotos: 1```
