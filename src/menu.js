const askQuestions = require('./askQuestions');

const {
  mainMenuQuestions,
  addDepartmentQuestions,
  addRoleQuestions,
  addEmployeeQuestions,
  updateEmployeeRoleQuestions,
  updateEmployeeManagerQuestions,
  viewEmployeesByDepartmentQuestions,
  viewEmployeesByManagerQuestions,
  listDepartments,
  listRoles,
  listEmployees,
} = require('./questions');

const connection = require('../db/connection');

async function menu() {
  Promise.all([listDepartments(), listRoles(), listEmployees()]).then(
    async () => {
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
        case 'View Employees by Department':
          await viewEmployeesByDepartment();
          break;
        case 'View Employees by Manager':
          await viewEmployeesByManager();
          break;
        case 'Add Department':
          await addDepartment();
          break;
        case 'Add Role':
          await addRole();
          break;
        case 'Add Employee':
          await addEmployee();
          break;
        case 'Update Employee Role':
          await updateEmployeeRole();
          break;
        case 'Update Employee Manager':
          await updateEmployeeManager();
          break;
        default:
          console.log('Exiting the application'.blue.bold);
          connection.end();
      }
    }
  );
}

function viewAllDepartments() {
  const query = 'SELECT id, name FROM DEPARTMENTS ORDER BY id';
  selectQuery(query);
}

function viewAllRoles() {
  const query =
    'SELECT ROLES.id, ROLES.title, DEPARTMENTS.name AS department,' +
    ' ROLES.salary FROM ROLES JOIN DEPARTMENTS ON department_id =' +
    ' DEPARTMENTS.id ORDER BY id';
  selectQuery(query);
}

function viewAllEmployees() {
  const query =
    'SELECT e1.id, e1.first_name, e1.last_name, DEPARTMENTS.name AS' +
    " department, ROLES.title, ROLES.salary, CONCAT(e2.first_name, ' '," +
    ' e2.last_name) AS manager FROM DEPARTMENTS JOIN ROLES ON DEPARTMENTS.id' +
    ' = ROLES.department_id JOIN EMPLOYEES e1 ON ROLES.id = e1.role_id LEFT' +
    ' JOIN EMPLOYEES e2 ON e1.manager_id = e2.id ORDER BY id';
  selectQuery(query);
}

async function viewEmployeesByDepartment() {
  const { departmentName } = await askQuestions(
    viewEmployeesByDepartmentQuestions
  );
  const query =
    'SELECT e1.id, e1.first_name, e1.last_name, DEPARTMENTS.name AS' +
    " department, ROLES.title, ROLES.salary, CONCAT(e2.first_name, ' '," +
    ' e2.last_name) AS manager FROM DEPARTMENTS JOIN ROLES ON DEPARTMENTS.id' +
    ' = ROLES.department_id JOIN EMPLOYEES e1 ON ROLES.id = e1.role_id LEFT' +
    ' JOIN EMPLOYEES e2 ON e1.manager_id = e2.id WHERE DEPARTMENTS.name = ?' +
    ' ORDER BY id';
  selectQuery(query, departmentName);
}

async function viewEmployeesByManager() {
  const { managerName } = await askQuestions(viewEmployeesByManagerQuestions);
  const managerNameSplit = managerName.split(' ');
  const selectIDQuery =
    'SELECT id FROM EMPLOYEES WHERE first_name=? AND last_name=?';
  connection.query(selectIDQuery, managerNameSplit, (error, results) => {
    if (error) {
      throw new Error(error.message);
    } else {
      const { id: managerID } = results[0];
      const selectEmployeesQuery =
        'SELECT e1.id, e1.first_name, e1.last_name, DEPARTMENTS.name AS' +
        " department, ROLES.title, ROLES.salary, CONCAT(e2.first_name, ' '," +
        ' e2.last_name) AS manager FROM DEPARTMENTS JOIN ROLES ON' +
        ' DEPARTMENTS.id = ROLES.department_id JOIN EMPLOYEES e1 ON ROLES.id' +
        ' = e1.role_id LEFT JOIN EMPLOYEES e2 ON e1.manager_id = e2.id WHERE' +
        ' e2.id = ? ORDER BY id';
      selectQuery(selectEmployeesQuery, managerID);
    }
  });
}

function selectQuery(query, data = null) {
  connection.query(query, data, (error, results) => {
    if (error) {
      throw new Error(error.message);
    } else {
      if (results.length === 0) {
        console.log('No data found'.red.bold);
      } else {
        console.log();
        console.table(results);
      }
      menu();
    }
  });
}

async function addDepartment() {
  const { newDepartmentName } = await askQuestions(addDepartmentQuestions);
  const query = 'INSERT INTO DEPARTMENTS(name) VALUES(?)';
  connection.query(query, newDepartmentName, (error) => {
    if (error) {
      throw new Error(error.message);
    } else {
      console.log('Department added successfully'.green.bold);
      menu();
    }
  });
}

