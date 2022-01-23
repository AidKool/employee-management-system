require('dotenv').config();
require('console.table');
const ascii = require('asciiart-logo');
const menu = require('./src/menu');

async function init() {
  const asciiLogo = ascii({ name: 'Employee Manager' }).render();
  console.log(asciiLogo);
  menu();
}

init();
