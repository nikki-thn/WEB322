var fs = require("fs");

const Sequelize = require('sequelize');

// set up sequelize to point to our postgres database
var sequelize = new Sequelize('dfdoamtptvpsql', 'jifowjanpqpiij', '0f4453dd6359eb81a581f20b8b00f2b876cb413853863ba208ea33d8d8763a09', {
    host: 'ec2-23-21-171-25.compute-1.amazonaws.com',
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
        })
            .then(result => resolve(result))
            .catch(() => reject("no results returned"));
    });
};

//Get an employee by employeeNum
module.exports.getDepartmentById = (depId) => {

    //return a new promise
    return new Promise((resolve, reject) => {

        Department.findOne({
            where: { departmentId: depId }
        })
        .then(result => resolve(result))
        .catch(() => reject("no results returned"));
    });
};

//Get employees that match the employee's status
module.exports.getEmployeesByStatus = (empStatus) => {

    //return a new promise
    return new Promise((resolve, reject) => {

        Employee.findAll({
            where: { status: empStatus }
        })
        .then(result => resolve(result))
        .catch(() => reject("no results returned"));
    });
};

//Get employees that in a department
module.exports.getEmployeesByDepartment = (empDepartment) => {

    //return a new promise
    return new Promise((resolve, reject) => {

        Employee.findAll({
            where: { department: empDepartment }
        })
        .then(result => resolve(result))
        .catch(() => reject("no results returned"));
    });
};

//Get employees that are under same manager
module.exports.getEmployeesByManager = (empManager) => {
    //return a new promise
    return new Promise((resolve, reject) => {

        Employee.findAll({
            where: { employeeManagerNum: empManager }
        })
        .then(result => resolve(result))
        .catch(() => reject("no results returned"));
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
            .then(result => resolve(result))
            .catch(() => reject("no results returned"))
    });
};

//To add a new employee
module.exports.addEmployee = (employeeData) => {

    var empIsManager = (employeeData.isManager) ? true : false;

    for (let prop of Object.keys(employeeData)) {
        if (employeeData[prop] == "") {
            employeeData[prop] = null;
            console.log(employeeData[prop]);
        }
    }

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
        }).then(() => resolve("New employee created!"))
        .catch((error) => {
            reject("something went wrong!");
        });
    });
};

//To add a new employee
module.exports.updateDepartment = (departmentData) => {

    for (let prop of Object.keys(departmentData)) {
        if (departmentData[prop] == "") {
            departmentData[prop] = null;
        }
    }

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

        for (let prop of Object.keys(departmentData)) {
            if (departmentData[prop] == "") {
                departmentData[prop] = null;
            }
        }

        Department.create({
            departmentId: departmentData.departmentId,
            departmentName: departmentData.departmentName
        }).then(() => resolve("New department created!"))
        .catch((error) => {
            reject("something went wrong!");
        });
    });
};

//method to update information for an employee
module.exports.updateEmployee = (employeeData) => {

    for (let prop of Object.keys(employeeData)) {
        if (employeeData[prop] == "") {
            employeeData[prop] = null;
        }
    }

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
            })
            .then(() => resolve())

    })
};


//Get all files in the ./public/images/uploaded folder
module.exports.getImages = () => {

    var imageJSON = { images: [] };

    return new Promise((resolve, reject) => {

        fs.readdir("./public/images/uploaded", function (err, items) {

            for (var i = 0; i < items.length; i++)
                imageJSON.images.push(items[i]);

            if (imageJSON.length != 0) resolve(imageJSON);
            else reject("No images stored");
        });
    });
};


module.exports.deleteEmployeeByNum = (empNum) => {

    return new Promise((resolve, reject) => {

        Employee.destroy({
            where: { employeeNum: empNum }
        }).then(() => resolve())
    })
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
