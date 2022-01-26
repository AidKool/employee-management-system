const inquirer = require('inquirer');

async function askQuestions(questions) {
  try {
    return await inquirer.prompt(questions);
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = askQuestions;
