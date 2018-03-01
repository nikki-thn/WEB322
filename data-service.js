var employees = [];
var departments = [];
var fs = require("fs");


/* helper function that received an array and pass the array
 * through resolve() if its length is not empty and reject
 * with an error message otherwise */
function promise(result) {

    return new Promise(

        (resolve, reject) => {

            //pass array through resolve() when it's not empty
            if (result.length != 0) {
                resolve(result);
            }
            //reject if array is empty with an error msg
            else {
                reject("No results found");
            }
        });
}

module.exports.initialize = () => {

    //return a new promise
    return new Promise((resolve, reject) => {

        //read in JSON file
        try {
            //read in employees
            fs.readFile('./data/employees.json', (err, data) => {
                if (err) throw "Read in employees failed";
                employees = JSON.parse(data);

                //read in departments
                fs.readFile("./data/departments.json", (err, data) => {
                    if (err) throw "Read in dapartments failed";
                    departments = JSON.parse(data);
                });
            });
            resolve(); //return resolve when read in sucessfully
        }
        catch (ex) {
            reject("Read in file fail"); //return reject wth error message when read in fail
        }
    });
};

//Get all employees
module.exports.getAllEmployees = () => {

    //call promise() and pass the global employees array
    return promise(employees);
};

//Get an employee by employeeNum
module.exports.getEmployeeByNum = (empNum) => {

    let result = [];
    result.push(employees.filter(e => e.employeeNum == empNum));

    //call promise() and pass the result
    return promise(result);
};

//Get employees that match the employee's status
module.exports.getEmployeesByStatus = (empStatus) => {

    var result = [];
    result.push(employees.filter(e => e.status == empStatus));

    //call promise() and pass the result
    return promise(result);
};

//Get employees that in a department
module.exports.getEmployeesByDepartment = (empDepartment) => {

    let result = [];
    result.push(employees.filter(e => e.department == empDepartment));

    //call promise() and pass the result
    return promise(result);
};

//Get employees that are under same manager
module.exports.getEmployeesByManager = (empManager) => {

    let result = [];
    result.push(employees.filter(e => e.employeeManagerNum == empManager));

    //call promise() and pass the result
    return promise(result);
};

//Get employees that are managers
module.exports.getManagers = () => {

    let result = [];
    result.push(employees.filter(e => e.isManager));

    //call promise() and pass the result
    return promise(result);
};

//Get all departments
module.exports.getDepartments = () => {

    //call promise() and pass the departments
    return promise(departments);
};

//To add a new employee
module.exports.addEmployee = (employeeData) => {

    return new Promise(

        //return all departments when promise is resolved
        (resolve, reject) => {

            if (employeeData.isManager == null) {
                employeeData.isManager = false;
            }
            else {
                employeeData.isManager = true;
            }

            employeeData.employeeNum = employees.length + 1;
            employees.push(employeeData);

            resolve();
        });
};

//Get all files in the ./public/images/uploaded folder
module.exports.getImages = () => {

    var imageJSON = { images: [] };

    return new Promise(

        (resolve, reject) => {

            fs.readdir("./public/images/uploaded", function (err, items) {

                for (var i = 0; i < items.length; i++) {
                    imageJSON.images.push(items[i]);
                }

                if (imageJSON.length != 0) {
                    resolve(imageJSON);
                }
                else {
                    reject("No images stored");
                }
            });
        });
};

//method to update information for an employee
module.exports.updateEmployee = (employeeData) => {

    var result = [];
    for (var i = 0; i < employees.length; i++){
        if(employees[i].employeeNum == employeeData.employeeNum){
            employees[i] = employeeData;
        }
    }

    return promise(result);
    //employees.filter(e => e.employeeManagerNum == empManager) = employeeData;

}

//**** Notes on ARROW FUNCTION */
//Arrow funcstions are functions without names
//A normal function has format:
//function functionName (para1, para2) {}
//To turn it to arrow function we do:
//(para1, para2) = { //body }
//If function only has one parameter, we can do:
// para1 => {  //body  }
//If function has no parameter, we do:
// () => { //body }  //The () is mandatory even function has no parameter in arrow function
//If function has only one statement in the body, we ca obmit the { }
// () => statement;
// para1 => statement //for when arrow fn has one parameter and one statement in body