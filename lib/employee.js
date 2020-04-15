const inquirer = require("inquirer");
const util = require("util");
const shared = require("./shared");
const connection = require("../config/connection");
const queryAsync = util.promisify(connection.query).bind(connection);

// calls procedure from database to display all employees
async function viewAllEmployees() {
    const res = await queryAsync("CALL getAllEmployees();");
    shared.displayTable(res[0], "No existing employees");
}

// calls procedure from database to display all employees from a chosen department
async function viewEmployeesByDepartment() {
    const departmentInfo = await shared.listDepartments();
    const res = await queryAsync("CALL getEmployeesByDepartment(?);", departmentInfo[1]);
    shared.displayTable(res[0], "No employees exist in this department");
}

// displays all employees under a chosen manager
async function viewEmployeesByManager() {
    // finds all managers in the database
    const results = await queryAsync(
        "SELECT CONCAT_WS(' ', first_name, last_name) AS manager FROM employees WHERE manager_id IS NULL")
    const managerNames = results.map(managerName => managerName.manager);

    // choose manager
    const { choice } = await inquirer.prompt(
        {
            type: "list",
            choices: managerNames,
            message: "Which manager's team do you want to view?",
            name: "choice"
        }
    );

    const nameSplit = choice.split(" ");
    // calls procedure from database that return all employees of the given manager
    const res = await queryAsync(
        "CALL getEmployeesByManager(?, ?);",
        [
            nameSplit[0],
            nameSplit[1]
        ]
    );

    shared.displayTable(res[0], "No employees exist for this manager");
}

// asks user to select a manager and return the respective id
async function askManager(department, message) {
    // procedure from the database gets all managers from the given department
    const managers = await queryAsync("CALL getManagersByDepartment(?)", department);
    const { manager } = await inquirer
        .prompt(
            {
                type: "list",
                // if there are no managers in the department the list will 
                // just contain "None"
                choices: () => managers[0].length > 0 ?
                    ["None"]
                        .concat(managers[0]
                            .map(element => `${element.first_name.trim()} ${element.last_name.trim()} (id:${element.id})`)) : ["None"],
                message: message,
                name: "manager"
            }
        );

    // gets id value from manager info string if manager chosen or else null
    return manager !== "None" ? manager.split(":")[1].split(")")[0] : null;
}

// adds a new employee to the database
async function addEmployee() {
    // ask for department
    const departmentInfo = await shared.listDepartments();
    // ask for role
    const roleId = await shared.askRole(departmentInfo[1], "Role:");
    // if there are roles in the department continue asking questions
    if (roleId > 0) {
        const { firstName, lastName } = await inquirer
            .prompt([
                {
                    type: "input",
                    message: "First name:",
                    name: "firstName",
                    validate: value => value.trim() ? true : "Must enter a name"
                },
                {
                    type: "input",
                    message: "Last name:",
                    name: "lastName",
                    validate: value => value.trim() ? true : "Must enter a name"
                },
            ]);
        
        const managerId = await askManager(departmentInfo[1], "Manager:");

        try {
            // insert new employee into database
            await queryAsync(
                "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);",
                [firstName.trim(), lastName.trim(), roleId, managerId]
            );
            shared.createConsoleMessage("Employee added");
        } catch (error) {
            throw error;
        }
    }
    else {
        shared.createConsoleMessage("No roles in department to fulfill");
    }
}

// prompts user to pick an employee from a certain department and returns the employee id
async function getEmployee(department) {
    const departmentEmployees = await queryAsync("CALL getEmployeesByDepartment(?)", department);
    // checks if employees exist in the department
    if (departmentEmployees[0].length > 0) {
        // array of strings of employee info (name, role, id)
        const employeeInfo = departmentEmployees[0].map(employee =>
            `Name:${employee.first_name + " " + employee.last_name} (${employee.title}, id:${employee.id})`);

        const { employee } = await inquirer
            .prompt(
                {
                    type: "list",
                    choices: employeeInfo,
                    message: "Which employee?",
                    name: "employee"
                }
            );
        // get id value from employee info string
        return employee.split("id:")[1].split(")")[0];
    }
    return 0;
}

// update employee in database on given values
async function updateEmployeeValue(col, val, id) {
    await queryAsync("UPDATE employees SET ?? = ? WHERE ?",
        [ col, val, { id: id }]
    );
}

// update employee's role or manager values in database
async function updateEmployee() {
    const departmentInfo = await shared.listDepartments();
    const employeeId = await getEmployee(departmentInfo[1]);
    // checks if there are employees in the department
    if (employeeId > 0) {
        const { action } = await inquirer
            .prompt([
                {
                    type: "list",
                    choices: ["Employee's role", "Employee's manager"],
                    message: "What do you want to update?",
                    name: "action"
                }
            ]);

        if (action === "Employee's manager") {
            const managerId = await askManager(departmentInfo[1], "New manager:");
            await updateEmployeeValue("manager_id", managerId, employeeId);
            shared.createConsoleMessage("Manager updated");
        }
        else {
            const roleId = await shared.askRole(departmentInfo[1], "New Role:");
            await updateEmployeeValue("role_id", roleId, employeeId);
            shared.createConsoleMessage("Employee Role updated");
        }
    }
    else {
        shared.createConsoleMessage("No employees exist in this department");
    }
}

// delete chosen employee from database
async function deleteEmployee() {
    const departmentInfo = await shared.listDepartments();
    const employeeId = await getEmployee(departmentInfo[1]);
    if (employeeId > 0) {
        await queryAsync("DELETE FROM employees WHERE ?",
            {
                id: employeeId
            }
        );
        shared.createConsoleMessage("Employee removed");
    }
    else {
        shared.createConsoleMessage("No employees in this department");
    }
}

module.exports = {
    viewAllEmployees,
    viewEmployeesByDepartment,
    viewEmployeesByManager,
    addEmployee,
    updateEmployee,
    deleteEmployee
}