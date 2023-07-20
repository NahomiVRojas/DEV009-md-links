//Funcion encontrar links con expresion regular
function findlinks (contentfile,archivoMd) {
  if(typeof contentfile !== 'string'){
    throw new Error("Parametro incorrecto")
  }

  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links = [];

  let match;
  while ((match = regex.exec(contentfile)) !== null) {
    const text = match[1];
    const href = match[2];
    const file = archivoMd;
    const linkObj = { href, text, file };
    links.push(linkObj)
  }
  return links
}

//Funcion axios validar links de la propiedad href de mi objeto
const axios = require('axios');

function validateLink(objectLink) {
  if(typeof objectLink !== 'object' || objectLink === null){
    throw new Error("Parametro incorrecto")
  }
    return axios.head(objectLink.href)
    .then(response => {
        objectLink.status = response.status;
        objectLink.ok = response.status >= 200 && response.status < 400 ? 'ok' : 'fail';
        return objectLink;
      })
      .catch(error => {
        objectLink.status = error.response ? error.response.status : 404;
        objectLink.ok = 'fail';
        return objectLink;
      });
}

module.exports = {validateLink,findlinks};

