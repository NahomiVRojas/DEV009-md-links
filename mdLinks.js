const fs = require('fs');
const path = require('path');
const { validateLink, findlinks } = require('./data.js');

function mdLinks(archivoMd, options) {
  const filePath = path.resolve(archivoMd);

  if (!fs.existsSync(filePath)) {
    return Promise.reject(new Error('La ruta no existe'));
  }
  function readMarkdownFiles(dirPath) {
    return fs.promises.readdir(dirPath)
      .then(files => {
        const filePromises = files.map(file => {
          const absolutePath = path.join(dirPath, file);
          return fs.promises.stat(absolutePath)
            .then(stats => {
              if (stats.isDirectory()) {
                return readMarkdownFiles(absolutePath);
              } else if (stats.isFile() && path.extname(file) === '.md') {
                return fs.promises.readFile(absolutePath, 'utf8')
                  .then(fileContent => {
                    const links = findlinks(fileContent, absolutePath);
                    if (options.validate) {
                      const linkPromises = links.map(linkObj => validateLink(linkObj));
                      return Promise.all(linkPromises);
                    } else {
                      return links;
                    }
                  });
              } else {
                // Si no es un archivo .md, retornamos undefined
                return undefined;
              }
            });
        });

        return Promise.all(filePromises).then(results => results.filter(result => result !== undefined).flat());
      });
  }

  return readMarkdownFiles(filePath);
}

module.exports = mdLinks;