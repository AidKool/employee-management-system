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
  const query =
    'SELECT ROLES.id, ROLES.title, DEPARTMENTS.name AS department, ROLES.salary FROM ROLES JOIN DEPARTMENTS ON department_id = DEPARTMENTS.id';
  runQuery(query);
}

function viewAllEmployees() {
  const query =
    "SELECT e1.id, e1.first_name, e1.last_name, DEPARTMENTS.name AS department, ROLES.title, ROLES.salary, CONCAT(e2.first_name, ' ', e2.last_name) AS manager FROM DEPARTMENTS JOIN ROLES ON DEPARTMENTS.id = ROLES.department_id JOIN EMPLOYEES e1 ON ROLES.id = e1.role_id LEFT JOIN EMPLOYEES e2 ON e1.manager_id = e2.id;";
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
