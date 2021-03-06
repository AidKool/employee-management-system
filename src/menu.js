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
  Promise.all([listDepartments(), listRoles(), listEmployees()])
    .then(async () => {
      const { menuChoice } = await askQuestions(mainMenuQuestions);
      switch (menuChoice) {
        case 'View All Departments':
          return viewAllDepartments();
        case 'View All Employees':
          return viewAllEmployees();
        case 'View All Roles':
          return viewAllRoles();
        case 'View Employees by Department':
          return viewEmployeesByDepartment();
        case 'View Employees by Manager':
          return viewEmployeesByManager();
        case 'Add Department':
          return addDepartment();
        case 'Add Role':
          return addRole();
        case 'Add Employee':
          return addEmployee();
        case 'Update Employee Role':
          return updateEmployeeRole();
        case 'Update Employee Manager':
          return updateEmployeeManager();
        default:
          console.log('Exiting the application'.blue.bold);
          return connection.end();
      }
    })
    .catch((error) => {
      throw new Error(error.message);
    });
}

function viewAllDepartments() {
  const query = 'SELECT id, name FROM DEPARTMENTS ORDER BY id';
  return selectQuery(query);
}

function viewAllRoles() {
  const query =
    'SELECT ROLES.id, ROLES.title, DEPARTMENTS.name AS department,' +
    ' ROLES.salary FROM ROLES JOIN DEPARTMENTS ON department_id =' +
    ' DEPARTMENTS.id ORDER BY id';
  return selectQuery(query);
}

function viewAllEmployees() {
  const query =
    'SELECT e1.id, e1.first_name, e1.last_name, DEPARTMENTS.name AS' +
    " department, ROLES.title, ROLES.salary, CONCAT(e2.first_name, ' '," +
    ' e2.last_name) AS manager FROM DEPARTMENTS JOIN ROLES ON DEPARTMENTS.id' +
    ' = ROLES.department_id JOIN EMPLOYEES e1 ON ROLES.id = e1.role_id LEFT' +
    ' JOIN EMPLOYEES e2 ON e1.manager_id = e2.id ORDER BY id';
  return selectQuery(query);
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
  return selectQuery(query, departmentName);
}

async function viewEmployeesByManager() {
  const { managerName } = await askQuestions(viewEmployeesByManagerQuestions);
  const managerNameSplit = managerName.split(' ');

  const selectIDQuery =
    'SELECT id FROM EMPLOYEES WHERE first_name=? AND last_name=?';
  const selectEmployeesQuery =
    'SELECT e1.id, e1.first_name, e1.last_name, DEPARTMENTS.name AS' +
    " department, ROLES.title, ROLES.salary, CONCAT(e2.first_name, ' '," +
    ' e2.last_name) AS manager FROM DEPARTMENTS JOIN ROLES ON' +
    ' DEPARTMENTS.id = ROLES.department_id JOIN EMPLOYEES e1 ON ROLES.id' +
    ' = e1.role_id LEFT JOIN EMPLOYEES e2 ON e1.manager_id = e2.id WHERE' +
    ' e2.id = ? ORDER BY id';

  return connection
    .promise()
    .query(selectIDQuery, managerNameSplit)
    .then(([rows]) => rows[0])
    .then(({ id }) => selectQuery(selectEmployeesQuery, id))
    .catch((error) => {
      throw new Error(error.message);
    });
}

function selectQuery(query, data = null) {
  return connection
    .promise()
    .query(query, data)
    .then(([rows]) => {
      if (rows.length > 0) {
        console.log();
        console.table(rows);
      } else {
        console.log('No data found'.red.bold);
      }
      return menu();
    })
    .catch((error) => {
      throw new Error(error.message);
    });
}
async function addDepartment() {
  const { newDepartmentName } = await askQuestions(addDepartmentQuestions);
  const query = 'INSERT INTO DEPARTMENTS(name) VALUES(?)';
  connection
    .promise()
    .query(query, newDepartmentName)
    .then(() => {
      console.log('Department added successfully'.green.bold);
      return menu();
    })
    .catch((error) => {
      throw new Error(error.message);
    });
}

