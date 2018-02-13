var employees = [];
var departments = [];
var fs = require("fs");

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

module.exports.getAllEmployees = () => {

    //function returns a promise
    return new Promise(

        //promise must have a resolve()
        (resolve, reject) => {
            if (employees.length != 0) {
                resolve(employees);
            }
            else {
                reject("No results found");
            }
        });
};

module.exports.getManagers = () => {

    let managers = [];
    //function returns a promise
    return new Promise(

        //return all managers when promise is resolved
        (resolve, reject) => {
            if (employees.length != 0) {
                resolve(employees.filter(e => e.isManager));
            }
            else { 
                reject("No results found");
            }
        });
};

module.exports.getDepartments = () => {

    return new Promise(

        //return all departments when promise is resolved
        (resolve, reject) => {
            if (departments.length != 0) {
                resolve(departments);
            }
            else {
                reject("No results found");
            }
        });
};

module.exports.getImages = () => {

    var imageJSON = { images: [] } ;

    return new Promise(

        //return all departments when promise is resolved
        (resolve, reject) => {  
            fs.readdir("./public/images/uploaded", function(err, items) {
                for (var i = 0; i < items.length; i++) {
                    imageJSON.images.push(items[i]);
                }
                if (imageJSON.length != 0){
                    resolve(imageJSON);
                }
                else{
                    reject("No images stored");
                }
            });
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
// para1 => statement //for when arrow fn has one parameter and one statement in body

