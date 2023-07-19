const fs = require('fs');
const path = require('path');
const axios = require('axios');

const mdLinks  = require('../mdLinks.js');
const { validateLink, findlinks } = require('../data.js');

jest.mock('fs');
jest.mock('axios');

describe('findlinks', () => {
  it('debe extraer correctamente los enlaces del contenido del archivo', () => {
    const contentfile = '[Markdown](https://es.wikipedia.org/wiki/Markdown), [Node.js](https://nodejs.org/es/), [course-parser](https:///Laboratoria/course-parser)';
    const archivoMd = 'C:\\LABORATORIA\\DEV009-md-links\\links.md';

    const expectedLinks = [
      {
        file: 'C:\\LABORATORIA\\DEV009-md-links\\links.md',
        href: 'https://es.wikipedia.org/wiki/Markdown',
        text: 'Markdown'
      },
      {
        file: 'C:\\LABORATORIA\\DEV009-md-links\\links.md',
        href: 'https://nodejs.org/es/',
        text: 'Node.js'
      },
      {
        file: 'C:\\LABORATORIA\\DEV009-md-links\\links.md',
        href: 'https:///Laboratoria/course-parser',
        text: 'course-parser'
      }
    ];

    const result = findlinks(contentfile, archivoMd);
    expect(result).toEqual(expectedLinks);
  });
  it('Deberia devolver un error si el primer parametro es diferente de un string', () =>{
    const contentefail = 123
    const archivoMd = 'C:\\LABORATORIA\\DEV009-md-links\\links.md';

    //const result = findlinks(contentefail, archivoMd);
    expect(() => findlinks(contentefail, archivoMd)).toThrowError('Parametro incorrecto')
  })
});

describe('validateLink', () => {
  it('debe retornar el estado y la validez del enlace utilizando axios.head()', () => {
    const objectLink = { href: 'https://es.wikipedia.org/wiki/Markdown', text: 'Markdown', file: 'C:\\LABORATORIA\\DEV009-md-links\\links.md' };
    const response = { status: 200 };

    axios.head.mockResolvedValue(response);

    const expectedOutput = {
      href: 'https://es.wikipedia.org/wiki/Markdown',
      text: 'Markdown',
      file: 'C:\\LABORATORIA\\DEV009-md-links\\links.md',
      status: 200,
      ok: 'ok'
    };

    return validateLink(objectLink).then(result => {
      expect(result).toEqual(expectedOutput);
    });
  });
});