async function addRole() {
  const { newRoleName, newRoleSalary, newRoleDepartment } = await askQuestions(
    addRoleQuestions
  );
  const selectIDQuery = 'SELECT id FROM DEPARTMENTS WHERE DEPARTMENTS.name = ?';
  const insertRoleQuery =
    'INSERT INTO ROLES(title, salary, department_id) VALUES(?, ?, ?)';

  connection
    .promise()
    .query(selectIDQuery, newRoleDepartment)
    .then(([rows]) => rows[0])
    .then(({ id }) => {
      const roleData = [newRoleName, newRoleSalary, id];
      return connection.promise().query(insertRoleQuery, roleData);
    })
    .then(() => {
      console.log('Role added successfully'.green.bold);
      return menu();
    })
    .catch((error) => {
      throw new Error(error.message);
    });
}

async function addEmployee() {
  const {
    newEmployeeFirstName,
    newEmployeeLastName,
    newEmployeeRole,
    newEmployeeManager,
  } = await askQuestions(addEmployeeQuestions);

  const managerNameSplit = newEmployeeManager.split(' ');

  const selectRoleIDQuery = 'SELECT id FROM ROLES WHERE title = ?';
  const selectManagerIDQuery =
    'SELECT id FROM EMPLOYEES WHERE first_name=? AND last_name=?';
  const insertEmployeeQuery =
    'INSERT INTO EMPLOYEES(first_name, last_name, role_id, manager_id) VALUES(?,?,?,?)';

  Promise.all([findRoleID(), findManagerID()])
    .then((results) => {
      const { id: roleID } = results[0];
      const { id: managerID } = results[1];
      const employeeData = [
        newEmployeeFirstName,
        newEmployeeLastName,
        roleID,
        managerID,
      ];
      return insertEmployee(insertEmployeeQuery, employeeData);
    })
    .catch((error) => {
      throw new Error(error.message);
    });

  function findRoleID() {
    return connection
      .promise()
      .query(selectRoleIDQuery, newEmployeeRole)
      .then(([rows]) => rows[0]);
  }

  function findManagerID() {
    if (newEmployeeManager === 'None') {
      return Promise.resolve({ id: null });
    }
    return connection
      .promise()
      .query(selectManagerIDQuery, managerNameSplit)
      .then(([rows]) => rows[0])
      .catch((error) => {
        throw new Error(error.message);
      });
  }

  function insertEmployee(query, data) {
    connection
      .promise()
      .query(query, data)
      .then(() => {
        console.log('Employee added successfully'.green.bold);
        return menu();
      })
      .catch((error) => {
        throw new Error(error.message);
      });
  }
}

async function updateEmployeeRole() {
  const { employeeName, newEmployeeRole } = await askQuestions(
    updateEmployeeRoleQuestions
  );
  const employeeNameSplit = employeeName.split(' ');
  const selectRoleIDQuery = 'SELECT id FROM ROLES WHERE title = ?';
  const updateEmployeeQuery =
    'UPDATE EMPLOYEES SET role_id=? WHERE first_name=? AND last_name=?';

  return connection
    .promise()
    .query(selectRoleIDQuery, newEmployeeRole)
    .then(([rows]) => rows[0])
    .then(({ id }) => {
      const employeeData = [id, ...employeeNameSplit];
      connection.promise().query(updateEmployeeQuery, employeeData);
      console.log(
        "The employee's role has been updated successfully".green.bold
      );
      return menu();
    })
    .catch((error) => {
      throw new Error(error.message);
    });
}

async function updateEmployeeManager() {
  const { employeeName, managerName } = await askQuestions(
    updateEmployeeManagerQuestions
  );
  const employeeNameSplit = employeeName.split(' ');
  const managerNameSplit = managerName.split(' ');

  const updateEmployeeQuery =
    'UPDATE EMPLOYEES SET manager_id=? WHERE first_name=? AND last_name=?';
  const selectManagerIDQuery =
    'SELECT id FROM EMPLOYEES WHERE first_name=? AND last_name=?';

  Promise.all([findManagerID()])
    .then((results) => {
      const { id: managerID } = results[0];
      const employeeData = [managerID, ...employeeNameSplit];
      return updateManager(updateEmployeeQuery, employeeData);
    })
    .catch((error) => {
      throw new Error(error.message);
    });

  function findManagerID() {
    if (managerName === 'None') {
      return Promise.resolve({ id: null });
    }
    return connection
      .promise()
      .query(selectManagerIDQuery, managerNameSplit)
      .then(([rows]) => rows[0])
      .catch((error) => {
        throw new Error(error.message);
      });
  }

  function updateManager(query, data) {
    return connection
      .promise()
      .query(query, data)
      .then(() => {
        console.log(
          "The employee's manager has been updated successfully".green.bold
        );
        return menu();
      })
      .catch((error) => {
        throw new Error(error.message);
      });
  }
}

module.exports = menu;
