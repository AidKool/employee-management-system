const askQuestions = require('./askQuestions');
const {
  mainMenuQuestions,
  addDeparmentQuestions,
  addRoleQuestions,
  addEmployeeQuestions,
} = require('./questions');

const {
  viewAllDepartments,
  viewAllEmployees,
  viewAllRoles,
} = require('./dbOperations');
const db = require('../db/db');

async function menu() {
  while (true) {
    const { menuChoice } = await askQuestions(mainMenuQuestions);
    switch (menuChoice) {
      case 'View All Deparments':
        viewAllDepartments(db);
        break;
      case 'View All Employees':
        viewAllEmployees(db);
        break;
      case 'View All Roles':
        viewAllRoles(db);
        break;
      case 'Add Department':
        break;
      case 'Add Role':
        break;
      case 'Add Employee':
        break;
      case 'Update Employee Role':
        break;
      case 'Quit':
        console.log('Exiting the application');
        db.end();
        return;
    }
  }
}

module.exports = menu;
