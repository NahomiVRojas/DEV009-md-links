const mdLinks = require('./mdLinks.js')

const pathFile = 'C:\\LABORATORIA\\DEV009-md-links\\Carpeta Prueba';

mdLinks(pathFile, true)
  .then(links => {
    console.log(links);
  })
  .catch(error => {
    console.log(error);
  });
