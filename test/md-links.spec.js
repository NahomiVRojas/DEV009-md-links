
const mdLinks  = require('../mdLinks.js');


describe('mdLinks', () => {
  it('should return an array of links when a valid Markdown file is provided', () => {
    const filePath = 'C:\\LABORATORIA\\DEV009-md-links\\Carpeta Prueba';
    const options = { validate: true }; // Opciones de validación habilitadas

    return mdLinks(filePath, options).then((result) => {
      // Verificamos que el resultado sea un array
      expect(Array.isArray(result)).toBe(true);

      // Verificamos que cada elemento del array sea un objeto con las propiedades esperadas
      result.forEach(linkObj => {
        expect(linkObj).toHaveProperty('href');
        expect(linkObj).toHaveProperty('text');
        expect(linkObj).toHaveProperty('file');
        expect(linkObj).toHaveProperty('status');
      });
    });
  });
});