describe('mdLinks', () => {
  describe('sin validación de enlaces', () => {
    beforeAll(() => {
      const carpetaPrueba = 'C:\\LABORATORIA\\DEV009-md-links\\Carpeta Prueba';
      const validate = false;
      const expectedLinks = [
        // Los enlaces esperados para la prueba sin validación de enlaces
        {
          href: 'https://www.google.com',
          text: 'Enlace a Google',
          file: 'C:\\LABORATORIA\\DEV009-md-links\\Carpeta Prueba\\archivoHito3.md'
        },
        {
          href: 'https://www.wikipedia.orrrg',
          text: 'Enlace a Wikipedia',
          file: 'C:\\LABORATORIA\\DEV009-md-links\\Carpeta Prueba\\archivoHito3.md'
        },
        {
          href: 'https://www.github.com',
          text: 'Enlace a GitHub',
          file: 'C:\\LABORATORIA\\DEV009-md-links\\Carpeta Prueba\\archivoHito3.md'
        },
        {
          href: 'https://developer.mozilla.org/es/docs/Web/JavaScript',
          text: 'Documentación oficial de JavaScript',
          file: 'C:\\LABORATORIA\\DEV009-md-links\\Carpeta Prueba\\Prueba Hito 5\\js.md'
        },
        {
          href: 'https://javascript30.com/',
          text: 'JavaScript en 30 minutos',
          file: 'C:\\LABORATORIA\\DEV009-md-links\\Carpeta Prueba\\Prueba Hito 5\\js.md'
        },
        {
          href: 'https://github.com/yourusername/tus-ejemplos-js',
          text: 'Ejemplos de código',
          file: 'C:\\LABORATORIA\\DEV009-md-links\\Carpeta Prueba\\Prueba Hito 5\\js.md'
        },
        // Otros enlaces esperados...
      ];

      // Mock fs.existsSync() para que devuelva true y simular que la carpeta existe
      fs.existsSync.mockReturnValue(true);

      // Mock fs.promises.readdir() para simular la lista de archivos dentro de la carpeta
      fs.promises.readdir.mockResolvedValue(['archivoHito3.md', 'js.md']);

      // Mock fs.promises.stat() para simular los stats de los archivos
      fs.promises.stat.mockImplementation(filePath => {
        return {
          isFile: () => filePath.endsWith('.md'),
          isDirectory: () => !filePath.endsWith('.md'),
        };
      });

      // Mock fs.promises.readFile() para que devuelva el contenido de los archivos de prueba
      fs.promises.readFile.mockImplementation((filePath, options) => {
        // Contenido del archivo archivo.md
        if (filePath.endsWith('archivoHito3.md')) {
          return Promise.resolve(`
            # Título del documento

            Este es un ejemplo de archivo Markdown (.md) que contiene diferentes elementos de formato.

            ## Enlaces

            Aquí hay algunos ejemplos de enlaces:

            - [Enlace a Google](https://www.google.com)
            - [Enlace a Wikipedia](https://www.wikipedia.org)
            - [Enlace a GitHub](https://www.github.com)
          `);
        }

        // Contenido del archivo Prueba Hito 5/js.md
        if (filePath.endsWith('js.md')) {
          return Promise.resolve(`
            ## Recursos útiles:

            1. [Documentación oficial de JavaScript](https://developer.mozilla.org/es/docs/Web/JavaScript): Aquí encontrarás la documentación completa de JavaScript proporcionada por Mozilla Developer Network (MDN).

            2. [JavaScript en 30 minutos](https://javascript30.com/): Un curso en línea gratuito que te ayudará a mejorar tus habilidades en JavaScript en solo 30 minutos al día durante 30 días.

            3. [Ejemplos de código](https://github.com/yourusername/tus-ejemplos-js): En este repositorio de GitHub, puedes encontrar ejemplos de código en JavaScript para aprender y practicar.
          `);
        }
      });

      // Guardamos las variables relevantes para la prueba en el contexto del describe
      // para que estén disponibles en la prueba (it) dentro de este bloque
      this.carpetaPrueba = carpetaPrueba;
      this.validate = validate;
      this.expectedLinks = expectedLinks;
    });

    it('debe retornar los enlaces encontrados sin validación', () => {
      // Ejecutar la función mdLinks para obtener los resultados
      return mdLinks(this.carpetaPrueba, this.validate).then(result => {
        expect(result).toEqual(this.expectedLinks);
      });
    });
  });

  describe('con validación de enlaces', () => {
    beforeAll(() => {
      const carpetaPrueba = 'C:\\LABORATORIA\\DEV009-md-links\\Carpeta Prueba';
      const validate = true;
      const expectedLinks = [
        {
          href: 'https://www.google.com',
          text: 'Enlace a Google',
          file: 'C:\\LABORATORIA\\DEV009-md-links\\Carpeta Prueba\\archivoHito3.md',
          status: 200,
          ok: 'ok'
        },
        {
          href: 'https://www.wikipedia.orrrg',
          text: 'Enlace a Wikipedia',
          file: 'C:\\LABORATORIA\\DEV009-md-links\\Carpeta Prueba\\archivoHito3.md',
          status: 404,
          ok: 'fail'
        },
        {
          href: 'https://www.github.com',
          text: 'Enlace a GitHub',
          file: 'C:\\LABORATORIA\\DEV009-md-links\\Carpeta Prueba\\archivoHito3.md',
          status: 200,
          ok: 'ok'
        },
        {
          href: 'https://developer.mozilla.org/es/docs/Web/JavaScript',
          text: 'Documentación oficial de JavaScript',
          file: 'C:\\LABORATORIA\\DEV009-md-links\\Carpeta Prueba\\Prueba Hito 5\\js.md',
          status: 200,
          ok: 'ok'
        },
        {
          href: 'https://javascript30.com/',
          text: 'JavaScript en 30 minutos',
          file: 'C:\\LABORATORIA\\DEV009-md-links\\Carpeta Prueba\\Prueba Hito 5\\js.md',
          status: 200,
          ok: 'ok'
        },
        {
          href: 'https://github.com/yourusername/tus-ejemplos-js',
          text: 'Ejemplos de código',
          file: 'C:\\LABORATORIA\\DEV009-md-links\\Carpeta Prueba\\Prueba Hito 5\\js.md',
          status: 404,
          ok: 'fail'
        }
      ];

      fs.existsSync.mockReturnValue(true);

      // Mock fs.promises.readdir() para simular la lista de archivos dentro de la carpeta
      fs.promises.readdir.mockResolvedValue(['archivoHito3.md', 'js.md']);

      // Mock fs.promises.stat() para simular los stats de los archivos
      fs.promises.stat.mockImplementation(filePath => {
        return {
          isFile: () => filePath.endsWith('.md'),
          isDirectory: () => !filePath.endsWith('.md'),
        };
      });

      // Mock fs.promises.readFile() para que devuelva el contenido de los archivos de prueba
      fs.promises.readFile.mockImplementation((filePath, options) => {
        // Contenido del archivo archivo.md
        if (filePath.endsWith('archivoHito3.md')) {
          return Promise.resolve(`
            # Título del documento

            Este es un ejemplo de archivo Markdown (.md) que contiene diferentes elementos de formato.

            ## Enlaces

            Aquí hay algunos ejemplos de enlaces:

            - [Enlace a Google](https://www.google.com)
            - [Enlace a Wikipedia](https://www.wikipedia.org)
            - [Enlace a GitHub](https://www.github.com)
          `);
        }

        // Contenido del archivo Prueba Hito 5/js.md
        if (filePath.endsWith('js.md')) {
          return Promise.resolve(`
            ## Recursos útiles:

            1. [Documentación oficial de JavaScript](https://developer.mozilla.org/es/docs/Web/JavaScript): Aquí encontrarás la documentación completa de JavaScript proporcionada por Mozilla Developer Network (MDN).

            2. [JavaScript en 30 minutos](https://javascript30.com/): Un curso en línea gratuito que te ayudará a mejorar tus habilidades en JavaScript en solo 30 minutos al día durante 30 días.

            3. [Ejemplos de código](https://github.com/yourusername/tus-ejemplos-js): En este repositorio de GitHub, puedes encontrar ejemplos de código en JavaScript para aprender y practicar.
          `);
        }
      });
      
      this.carpetaPrueba = carpetaPrueba;
      this.validate = validate;
      this.expectedLinks = expectedLinks;
    });

    it('debe retornar los enlaces encontrados con validación', () => {
      // Ejecutar la función mdLinks para obtener los resultados
      return mdLinks(this.carpetaPrueba, this.validate).then(result => {
        expect(result).toEqual(this.expectedLinks);
      });
    });
  });
});