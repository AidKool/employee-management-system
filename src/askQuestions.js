const inquirer = require('inquirer');

async function askQuestions(questions) {
  try {
    const answers = await inquirer.prompt(questions);
    return answers;
  } catch (error) {
    console.error('Error:', error);
  }
}

module.exports = askQuestions;
