DROP DATABASE IF EXISTS employeetracker_db;
CREATE DATABASE employeetracker_db;

USE employeetracker_db;

CREATE TABLE departments (
	id INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(30) NOT NULL UNIQUE,
    PRIMARY KEY (id)
);

CREATE TABLE roles (
	id INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES departments(id),
    CONSTRAINT role_dept UNIQUE (title, department_id)
);

CREATE TABLE employees (
	id INT AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (manager_id) REFERENCES employees(id)
);

-- =============================================== PROCEDURES ===============================================
DELIMITER //
-- ALL EMPLOYEES
CREATE PROCEDURE getAllEmployees()
BEGIN
	SELECT E1.id, E1.last_name, E1.first_name, R.title, D.name AS department, R.salary, CONCAT_WS(" ", E2.first_name, E2.last_name) AS manager
	FROM employees E1
	LEFT JOIN employees E2 ON E1.manager_id = E2.id
	JOIN roles R ON E1.role_id = R.id
	JOIN departments D ON R.department_id = D.id
	ORDER BY E1.last_name;
END//

-- EMPLOYEES BY DEPARTMENT
CREATE PROCEDURE getEmployeesByDepartment(IN name VARCHAR(30))
BEGIN
	SELECT E1.id, E1.last_name, E1.first_name, R.title, D.name AS department, R.salary, CONCAT_WS(" ", E2.first_name, E2.last_name) AS manager
	FROM employees E1
	LEFT JOIN employees E2 ON E1.manager_id = E2.id
	JOIN roles R ON E1.role_id = R.id
	JOIN departments D ON R.department_id = D.id
	WHERE D.name = name
	ORDER BY E1.last_name;
END//

-- EMPLOYEES BY MANAGER
CREATE PROCEDURE getEmployeesByManager(IN first VARCHAR(30), last VARCHAR(30))
BEGIN	
    SELECT E1.id, E1.last_name, E1.first_name, R.title, D.name AS department, R.salary, CONCAT_WS(" ", E2.first_name, E2.last_name) AS manager
	FROM employees E1
	LEFT JOIN employees E2 ON E1.manager_id = E2.id
	JOIN roles R ON E1.role_id = R.id
	JOIN departments D ON R.department_id = D.id
	WHERE E2.first_name = first AND E2.last_name = last
	ORDER BY E1.last_name;
END//

-- MANAGERS BY DEPARTMENT
CREATE PROCEDURE getManagersByDepartment(IN name VARCHAR(30))
BEGIN
	SELECT E.id, E.first_name, E.last_name, R.title
	FROM employees E
	JOIN roles R ON E.role_id = R.id
	JOIN departments D ON R.department_id = D.id
	WHERE E.manager_id IS NULL AND D.name = name;
END//

-- ROLES BY DEPARTMENT
CREATE PROCEDURE getRolesByDepartment(IN name VARCHAR(30))
BEGIN
	SELECT R.id, R.title, R.salary
	FROM roles R
	JOIN departments D ON R.department_id = D.id
    WHERE D.name = name;
END//

-- UTILIZED BUDGET FOR DEPARTMENT
CREATE PROCEDURE totalUtilizedBudget(IN name VARCHAR(30))
BEGIN
	SELECT IF(SUM(R.salary) IS NULL, 0, SUM(R.salary)) AS utilized_budget
	FROM employees E
	JOIN roles R ON E.role_id = R.id
	JOIN departments D on R.department_id = D.id
	WHERE D.name = name;	
END//

DELIMITER ;