async function addRole() {
  const { newRoleName, newRoleSalary, newRoleDepartment } = await askQuestions(
    addRoleQuestions
  );
  const selectIDQuery = 'SELECT id FROM DEPARTMENTS WHERE DEPARTMENTS.name = ?';
  connection.query(selectIDQuery, newRoleDepartment, (error, results) => {
    if (error) {
      throw new Error(error.message);
    } else {
      const { id } = results[0];
      const answers = [newRoleName, newRoleSalary, id];
      const insertRoleQuery =
        'INSERT INTO ROLES(title, salary, department_id) VALUES(?, ?, ?)';
      // eslint-disable-next-line no-shadow
      connection.query(insertRoleQuery, answers, (error) => {
        if (error) {
          throw new Error(error.message);
        } else {
          console.log('Role added successfully'.green.bold);
          menu();
        }
      });
    }
  });
}

async function addEmployee() {
  const {
    newEmployeeFirstName,
    newEmployeeLastName,
    newEmployeeRole,
    newEmployeeManager,
  } = await askQuestions(addEmployeeQuestions);

  const selectIDQuery = 'SELECT id FROM ROLES WHERE title = ?';

  function insertEmployee(query, data) {
    connection.query(query, data, (error) => {
      if (error) {
        throw new Error(error.message);
      } else {
        console.log('Employee added successfully'.green.bold);
        menu();
      }
    });
  }

  connection.query(selectIDQuery, newEmployeeRole, (error, results) => {
    if (error) {
      throw new Error(error.message);
    } else {
      const { id: roleID } = results[0];
      if (newEmployeeManager === 'None') {
        const employeeData = [
          newEmployeeFirstName,
          newEmployeeLastName,
          roleID,
        ];
        const query =
          'INSERT INTO EMPLOYEES(first_name, last_name, role_id) VALUES(?,?,?)';
        insertEmployee(query, employeeData);
      } else {
        const managerNameSplit = newEmployeeManager.split(' ');
        const query =
          'SELECT id FROM EMPLOYEES WHERE first_name=? AND last_name=?';
        // eslint-disable-next-line no-shadow
        connection.query(query, managerNameSplit, (error, results) => {
          if (error) {
            throw new Error(error.message);
          } else {
            const { id: managerID } = results[0];
            const insertEmployeeQuery =
              'INSERT INTO EMPLOYEES(first_name, last_name, role_id, manager_id) VALUES(?,?,?,?)';
            const employeeData = [
              newEmployeeFirstName,
              newEmployeeLastName,
              roleID,
              managerID,
            ];
            insertEmployee(insertEmployeeQuery, employeeData);
          }
        });
      }
    }
  });
}

async function updateEmployeeRole() {
  const { employeeName, roleTitle } = await askQuestions(
    updateEmployeeRoleQuestions
  );

  const fullNameSplit = employeeName.split(' ');
  const query = 'SELECT id FROM ROLES WHERE title = ?';
  connection.query(query, roleTitle, (error, results) => {
    if (error) {
      throw new Error(error.message);
    } else {
      const { id: roleID } = results[0];
      const updateEmployeeQuery =
        'UPDATE EMPLOYEES SET role_id=? WHERE first_name=? AND last_name=?';
      const employeeData = [roleID, ...fullNameSplit];
      // eslint-disable-next-line no-shadow
      connection.query(updateEmployeeQuery, employeeData, (error) => {
        if (error) {
          throw new Error(error.message);
        } else {
          console.log(
            "The employee's role has been updated successfully".green.bold
          );
          menu();
        }
      });
    }
  });
}

async function updateEmployeeManager() {
  const { employeeName, managerName } = await askQuestions(
    updateEmployeeManagerQuestions
  );
  const employeeNameSplit = employeeName.split(' ');
  const updateQuery =
    'UPDATE EMPLOYEES SET manager_id=? WHERE first_name=? AND last_name=?';

  function updateManager(query, data) {
    connection.query(query, data, (error) => {
      if (error) {
        throw new Error(error.message);
      } else {
        console.log(
          "The employee's manager has been updated successfully".green.bold
        );
        menu();
      }
    });
  }

  if (managerName === 'None') {
    const managerID = null;
    const employeeData = [managerID, ...employeeNameSplit];
    updateManager(updateQuery, employeeData);
  } else {
    const managerNameSplit = managerName.split(' ');
    const query = 'SELECT id FROM EMPLOYEES WHERE first_name=? AND last_name=?';

    connection.query(query, managerNameSplit, (error, results) => {
      if (error) {
        throw new Error(error.message);
      } else {
        const managerID = results[0].id;
        const employeeData = [managerID, ...employeeNameSplit];
        updateManager(updateQuery, employeeData);
      }
    });
  }
}

module.exports = menu;
