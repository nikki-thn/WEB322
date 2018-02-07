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
                if (err) throw "Read in employees failed";
                employees = JSON.parse(data);
                resolve(); //return resolve when read in sucessfully
            });
            //read in departments
            fs.readFile("./data/departments.json", function (err, data) {
                if (err) throw "Read in dapartments failed";
                departments = JSON.parse(data);
                resolve(); //return resolve when read in sucessfully
            });
        }
        catch (ex) {
            reject("Read in file fail"); //return reject wth error message when read in fail
        }
    });
};

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

module.exports.getAllEmployees = function () {

    //function returns a promise
    return new Promise(

        //promise must have a resolve()
        function (resolve, reject) {
            if (emloyees.length != 0) {
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

        function (resolve, reject) {
            for (var i = 0; i <employees.length; i++) {
                if(employees[i].isManager) 
                    managers.push(employees[i]);
            }
            if (managers.length != 0){
                resolve(managers);}
            else {
                reject("No results found");
            }
        });
};

module.exports.getDepartments = function () {
    //function returns a promise
    return new Promise(

        //promise must have a resolve()
        function (resolve, reject) {
            if (departments.length != 0) {
            resolve(departments);
            }
            else {
                reject("No results found");
            }
        });
};


//References:
//I have consulted the following websites and classnotes to help with my assignment
//https://stackoverflow.com/questions/10058814/get-data-from-fs-readfile
