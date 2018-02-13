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
*
********************************************************************************/ 


var express = require("express");
var app = express();
var path = require("path");
var dataService = require("./data-service.js");
var multer = require("multer");
var fs = require("fs");


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
      // in a large web service this would possibly cause a problem if two people
      // uploaded an image at the exact same time. A better way would be to use GUID's for filenames.
      // this is a simple example.
      cb(null, Date.now() + path.extname(file.originalname));
    }
});
  
// tell multer to use the diskStorage function for naming files instead of the default.
const upload = multer({ storage: storageDir});

//for loading css
app.use(express.static('public'));

// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/views/home.html"));
});

// setup another route to listen on /about
app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname + "/views/home.html"));
});

// setup another route to listen on /about
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname + "/views/about.html"));
});

// setup route to listen on /employees
app.get("/employees", (req, res) => {
    dataService.getAllEmployees()
        .then(data => res.json(data))
        .catch(msg => console.log(msg));      
});

// setup route to listen on /managers
app.get("/managers", (req, res) => {
    dataService.getManagers()
        .then(data => res.json(data))
        .catch(msg => console.log(msg));
});

// setup route to listen on /departments
app.get("/departments", (req, res) => {
    dataService.getDepartments()
    .then(data => res.json(data))
    .catch(msg => console.log(msg))
});


// setup route to listen on /departments
app.get("/images", (req, res) => { 
    dataService.getImages()
    .then(data => res.json(data))
    .catch(msg => console.log(msg))
});

// setup route to listen on /departments
app.get("/employees/add", (req, res) => {
    res.sendFile(path.join(__dirname + "/views/addEmployee.html"));
});

// setup route to listen on /departments
app.get("/images/add", (req, res) => {
    res.sendFile(path.join(__dirname + "/views/addImage.html"));
});

app.post("/images/add",  upload.single("imageFile"), (req, res) => {
    res.redirect("/images/add");
    console.log("File uploaded sucessfully");
});

// setup route to listen on /departments
app.get("*", (req, res) => {
    res.status(404).send("<h1>404</h1><p>Page Not Found</p>");
});

// setup http server to listen on HTTP_PORT
dataService.initialize()
    .then(data => app.listen(HTTP_PORT, onHttpStart))
    .catch(msg => console.log(msg));


