// const mongoose = require("mongoose");
// const PhotoModel = require("./week8-assets/photoModel");
// const PHOTODIRECTORY = "./week8-assets/photos/";

// const config = require("./week8-assets/config");
// const connectionString = config.database_connection_string;

// use bluebird promise library with mongoose
//mongoose.Promise = require("bluebird");

const Sequelize = require('sequelize');

// set up sequelize to point to our postgres database
var sequelize = new Sequelize('de51vfbe33r97f', 'zxugbhftusdmlq', '5122bd5835aeca44bef49d0c756d516e202309ea51095c9b3f34d333e88b6d07', {
    host: 'ec2-54-83-58-222.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: true
    }
});

// Define a "Project" model

var Employee = sequelize.define('Employee', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addresCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING,
});

var Department = sequelize.define('Department', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
});

module.exports.initialize = () => {

    //return a new promise
    return new Promise((resolve, reject) => {

        sequelize.sync().then(() => {
            // you can now access the newly created Project via the variable project
            resolve();
        }).catch(() => {
            reject("unable to sync the database");
        });
    });
};


//Get all employees
module.exports.getAllEmployees = () => {

    //return a new promise
    return new Promise((resolve, reject) => {

        Employee.findAll().then(result => {
            resolve(result);
        }).catch(() => {
            reject("no results returned");
        });
    });
};

//Get an employee by employeeNum
module.exports.getEmployeeByNum = (empNum) => {

    //return a new promise
    return new Promise((resolve, reject) => {

        Employee.findOne({
            where: { employeeNum: empNum }
        }).then(result => {
            resolve(result);
        }).catch(() => {
            reject("no results returned");
        });
    });
};

//Get an employee by employeeNum
module.exports.getDepartmentById = (depId) => {
    
        //return a new promise
        return new Promise((resolve, reject) => {
    
            Department.findOne({
                where: { departmentId: depId }
            }).then(result => {
                resolve(result);
            }).catch(() => {
                reject("no results returned");
            });
        });
    };

//Get employees that match the employee's status
module.exports.getEmployeesByStatus = (empStatus) => {

    //return a new promise
    return new Promise((resolve, reject) => {

        Employee.findAll({
            where: { status: empStatus }
        }).then(result => {
            resolve(result);
        }).catch(() => {
            reject("no results returned");
        });
    });
};

//Get employees that in a department
module.exports.getEmployeesByDepartment = (empDepartment) => {

    //return a new promise
    return new Promise((resolve, reject) => {

        Employee.findAll({
            where: { department: empDepartment }
        }).then(result => {
            resolve(result);
        }).catch(() => {
            reject("no results returned");
        });
    });
};

//Get employees that are under same manager
module.exports.getEmployeesByManager = (empManager) => {

    //return a new promise
    return new Promise((resolve, reject) => {

        Employee.findAll({
            where: { employeeNum: empManager }
        }).then(result => {
            resolve(result);
        }).catch(() => {
            reject("no results returned");
        });
    });
};

//Get employees that are managers
module.exports.getManagers = () => {

    return new Promise((resolve, reject) => {

        Employee.findAll({
            where: { isManager: true }
        }).then(result => {
            resolve(result);
        }).catch(() => {
            reject("no results returned");
        });
    });
};

//Get all departments
module.exports.getDepartments = () => {

    return new Promise((resolve, reject) => {

        Department.findAll()
            .then(result => {
                //console.log(result);
                resolve(result)
            })
            .catch(() => reject("no results returned"))
    });
};

//To add a new employee
module.exports.addEmployee = (employeeData) => {

    var empIsManager = (employeeData.isManager) ? true : false;
    return new Promise((resolve, reject) => {

        Employee.create({
            employeeNum: employeeData.employeeNum,
            firstName: employeeData.firstName,
            lastName: employeeData.lastName,
            email: employeeData.email,
            SSN: employeeData.SSN,
            addressStreet: employeeData.addressStreet,
            addresCity: employeeData.addresCity,
            addressState: employeeData.addressState,
            addressPostal: employeeData.addressPostal,
            maritalStatus: employeeData.maritalStatus,
            isManager: empIsManager,
            employeeManagerNum: employeeData.employeeManagerNum,
            status: employeeData.status,
            department: employeeData.department,
            hireDate: employeeData.hireDate
        }).then(() => {
            // you can now access the newly created Project via the variable project
            resolve("-------------New employee created!-----------")
        }).catch((error) => {
            reject("something went wrong!");
        });
    });
};

//To add a new employee
module.exports.updateDepartment = (departmentData) => {

    return new Promise((resolve, reject) => {

        Department.update({
            departmentName: departmentData.departmentName
        }, {
            where: { departmentId: departmentData.departmentId }
        }).then(() => resolve())
    });
};

//To add a new employee
module.exports.addDepartment = (departmentData) => {

    return new Promise((resolve, reject) => {

        Department.create({
            departmentId: departmentData.departmentId,
            departmentName: departmentData.departmentName
        }).then(() => {
            // you can now access the newly created Project via the variable project
            resolve("New department created!")
        }).catch((error) => {
            reject("something went wrong!");
        });
    });
};

//method to update information for an employee
module.exports.updateEmployee = (employeeData) => {

    return new Promise((resolve, reject) => {

        Employee.update({
            firstName: employeeData.firstName,
            lastName: employeeData.lastName,
            email: employeeData.email,
            SSN: employeeData.SSN,
            addressStreet: employeeData.addressStreet,
            addresCity: employeeData.addresCity,
            addressState: employeeData.addressState,
            addressPostal: employeeData.addressPostal,
            maritalStatus: employeeData.maritalStatus,
            isManager: employeeData.isManager,
            employeeManagerNum: employeeData.employeeManagerNum,
            status: employeeData.status,
            department: employeeData.department,
            hireDate: employeeData.hireDate
        },
            {
                where: { employeeNum: employeeData.employeeNum }
            }).then(() => resolve())

    })
}


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


module.exports.deleteEmployeeByNum = (empNum) => {

    return new Promise((resolve, reject) => {

        Employee.destroy( {
            where: { employeeNum: empNum}
        }).then(() => resolve())
        
    })
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