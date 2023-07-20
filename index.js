const mdLinks = require('./mdLinks.js');

const args = process.argv.slice(2); // Remover los primeros dos elementos (node y ruta del script)
const pathFile = args[0];
const options = {
  validate: args.includes('--validate'),
  stats: args.includes('--stats'),
};

mdLinks(pathFile, options)
  .then(links => {
    if (options.stats) {
      const totalLinks = links.length;
      const uniqueLinks = new Set(links.map(link => link.href)).size;
      const brokenLinks = links.filter(link => link.ok === 'fail').length;

      console.log(`Total: ${totalLinks}`);
      console.log(`Únicos: ${uniqueLinks}`);
      if (options.validate) {
        console.log(`Rotos: ${brokenLinks}`);
      }
    } else {
      links.forEach(link => {
        const { href, ok, status, text, file } = link;
        console.log(`${file} ${href} ${options.validate ? ok + ' ' + status : ''} ${text.slice(0, 50)}`);
      });
    }
  })
  .catch(error => {
    console.error(error);
  })