var express = require("express");
var app = express();
var path = require("path");
var dataService = require("./data-service.js");


var HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

//for loading css
app.use(express.static('public'));

// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/views/home.html"));
});

// setup another route to listen on /about
app.get("/home", function (req, res) {
    res.sendFile(path.join(__dirname + "/views/home.html"));
});

// setup another route to listen on /about
app.get("/about", function (req, res) {
    res.sendFile(path.join(__dirname + "/views/about.html"));
});

// setup route to listen on /employees
app.get("/employees", function (req, res) {
    dataService.getAllEmployees()
        .then(function (data) {
            res.send(data);
        }).catch(function (msg) {
            console.log(msg);
        })
});

// setup route to listen on /managers
app.get("/managers", function (req, res) {
    dataService.getManagers()
        .then(function(data){
            res.send(data);
        }).catch(function(msg){
            console.log(msg);
        })
});

// setup route to listen on /departments
app.get("/departments", function (req, res) {
    dataService.getDepartments()
    .then(function(data){
        res.send(data);
    }).catch(function(msg){
        console.log(msg);
    })
});

// setup route to listen on /departments
app.get("*", function (req, res) {
    res.status(404).send("<h1>404</h1><p>Page Not Found</p>");
});

// setup http server to listen on HTTP_PORT
dataService.initialize()
    .then(function (data) {
        app.listen(HTTP_PORT, onHttpStart);
    })
    .catch(function (msg) {
        console.log(msg);
    });

