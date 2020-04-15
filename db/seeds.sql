USE employeetracker_db;

DELIMITER //
DROP PROCEDURE totalUtilizedBudget;
CREATE PROCEDURE totalUtilizedBudget(IN name VARCHAR(30))
BEGIN
	SELECT IF(SUM(R.salary) IS NULL, 0, SUM(R.salary)) AS utilized_budget
	FROM employees E
	JOIN roles R ON E.role_id = R.id
	JOIN departments D on R.department_id = D.id
	WHERE D.name = name;	
END//
DELIMITER ;

-- SELECT * FROM employees WHERE last_name = "Carmichael";
-- INSERT INTO employees (first_name, last_name, role_id, manager_id)
-- VALUES ("Jim", "James", 1, 1);

-- INSERT INTO employees (first_name, last_name, role_id, manager_id)
-- VALUES ("Bob", "Builder", 1, 1), ("Benjamin", "Button", 1, 1), ("Jemima", "Muppet", 1, 3);

-- SELECT *
-- FROM employees E
-- JOIN roles R ON E.role_id = R.id;

-- SELECT id first name department salary manager
-- SELECT E1.first_name, E1.last_name, CONCAT_WS(" ", E2.first_name, E2.last_name) AS manager
-- SELECT *, CONCAT_WS(" ", E2.first_name, E2.last_name) AS manager
-- FROM employees E, employees E2
-- JOIN roles R ON E.role_id=R.id
-- WHERE E.manager_id = E2.id
-- ORDER BY manager, E.first_name;




-- CALL getAllEmployees();
-- CALL getEmployeesByDepartment("Human resources");
-- CALL getEmployeesByManager("sally", "robbins");




-- INSERT INTO departments (name)
-- VALUES ("Finance"), ("Human Resources");

-- INSERT INTO roles (title, salary, department_id)
-- VALUES ("Accountant", 70000, 1), ("Manager", 78000, 2);

-- INSERT INTO employees (first_name, last_name, role_id, manager_id)
-- VALUES ("John", "Doe", 1, NULL), ("James", "Bond", 1, 1);

