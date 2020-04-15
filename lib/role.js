const inquirer = require("inquirer");
const util = require("util");
const shared = require("./shared");
const connection = require("../config/connection")
const queryAsync = util.promisify(connection.query).bind(connection);

// calls procedure in database to display all roles
async function viewAllRoles() {
    try {
        const res = await queryAsync("CALL getAllRoles()");
        shared.displayTable(res[0], "No roles exist");
    }
    catch (err) {
        throw err;
    }
}

// calls procedure in database to display all roles from a chosen department
async function viewDepartmentRoles() {
    try {
        const departmentInfo = await shared.listDepartments();
        const res = await queryAsync("CALL getRolesByDepartment(?)", departmentInfo[1]);
        shared.displayTable(res[0], "No roles exist");
    }
    catch (err) {
        throw err;
    }
}

// inserts new role with user inputs into database
async function addRole() {
    const { roleName, salary } = await inquirer
        .prompt([
            {
                type: "input",
                message: "Enter a new role name:",
                name: "roleName",
                // check if empty string
                validate: value => value.trim() ? true : "Must enter a name"
            },
            {
                type: "input",
                message: "Enter the salary:",
                name: "salary",
                // checks that it's a positive number
                validate: value => {
                    const input = parseInt(value.trim());
                    return input >= 0 && !isNaN(input) ? true : "Must enter a number of positive value";
                }
            }
        ]);

    const departmentInfo = await shared.listDepartments();

    try {
        // insert new role entry 
        await queryAsync(
            "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?);",
            [roleName.trim(), parseInt(salary), departmentInfo[0]]
        );
        shared.createConsoleMessage("Role added");
    } catch {
        // asks for a new name if the role already exists in the department
        shared.createConsoleMessage("Role already exists in this department");
        return addRole();
    }
}

// deletes role from database
async function deleteRole() {
    const departmentInfo = await shared.listDepartments();
    const roleId = await shared.askRole(departmentInfo[1], "Role to delete:");
    if (roleId > 0) {
        // delete role given role id and department id
        await queryAsync(
            "DELETE FROM roles WHERE ? AND ?;",
            [
                {
                    id: roleId
                },
                {
                    department_id: departmentInfo[0]
                }
            ]
        );
    
        shared.createConsoleMessage("Role deleted");
    }
    else {
        shared.createConsoleMessage("No roles exist in this department");
    }
}

module.exports = {
    viewAllRoles,
    viewDepartmentRoles,
    addRole,
    deleteRole
}