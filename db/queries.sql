USE company_db;

# View All Departments
SELECT 
    id, name
FROM
    DEPARTMENTS;

#View All Roles
SELECT 
    ROLES.id,
    ROLES.title,
    DEPARTMENTS.name AS department,
    ROLES.salary
FROM
    ROLES
        JOIN
    DEPARTMENTS ON department_id = DEPARTMENTS.id;
    
# View All Employees
SELECT 
    e1.id,
    e1.first_name,
    e1.last_name,
    DEPARTMENTS.name AS department,
    ROLES.title,
    ROLES.salary,
    CONCAT(e2.first_name, ' ', e2.last_name) AS 'manager'
FROM
    DEPARTMENTS
        JOIN
    ROLES ON DEPARTMENTS.id = ROLES.department_id
        JOIN
    EMPLOYEES e1 ON ROLES.id = e1.role_id
        LEFT JOIN
    EMPLOYEES e2 ON e1.manager_id = e2.id;
