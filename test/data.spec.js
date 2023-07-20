const fs = require('fs');
const path = require('path');
const axios = require('axios');

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

    expect(() => findlinks(contentefail, archivoMd)).toThrowError('Parametro incorrecto')
  });
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

  it('Deberia devolver un error si parametro entregado no es un objeto', () =>{
    const contentefail = 123;
    expect(() => validateLink(contentefail)).toThrowError('Parametro incorrecto');
  });
});