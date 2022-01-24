DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;
USE company_db;

CREATE TABLE DEPARTMENTS (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE ROLES (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(8 , 2 ),
    department_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id)
        REFERENCES DEPARTMENTS (id)
);

CREATE TABLE EMPLOYEES (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id)
        REFERENCES ROLES (id)
);

-- CREATE TABLE MANAGERS (
--     id INT NOT NULL AUTO_INCREMENT,
--     employee_id INT NOT NULL,
--     manager_id INT NOT NULL,
--     PRIMARY KEY (id),
--     FOREIGN KEY (employee_id)
--         REFERENCES EMPLOYEES (id),
--     FOREIGN KEY (manager_id)
--         REFERENCES EMPLOYEES (id)
-- );













