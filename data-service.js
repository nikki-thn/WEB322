var employees = [];
var departments = [];
var fs = require("fs");

module.exports.initialize = function () {

    //return a new promise
    return new Promise(function (resolve, reject) {

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

module.exports.getAllEmployees = function () {

    //function returns a promise
    return new Promise(

        //promise must have a resolve()
        function (resolve, reject) {
            if (employees.length != 0) {
                resolve(employees);
            }
            else {
                reject("No results found");
            }
        });
};

module.exports.getManagers = function () {

    let managers = [];
    //function returns a promise
    return new Promise(

        //return all managers when promise is resolved
        function (resolve, reject) {
            for (var i = 0; i < employees.length; i++) {
                if (employees[i].isManager)
                    managers.push(employees[i]);
            }
            if (managers.length != 0) {
                resolve(managers);
            }
            else {
                reject("No results found");
            }
        });
};

module.exports.getDepartments = function () {

    return new Promise(

        //return all departments when promise is resolved
        function (resolve, reject) {
            if (departments.length != 0) {
                resolve(departments);
            }
            else {
                reject("No results found");
            }
        });
};


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

