var employees = [];
var departments = [];
var file = require("fs");
var string =  "hello";

function initialize() {

    return new Promise(function (resolve, reject) {
        
        try {
            file.readFile("./data/employees.json", function (err, data) {
                if (err) throw err;
                employees = JSON.parse(data);
        /*         for (var i = 0; i< 10; i++){
                    console.log(employees[i]);
                } */
                

            });
            file.readFile("./data/departments.json", function (err, data) {
                if (err) throw err;
                departments = JSON.parse(data);
                //console.log(employees);
            }); 
            resolve("file read in sucessfully");
        }
        catch (ex) {
            console.log(ex);
            reject("Read in fail");
        }
    });
}

initialize()
    .then(function(msg) {
        for (var i = 0; i< 10; i++)
            console.log(employees[i]);
        console.log(msg);})
    .catch(() => console.log(msg));
;


function getAllEmployees() {

    var arrEmployees = [];
    //function returns a promise
    return new Promise(
        
        //promise must have a resolve()
        function (resolve, reject) {
            for (var i = 0; i< 10; i++){
                console.log(employees[i]);
            }
         /*    for (var i = 0; i < employees.length; i++) {
                arrEmployees.push(employees[i]);
            }
            if (employees.length == 0) {
                reject("No result returned")
            }
            resolve(arrEmployees); */
    });
}


function getManagers() {

}

function getDepartments() {

}

//test();
//initialize();
//getAllEmployees();
//References:
//https://stackoverflow.com/questions/10058814/get-data-from-fs-readfile