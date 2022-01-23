function viewAllDepartments(db) {
  const query = 'SELECT id, name FROM DEPARTMENTS';
  db.query(query, (error, results) => {
    console.log('\n');
    console.table(results);
  });
}

function viewAllEmployees(db) {
  const query = 'SELECT * FROM EMPLOYEES';
  db.query(query, (error, results) => {
    console.log('\n');
    console.table(results);
  });
}

function viewAllRoles(db) {
  const query = 'SELECT * FROM ROLES';
  db.query(query, (error, results) => {
    console.log('\n');
    console.table(results);
  });
}

module.exports = { viewAllDepartments, viewAllEmployees, viewAllRoles };
