const inquirer = require("inquirer");
const connection = require("./config/connection");
const department = require("./lib/department");
const role = require("./lib/role");
const employee = require("./lib/employee");

function menuQuestions() {
    return {
        type: "list",
        choices: ["Departments", "Roles", "Employees", "Quit"],
        message: "Which table do you want to query?",
        name: "choice"
    }
}

async function askQuestions() {
    try {
        const { choice } = await inquirer.prompt(menuQuestions());
        switch (choice) {
            case "Departments":
                departmentOptions();
                break;
            case "Roles":
                roleOptions();
                break;
            case "Employees":
                employeeOptions();
                break;
            default:
                connection.end();
                break;
        }
    }
    catch (error) {
        console.log(error)
    }
}

//========================= DEPARTMENT QUERIES =======================================
async function departmentOptions() {
    const { choice } = await inquirer.prompt([
        {
            type: "list",
            choices: ["View all departments",
                "Create a new department",
                "Delete a department",
                "View utilized budget",
                "Back"
            ],
            message: "What would you like to do?",
            name: "choice"
        }
    ]);

    switch (choice) {
        case "View all departments":
            await department.viewAllDepartments();
            break;
        case "Create a new department":
            await department.addDepartment();
            break;
        case "Delete a department":
            await department.deleteDepartment();
            break;
        case "View utilized budget":
            await department.departmentUtilizedBudget();
            break;
        default:
            break;
    }
    askQuestions();
}

//============================= ROLES QUERIES =============================================
async function roleOptions() {
    const { choice } = await inquirer.prompt([
        {
            type: "list",
            choices: ["View all roles", "View roles by department", "Create a new role", "Delete a role", "Back"],
            message: "What would you like to do?",
            name: "choice"
        }
    ]);

    switch (choice) {
        case "View all roles":
            await role.viewAllRoles();
            break;
        case "View roles by department":
            await role.viewDepartmentRoles();
            break;
        case "Create a new role":
            await role.addRole();
            break;
        case "Delete a role":
            await role.deleteRole();
            break;
        default:
            break;
    }
    askQuestions();
}

//======================== EMPLOYEE QUERIES =========================================
async function employeeOptions() {
    const { choice } = await inquirer.prompt([
        {
            type: "list",
            choices: ["View all employees",
                "View employees by department",
                "View employees by manager",
                "Add a new employee",
                "Update employee",
                "Remove an employee",
                "Back"
            ],
            message: "What would you like to do?",
            name: "choice"
        }
    ]);

    switch (choice) {
        case "View all employees":
            await employee.viewAllEmployees();
            break;
        case "View employees by department":
            await employee.viewEmployeesByDepartment();
            break;
        case "View employees by manager":
            await employee.viewEmployeesByManager();
            break;
        case "Add a new employee":
            await employee.addEmployee();
            break;
        case "Update employee":
            await employee.updateEmployee();
            break;
        case "Remove an employee":
            await employee.deleteEmployee();
            break;
        default:
            break;
    }
    askQuestions();
}

askQuestions();