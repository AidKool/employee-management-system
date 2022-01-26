require('dotenv').config();
require('console.table');
require('colors');
const ascii = require('asciiart-logo');
const menu = require('./src/menu');

async function init() {
  const config = {
    name: 'Employee Manager',
    font: 'Epic',
    lineChars: 8,
    padding: 2,
    margin: 3,
    borderColor: 'red',
    logoColor: 'bold-blue',
    textColor: 'green',
  };

  const asciiLogo = ascii(config).right('version 1.0.0').render();
  console.log(asciiLogo);
  await menu();
}

init();
