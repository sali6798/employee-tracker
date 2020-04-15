USE employeetracker_db;

-- create departments
INSERT INTO departments (name)
VALUES ("Finance"), ("Human Resources"), ("Engineering");

-- create roles for finance
INSERT INTO roles (title, salary, department_id)
VALUES ("Accountant", 70000, 1), ("Auditor", 55000, 1), ("Chief Financial Officer", 128000, 1);

-- create roles for human resources
INSERT INTO roles (title, salary, department_id)
VALUES ("Manager", 80000, 2), ("Assistant", 40000, 2), ("Director", 110000, 2);

-- create roles for engineering
INSERT INTO roles (title, salary, department_id)
VALUES ("Manager", 120000, 3), ("Front End Developer", 70000, 3), ("Software Engineer", 80000, 3);

-- create employees for finance
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, NULL), ("James", "Bond", 2, 1), ("Jemima", "Saler", 3, NULL), ("Jessica", "Seward", 2, 1);

-- create employees for human resources
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Lady", "Marmalade", 4, NULL), ("Gerard", "Jacobs", 5, 5), ("Leo", "Davinci", 6, NULL), ("Tulip", "Blossom", 5, 5);

-- create employees for engineering
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Greg", "Hector", 7, NULL), ("Wendy", "Wester", 8, 9), ("Tammy", "Tammers", 9, 9), ("Leon", "Bridges", 7, NULL);

