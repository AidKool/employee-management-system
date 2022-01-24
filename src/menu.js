const askQuestions = require('./askQuestions');

const {
  mainMenuQuestions,
  addDeparmentQuestions,
  addRoleQuestions,
  addEmployeeQuestions,
} = require('./questions');

const db = require('../db/db');

async function menu() {
  const { menuChoice } = await askQuestions(mainMenuQuestions);
  switch (menuChoice) {
    case 'View All Departments':
      viewAllDepartments();
      break;
    case 'View All Employees':
      viewAllEmployees();
      break;
    case 'View All Roles':
      viewAllRoles();
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

function viewAllDepartments() {
  const query = 'SELECT id, name FROM DEPARTMENTS';
  runQuery(query);
}

function viewAllRoles() {
  const query = 'SELECT * FROM ROLES';
  runQuery(query);
}

function viewAllEmployees() {
  const query = 'SELECT * FROM EMPLOYEES';
  runQuery(query);
}

function runQuery(query) {
  db.query(query, (error, results) => {
    if (error) {
      throw new Error(error.message);
    } else {
      console.log();
      console.table(results);
      menu();
    }
  });
}

module.exports = menu;
