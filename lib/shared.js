const inquirer = require("inquirer");
const util = require("util");
const connection = require("../config/connection")
const queryAsync = util.promisify(connection.query).bind(connection);
require("console.table");

// add border to console log
function createConsoleMessage(message) {
    console.log("-".repeat(10 + message.length));
    console.log(`|    ${message}    |`);
    console.log("-".repeat(10 + message.length));
}

// finds the matching id given the role title
function getRoleId(roles, title) {
    for (let i = 0; i < roles.length; i++) {
        if (roles[i].title === title) {
            return roles[i].id;
        }
    }
}

// displays data from database as a table
function displayTable(res, message) {
    if (res.length > 0) {
        console.table(res);
    }
    else {
        // logs error message
        createConsoleMessage(message);
    }
}

// prompts user to choose a department and returns the 
// respective id and the name of the department chosen
async function listDepartments() {
    const departments = await queryAsync("SELECT * FROM departments")
    // array of all the department names
    const departmentNames = departments.map(departmentName => departmentName.name);
    const { departmentName } = await inquirer
        .prompt(
            {
                type: "list",
                choices: departmentNames,
                message: "Department:",
                name: "departmentName"
            }
        );

    let departmentId = 0;
    // finds matching id for the department name
    for (let i = 0; i < departments.length; i++) {
        if (departments[i].name === departmentName) {
            departmentId = departments[i].id;
            break;
        }
    }
    return [departmentId, departmentName];
}

// asks user to select a role and return the respective id
async function askRole(department, message) {
    // procedure from the database gets all roles from the given department
    const roles = await queryAsync("CALL getRolesByDepartment(?)", department);
    // checks if roles exist in the department
    if (roles[0].length > 0) {
        const { role } = await inquirer
            .prompt(
                {
                    type: "list",
                    choices: () => roles[0].map(element => element.title),
                    message: message,
                    name: "role"
                }
            );
        return getRoleId(roles[0], role);
    }
    return 0;
}

module.exports = {
    createConsoleMessage,
    getRoleId,
    displayTable,
    listDepartments,
    askRole
}