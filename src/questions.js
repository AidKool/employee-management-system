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

const addDeparmentQuestions = [
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
    choices: ['Sales', 'Engineering', 'Finance', 'Legal'],
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
    type: 'input',
    message: 'Enter the role of the new employee:',
    name: 'newEmployeeRole',
  },
  {
    type: 'list',
    message: 'Who is the manager of the new employee?',
    choices: [
      'John Doe',
      'Mike Chan',
      'Ashley Rodriguez',
      'Kevin Tupik',
      'Kunal Singh',
      'Malia Brown',
      'Sarah Lourd',
      'Tom Allen',
    ],
    name: 'newEmployeeFirstName',
  },
];

module.exports = {
  mainMenuQuestions,
  addDeparmentQuestions,
  addRoleQuestions,
  addEmployeeQuestions,
};
