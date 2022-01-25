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
      await addDepartment();
      break;
    case 'Add Role':
      await addRole();
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
  const query = 'SELECT id, name FROM DEPARTMENTS ORDER BY id';
  selectQuery(query);
}

function viewAllRoles() {
  const query =
    'SELECT ROLES.id, ROLES.title, DEPARTMENTS.name AS department, ROLES.salary FROM ROLES JOIN DEPARTMENTS ON department_id = DEPARTMENTS.id ORDER BY id';
  selectQuery(query);
}

function viewAllEmployees() {
  const query =
    "SELECT e1.id, e1.first_name, e1.last_name, DEPARTMENTS.name AS department, ROLES.title, ROLES.salary, CONCAT(e2.first_name, ' ', e2.last_name) AS manager FROM DEPARTMENTS JOIN ROLES ON DEPARTMENTS.id = ROLES.department_id JOIN EMPLOYEES e1 ON ROLES.id = e1.role_id LEFT JOIN EMPLOYEES e2 ON e1.manager_id = e2.id ORDER BY id";
  selectQuery(query);
}

async function addDepartment() {
  const { newDepartmentName } = await askQuestions(addDeparmentQuestions);
  const query = 'INSERT INTO DEPARTMENTS(name) VALUES(?)';
  db.query(query, newDepartmentName, (error) => {
    if (error) {
      throw new Error(error.message);
    }
    menu();
  });
}

function selectQuery(query) {
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

async function addRole() {
  const { newRoleName, newRoleSalary, newRoleDepartment } = await askQuestions(
    addRoleQuestions
  );
  const query = 'SELECT id FROM DEPARTMENTS WHERE DEPARTMENTS.name = ?';
  db.query(query, newRoleDepartment, (error, results) => {
    if (error) {
      throw new Error(error.message);
    } else {
      const id = results[0].id;
      const answers = [newRoleName, newRoleSalary, id];
      const query =
        'INSERT INTO ROLES(title, salary, department_id) VALUES(?, ?, ?)';
      db.query(query, answers, (error) => {
        if (error) {
          throw new Error(error.message);
        }
        menu();
      });
    }
  });
}

module.exports = menu;
