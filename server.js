/*********************************************************************************
* WEB322 – Assignment 05
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Credits: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in
*
* Name: Nikki Truong
* Student ID: 112 314 174
* Date: February 20, 2018
*
* Online (Heroku) Link: https://calm-brushlands-27677.herokuapp.com/
********************************************************************************/


var express = require("express");
var app = express();
var path = require("path");
var dataService = require("./data-service.js");
var multer = require("multer");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var dataServiceAuth = require("./data-service-auth.js");
var clientSessions = require("client-sessions");
var HTTP_PORT = process.env.PORT || 8080;
const HTTPS_PORT = 4433;
const http = require("http");
const https = require("https");
const SSL_KEY_FILE = "server.key";
const SSL_CRT_FILE = "server.crt";
const fs = require("fs");

const https_options = {
    key: fs.readFileSync(__dirname + "/" + SSL_KEY_FILE),
    cert: fs.readFileSync(__dirname + "/" + SSL_CRT_FILE)
  };

// call this function after the http server starts listening for requests
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

// call this function after the https server starts listening for requests
function onHttpsStart() {
    console.log("Express https server listening on: " + HTTPS_PORT);
  }

// Setup client-sessions
app.use(clientSessions({
    cookieName: "session", // this is the object name that will be added to 'req'
    secret: "week10example_web322", // this should be a long un-guessable string.
    duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
    activeDuration: 1000 * 60 // the session will be extended by this many ms each request (1 minute)
}));

// Setup client-sessions
app.use(function(req, res, next) {
    res.locals.session = req.session;
   next();
});

// This is a helper middleware function that checks if a user is logged in
// we can use it in any route that we want to protect against unauthenticated access.
// A more advanced version of this would include checks for authorization as well after
// checking if the user is authenticated
function ensureLogin(req, res, next) {
    console.log(req.session.user);
    if (!req.session.user) {
      res.redirect("/login");
    } else {
      next();
    }
  }
  
  // Parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));

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

// login route
app.get("/login", (req, res) => {
    res.render('login');
});

app.post("/login", (req, res) => {

    req.body.userAgent = req.get('User-Agent');

    dataServiceAuth.checkUser(req.body)
    .then((user) => {
   
        req.session.user = {
            userName: user.userName,// authenticated user's userName
            email: user.email,// authenticated user's email
            loginHistory: user.loginHistory// authenticated user's loginHistory
        }
        res.redirect('/employees');
    })
    .catch(err => res.render('login', {errorMessage: err, userName: req.body.userName}))
});

app.get("/register", (req, res) => {
    res.render('register');
});

app.post("/register", (req, res) => {
    dataServiceAuth.registerUser(req.body)
    .then(user => res.render('register', {successMessage: "User created"}))
    .catch(err => res.render('register', {errorMessage: err, userName: req.body.userName}))
});

app.get("/logout", (req, res) => {
    req.session.reset();
    res.redirect('/');
});

app.get("/userHistory", ensureLogin, (req, res) => {
    res.render('userHistory');
});

app.get("/employee/:empNum", ensureLogin, (req, res) => {
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
                res.render("employee", { viewData: viewData }); // render the "employee" view
            }
        });
}); 

//to update employee
app.post("/employee/update", ensureLogin, (req, res) => {
    dataService.updateEmployee(req.body)
    .then(() => res.redirect("/employees"))
    .catch((err) => res.status(500).send("Unable to Update Employee"));    
});

// setup route to listen on /employees/add
app.get("/employees/add", ensureLogin, (req, res) => {
    dataService.getDepartments()
    .then(data => res.render("addEmployee", { departments: data}))   
    .catch(() => res.render("addEmployee", {departments: []}))
});

// setup route to add a new employee
app.post("/employees/add", ensureLogin, (req, res) => {
    dataService.addEmployee(req.body)
    .then(() => res.redirect("/employees"))
    .catch((err) => res.status(500).send("Unable to Add Employee"));    
});

// setup route to listen on /employees
app.get("/employees", ensureLogin, (req, res) => {

    //Case /employees?status=value
    if (req.query.status != null) {
        console.log()
        dataService.getEmployeesByStatus(req.query.status)
            .then(data => res.render('employees', { employees: data }))
            .catch(msg => res.render({ message: "no results" }));
    }
    //Case /employees?department=value
    else if (req.query.department != null) {
        dataService.getEmployeesByDepartment(req.query.department)
            .then(data => res.render('employees', { employees: data }))
            .catch((err) => res.render({ errorMessage: err }, 'login'));   
    }
    //Case /employees?manager=value
    else if (req.query.manager != null) {
        dataService.getEmployeesByManager(req.query.manager)
            .then(data => res.render('employees', { employees: data }))
            .catch((err) => res.render({ errorMessage: err }, 'login'));   
    }
    //Case /employees
    else {
        dataService.getAllEmployees()
            .then(data => res.render('employees', { employees: data }))
            .catch(msg => res.render({ errorMessage: err }, 'login'))
    }
});

app.get("/employees/delete/:empNum", ensureLogin, (req, res) => {
    dataService.deleteEmployeeByNum(req.params.empNum)
    .then(() => res.redirect('/employees'))
    .catch((err) => res.status(500).send("NOT FOUND"));    
});

// setup route to listen on /departments
app.get("/departments", ensureLogin, (req, res) => {
    dataService.getDepartments()
        .then(data => res.render('departments', { departments: data }))
        .catch(msg => res.render({ message: "no results" }));
}); 

// setup route to response to /employees/value
app.get("/department/:value", ensureLogin, (req, res) => {
    dataService.getDepartmentById(req.params.value)
        .then(data => { 
            //var departments = [] //??
            res.render('department', { department: data })})
        .catch(() => res.status(404).send("Department Not Found"));
});

//to update department
app.post("/department/update", ensureLogin, (req, res) => {
    dataService.updateDepartment(req.body)
    .then(() => res.redirect("/departments"))
    .catch((err) => res.status(500).send("Unable to Update Department"));    
});

// setup route to add a new department
app.post("/departments/add", ensureLogin, (req, res) => {
    dataService.addDepartment(req.body)
        .then(() => res.redirect("/departments"))
        .catch((err) => res.status(500).send("Unable to Add Department"));    
});

// setup route to listen on /employees/add
app.get("/departments/add", ensureLogin, (req, res) => {
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
    .then(dataServiceAuth.initialize)
    .then(() => {

        // listen on ports HTTP_PORT and HTTPS_PORT. The default port for http is 80, https is 443. We use 8080 and 4433 here
        // because sometimes port 80 is in use by other applications on the machine and using port 443 requires admin access on osx
        http.createServer(app).listen(HTTP_PORT, onHttpStart);
        https.createServer(https_options, app).listen(HTTPS_PORT, onHttpsStart);
        console.log("app listening on: " + HTTP_PORT);

    }).catch((err) => {
        console.log("unable to start server: " + err);
    });
