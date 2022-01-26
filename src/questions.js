const db = require('../db/connection');

const departments = [];
const roles = [];
const employees = [];

const mainMenuQuestions = [
  {
    type: 'list',
    message: 'What would you like to do?',
    choices: [
      'View All Departments',
      'View All Employees',
      'View All Roles',
      'Add Department',
      'Add Role',
      'Add Employee',
      'Update Employee Role',
      'Quit',
    ],
    name: 'menuChoice',
  },
];

const addDepartmentQuestions = [
  {
    type: 'input',
    message: 'Enter the name of the new department:',
    name: 'newDepartmentName',
  },
];

const addRoleQuestions = [
  {
    type: 'input',
    message: 'Enter the name of the new role:',
    name: 'newRoleName',
  },
  {
    type: 'input',
    message: 'Enter the salary of the new role:',
    name: 'newRoleSalary',
  },
  {
    type: 'list',
    message: 'What is the department of the new role?',
    choices: departments,
    name: 'newRoleDepartment',
  },
];

const addEmployeeQuestions = [
  {
    type: 'input',
    message: 'Enter the first name of the new employee:',
    name: 'newEmployeeFirstName',
  },
  {
    type: 'input',
    message: 'Enter the last name of the new employee:',
    name: 'newEmployeeLastName',
  },
  {
    type: 'list',
    message: 'Enter the role of the new employee:',
    choices: roles,
    name: 'newEmployeeRole',
  },
  {
    type: 'list',
    message: 'Who is the manager of the new employee?',
    choices: async () => {
      return ['None', ...employees];
    },
    name: 'newEmployeeManager',
  },
];

const updateEmployeeRoleQuestions = [
  {
    type: 'list',
    message: "Which employee's role do you want to update?",
    choices: employees,
    name: 'employeeName',
  },
  {
    type: 'list',
    message: 'Which role do you want to assign the selected employee?',
    choices: roles,
    name: 'roleTitle',
  },
];

function listDepartments() {
  const query = 'SELECT name FROM DEPARTMENTS';
  return db
    .promise()
    .query(query)
    .then(([rows]) => {
      departments.splice(0);
      rows.forEach((name) => {
        departments.push(name.name);
      });
    })
    .catch((error) => {
      throw new Error(error.message);
    });
}

function listRoles() {
  const query = 'SELECT title FROM ROLES';
  return db
    .promise()
    .query(query)
    .then(([rows]) => {
      roles.splice(0);
      rows.forEach((role) => {
        roles.push(role.title);
      });
    })
    .catch((error) => {
      throw new Error(error.message);
    });
}

function listEmployees() {
  const query =
    "SELECT CONCAT(first_name, ' ', last_name) AS manager FROM EMPLOYEES";
  return db
    .promise()
    .query(query)
    .then(([rows]) => {
      employees.splice(0);
      rows.forEach((employee) => {
        employees.push(employee.manager);
      });
    })
    .catch((error) => {
      throw new Error(error.message);
    });
}

module.exports = {
  mainMenuQuestions,
  addDepartmentQuestions,
  addRoleQuestions,
  addEmployeeQuestions,
  updateEmployeeRoleQuestions,
  listDepartments,
  listRoles,
  listEmployees,
};
