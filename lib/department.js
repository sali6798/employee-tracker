const inquirer = require("inquirer");
const util = require("util");
const shared = require("./shared");
const connection = require("../config/connection")
const queryAsync = util.promisify(connection.query).bind(connection);

// lists all the departments in the database
async function listDepartments() {
    const departments = await queryAsync("SELECT * FROM departments")
    const departmentNames = departments.map(departmentName => departmentName.name);
    const { departmentName } = await inquirer
        .prompt(
            {
                type: "list",
                choices: departmentNames.concat(["Back"]),
                message: "Department:",
                name: "departmentName"
            }
        );
    return departmentName;
}

// displays all departments in the database
async function viewAllDepartments() {
    try {
        const res = await queryAsync("SELECT * FROM departments ORDER BY name");
        shared.displayTable(res, "No departments exist");
    } catch (err) {
        throw err;
    }
}

// add department to database given user input
async function addDepartment() {
    const { departmentName } = await inquirer
        .prompt(
            {
                type: "input",
                message: "Enter a new department name or enter 'menu' to go back to the main menu\n",
                name: "departmentName",
                // checks if empty string
                validate: value => value.trim() ? true : "Must enter a name or 'menu'"
            }
        );
    const input = departmentName.trim();
    if (input !== "menu") {
        try {
            // insert new departments entry into database
            await queryAsync("INSERT INTO departments (name) VALUES (?);", departmentName);
            shared.createConsoleMessage("Department added");
        } catch {
            // if the department already exists prompts user to enter new name
            shared.createConsoleMessage("Department already exists");
            return addDepartment();
        }
    }
}

// deletes department from database
async function deleteDepartment() {
    const departmentName = await listDepartments();
    if (departmentName !== "Back") {
        // delete chosen department from database
        const res = await queryAsync(
            "DELETE FROM departments WHERE ?;",
            {
                name: departmentName
            }
        );

        if (res.affectedRows > 0) {
            shared.createConsoleMessage("Department deleted");
        }
        else {
            shared.createConsoleMessage("Department doesn't exist");
            return deleteDepartment();
        }
    }
}

// calls procedure from database to get the sum of salaries
// for a chosen department to display the utilized budget
async function departmentUtilizedBudget() {
    const departmentName = await listDepartments();
    const res = await queryAsync("CALL totalUtilizedBudget(?)", departmentName);
    shared.displayTable(res[0], "No employees in this department"); 
}

module.exports = {
    viewAllDepartments,
    addDepartment,
    deleteDepartment,
    departmentUtilizedBudget
}