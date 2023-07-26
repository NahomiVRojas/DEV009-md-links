const fs = require('fs');
const path = require('path');
const axios = require('axios');
const mdLinks = require('../mdLinks.js');
const { validateLink, findlinks } = require('../data.js');

jest.mock('fs', () => ({
  existsSync: jest.fn().mockReturnValue(true),
  promises: {
    readdir: jest.fn().mockImplementation((dirPath) => {
      return Promise.resolve(['Carpeta Prueba', 'archivoHito3.md', 'Prueba Hito 5', 'js.md']);
    }),
    stat: jest.fn().mockImplementation((filePath) => {
      if (filePath.endsWith('Carpeta Prueba') || filePath.endsWith('Prueba Hito 5')) {
        return Promise.resolve({ isDirectory: () => true, isFile: () => false });
      } else {
        return Promise.resolve({ isDirectory: () => false, isFile: () => true });
      }
    }),
    readFile: jest.fn().mockImplementation((filePath) => {
      if (filePath.endsWith('archivoHito3.md')) {
        return `# Título del documento\n\nEste es un ejemplo de archivo Markdown (.md) que contiene diferentes elementos de formato.\n\n## Enlaces\n\nAquí hay algunos ejemplos de enlaces:\n\n- [Enlace a Google](https://www.google.com)\n- [Enlace a Wikipedia](https://www.wikipedia.org)\n- [Enlace a GitHub](https://www.github.com)\n\n## Listas\n\nAquí tienes una lista ordenada y una lista desordenada:\n\n1. Elemento 1\n2. Elemento 2\n3. Elemento 3\n\n- Elemento A\n- Elemento B\n- Elemento C\n\n## npm\n\nEl comando \`npm install\` se utiliza para instalar paquetes en Node.js.`;
      } else {
        return `# Introducción a JavaScript (JS)\n\nJavaScript es un lenguaje de programación interpretado, versátil y ampliamente utilizado en el desarrollo web. A menudo abreviado como JS, es una parte fundamental para crear interactividad en páginas web modernas.\n\n## Características principales de JavaScript\n\n- **Lenguaje interpretado:** No necesita un compilador; el código JS es interpretado directamente por el navegador.\n- **Tipado dinámico:** Las variables pueden cambiar de tipo durante la ejecución del programa.\n- **Orientado a objetos:** Basado en el concepto de objetos y clases.\n- **Cliente y servidor:** Puede ejecutarse tanto en el navegador del cliente como en el servidor (con Node.js).\n\n## Recursos útiles:\n\n1. [Documentación oficial de JavaScript](https://developer.mozilla.org/es/docs/Web/JavaScript): Aquí encontrarás la documentación completa de JavaScript proporcionada por Mozilla Developer Network (MDN).\n\n2. [JavaScript en 30 minutos](https://javascript30.com/): Un curso en línea gratuito que te ayudará a mejorar tus habilidades en JavaScript en solo 30 minutos al día durante 30 días.\n\n3. [Ejemplos de código](https://github.com/yourusername/tus-ejemplos-js): En este repositorio de GitHub, puedes encontrar ejemplos de código en JavaScript para aprender y practicar.\n\n¡Comienza a explorar el maravilloso mundo de JavaScript ahora mismo!`;
      }
    }),
  },
}));

// Mock de data.js para simular el comportamiento de findlinks y validateLink
jest.mock('../data.js', () => ({
  findlinks: jest.fn().mockReturnValue([
    {
      href: 'https://www.google.com',
      text: 'Enlace a Google',
      file: 'archivoHito3.md',
    },
    {
      href: 'https://www.wikipedia.org',
      text: 'Enlace a Wikipedia',
      file: 'archivoHito3.md',
    },
    {
      href: 'https://www.github.com',
      text: 'Enlace a GitHub',
      file: 'archivoHito3.md',
    },
    {
      href: 'https://developer.mozilla.org/es/docs/Web/JavaScript',
      text: 'Documentación oficial de JavaScript',
      file: 'js.md',
    },
    {
      href: 'https://javascript30.com/',
      text: 'JavaScript en 30 minutos',
      file: 'js.md',
    },
    {
      href: 'https://github.com/yourusername/tus-ejemplos-js',
      text: 'Ejemplos de código',
      file: 'js.md',
    },
  ]),
  validateLink: jest.fn().mockResolvedValue({ status: 200, ok: 'ok' }),
}));

describe('mdLinks', () => {
  it('debe devolver un array de objetos de enlaces con validación', () => {
    const filePath = 'C:\\LABORATORIA\\DEV009-md-links';
    const options = { validate: true };

    return mdLinks(filePath, options).then((result) => {
      const expectedOutput = [
        {
          href: 'https://www.google.com',
          text: 'Enlace a Google',
          file: 'archivoHito3.md',
          status: 200,
          ok: 'ok',
        },
        {
          href: 'https://www.wikipedia.org',
          text: 'Enlace a Wikipedia',
          file: 'archivoHito3.md',
          status: 200,
          ok: 'ok',
        },
        {
          href: 'https://www.github.com',
          text: 'Enlace a GitHub',
          file: 'archivoHito3.md',
          status: 200,
          ok: 'ok',
        },
        {
          href: 'https://developer.mozilla.org/es/docs/Web/JavaScript',
          text: 'Documentación oficial de JavaScript',
          file: 'js.md',
          status: 200,
          ok: 'ok',
        },
        {
          href: 'https://javascript30.com/',
          text: 'JavaScript en 30 minutos',
          file: 'js.md',
          status: 200,
          ok: 'ok',
        },
        {
          href: 'https://github.com/yourusername/tus-ejemplos-js',
          text: 'Ejemplos de código',
          file: 'js.md',
          status: 200,
          ok: 'ok',
        },
      ];
      expect(result).toEqual(expectedOutput);
    });
  });

  it('debe devolver un array de objetos de enlaces sin validación', () => {
    const filePath = 'C:\\LABORATORIA\\DEV009-md-links\\Carpeta Prueba\\archivoHito3.md';
    const options = { validate: false };

    return mdLinks(filePath, options).then((result) => {
      const expectedOutput = [
        {
          href: 'https://www.google.com',
          text: 'Enlace a Google',
          file: 'archivoHito3.md',
        },
        {
          href: 'https://www.wikipedia.org',
          text: 'Enlace a Wikipedia',
          file: 'archivoHito3.md',
        },
        {
          href: 'https://www.github.com',
          text: 'Enlace a GitHub',
          file: 'archivoHito3.md',
        },
      ];
      expect(result).toEqual(expectedOutput);
    });
  });

  it('debe devolver un error si el archivo no existe', () => {
    const filePath = 'ruta/inexistente';
    const options = { validate: true };

    return mdLinks(filePath, options).catch((error) => {
      expect(error).toEqual(new Error('La ruta no existe'));
    });
  });
});