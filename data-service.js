var employees = [];
var departments = [];
var fs = require("fs");
var string = "hello";

module.exports.initialize = function () {

    //return a new promise
    return new Promise(function (resolve, reject) {

        //read in JSON file
        try {
            //read in employees
            fs.readFile('./data/employees.json', (err, data) => {
                if (err) throw err;
                employees = JSON.parse(data);
                resolve(); //return resolve when read in sucessfully
            });
            //read in departments
            fs.readFile("./data/departments.json", function (err, data) {
                if (err) throw err;
                departments = JSON.parse(data);
                resolve(); //return resolve when read in sucessfully
            });
        }
        catch (ex) {
            console.log(ex);
            reject("Read in file fail");
        }
    });
};






module.exports.getAllEmployees = function () {

    //function returns a promise
    return new Promise(

        //promise must have a resolve()
        function (resolve, reject) {
            resolve(employees);
        });
};



// function getManagers() {

// }

// function getDepartments() {

// }

// //test();
// initialize();
// //getAllEmployees();
// //References:
// //https://stackoverflow.com/questions/10058814/get-data-from-fs-readfile