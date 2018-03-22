/*********************************************************************************
* WEB322 – Assignment 03
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Nikki Truong
* Student ID: 112 314 174
* Date: February 20, 2018
*
* Online (Heroku) Link: https://rocky-lake-84165.herokuapp.com
********************************************************************************/

//ISSUES: department

var express = require("express");
var app = express();
var path = require("path");
var dataService = require("./data-service.js");
var multer = require("multer");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");

var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

// multer requires a few options to be setup to store files with file extensions
// by default it won't store extensions for security reasons
const storageDir = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
        // we write the filename as the current date down to the millisecond
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// tell multer to use the diskStorage function for naming files instead of the default.
const upload = multer({ storage: storageDir });

//for handlebars
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: {
        navLink: function (url, options) {
            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
}));

app.set('view engine', '.hbs');

//for loading css
app.use(express.static('public'));

//to correct active path
app.use(function (req, res, next) {
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});

//to handle text-form submission from front-end
app.use(bodyParser.urlencoded({ extended: true }));

// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", (req, res) => {
    res.render('home');
});

// setup another route to listen on /home
app.get("/home", (req, res) => {
    res.render('home');
});

// setup another route to listen on /about
app.get("/about", (req, res) => {
    res.render('about');
});

// setup route to response to /employees/value
// app.get("/employee/:value", (req, res) => {
//     dataService.getEmployeeByNum(req.params.value)
//         .then(data => { 
//             var departments = []
//             res.render('employee', { employee: data })})
//         .catch(msg => { message: "no results"});
// });

app.get("/employee/:empNum", (req, res) => {
    // initialize an empty object to store the values
    let viewData = {};
    dataService.getEmployeeByNum(req.params.empNum).then((data) => {
        if (data) {
            viewData.employee = data; //store employee data in the "viewData" object as "employee"
        } else {
            viewData.employee = null; // set employee to null if none were returned
        }
    }).catch(() => {
        viewData.employee = null; // set employee to null if there was an error
    }).then(dataService.getDepartments)
        .then((data) => {
            viewData.departments = data; // store department data in the "viewData" object as "departments"
            // loop through viewData.departments and once we have found the departmentId that matches
            // the employee's "department" value, add a "selected" property to the matching
            // viewData.departments object
            for (let i = 0; i < viewData.departments.length; i++) {
                if (viewData.departments[i].departmentId == viewData.employee.department) {
                    viewData.departments[i].selected = true;
                }
            }
        }).catch(() => {
            viewData.departments = []; // set departments to empty if there was an error
        }).then(() => {
            if (viewData.employee == null) { // if no employee - return an error
                res.status(404).send("Employee Not Found");
            } else {
                console.log(viewData);
                res.render("employee", { viewData: viewData }); // render the "employee" view
            }
        });
});
   

//to update employee
app.post("/employee/update", (req, res) => {
    dataService.updateEmployee(req.body)
    .then(() => res.redirect("/employees"))
    .catch((err) => res.status(500).send("Unable to Update Employee"));    
});

// setup route to listen on /employees/add
app.get("/employees/add", (req, res) => {
    dataService.getDepartments()
    .then(data => {
        console.log(data);
        res.render("addEmployee", { departments: data})})   
    .catch(() => res.render("addEmployee", {departments: []}))
});

// setup route to add a new employee
app.post("/employees/add", (req, res) => {
    dataService.addEmployee(req.body)
    .then(() => res.redirect("/employees"))
    .catch((err) => res.status(500).send("Unable to Add Employee"));    
});

// setup route to listen on /employees
app.get("/employees", (req, res) => {

    //Case /employees?status=value
    if (req.query.status != null) {
        dataService.getEmployeesByStatus(req.query.status)
            .then(data => res.render('employees', { employees: data }))
            .catch(msg => res.render({ message: "no results" }));
    }
    //Case /employees?department=value
    else if (req.query.department != null) {
        dataService.getEmployeesByDepartment(req.query.department)
            .then(data => res.render('employees', { employees: data }))
            .catch((err) => res.status(500).send("NOT FOUND"));    
    }
    //Case /employees?manager=value
    else if (req.query.manager != null) {
        dataService.getEmployeesByManager(req.query.manager)
            .then(data => res.render('employees', { employees: data }))
            .catch((err) => res.status(500).send("NOT FOUND"));    
    }
    //Case /employees
    else {
        dataService.getAllEmployees()
            .then(data => res.render('employees', { employees: data }))
            .catch(msg => res.render({ message: "no results" }));
    }
});

app.get("/employees/delete/:empNum", (req, res) => {
    dataService.deleteEmployeeByNum(req.params.empNum)
    .then(() => res.redirect('/employees'))
    .catch((err) => res.status(500).send("NOT FOUND"));    
});

// setup route to listen on /departments
app.get("/departments", (req, res) => {
    dataService.getDepartments()
        .then(data => res.render('departments', { departments: data }))
        .catch(msg => res.render({ message: "no results" }));
});

// setup route to response to /employees/value
app.get("/department/:value", (req, res) => {
    dataService.getDepartmentById(req.params.value)
        .then(data => { 
            //var departments = [] //??
            res.render('department', { department: data })})
        .catch(() => res.status(404).send("Department Not Found"));
});

//to update department
app.post("/departments/update", (req, res) => {
    dataService.updateDepartment(req.body)
    .then(() => res.redirect("/departments"))
    .catch((err) => res.status(500).send("Unable to Update Department"));    
});

// setup route to add a new department
app.post("/departments/add", (req, res) => {
    dataService.addDepartment(req.body)
        .then(() => res.redirect("/departments"))
        .catch((err) => res.status(500).send("Unable to Add Department"));    
});

// setup route to listen on /employees/add
app.get("/departments/add", (req, res) => {
    res.render('addDepartment');
});

// setup route to listen on /images
app.get("/images", (req, res) => {
    dataService.getImages()
        .then(data => res.render('images', data))
        .catch(msg => console.log(msg))
});

// setup route to listen on /images/add
app.get("/images/add", (req, res) => {
    res.render('addImage');
});

// setup route to upload image from html input
app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images/add");
    console.log("File uploaded sucessfully");
});

// setup route to listen on any other routes
app.get("*", (req, res) => {
    res.status(404).send("<h1>404</h1><p>Page Not Found</p>");
});

// setup http server to listen on HTTP_PORT
dataService.initialize()
    .then(() => app.listen(HTTP_PORT, onHttpStart))
    .catch(msg => console.log(msg));

