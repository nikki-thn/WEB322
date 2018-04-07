const bcrypt = require('bcryptjs');
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var connectionString = "mongodb://nikki_web322:web322@ds231719.mlab.com:31719/web322_a6"

var userSchema = new Schema({
    "userName": { "type": String, "unique": true },
    "password": String,
    "email": String,
    "loginHistory": [{
        "dateTime": Date,
        "userAgent": String
    }],
});

let User;

module.exports.initialize = () => {

    return new Promise((resolve, reject) => {
        let db = mongoose.createConnection(connectionString);
        //reject the promise with provided error
        db.on('error', err => reject(err));
        db.once('open', () => {
            User = db.model("users", userSchema);
            resolve();
        });
    });
};


module.exports.registerUser = (userData) => {

    console.log(userData);

    return new Promise((resolve, reject) => {
        if (userData.password != userData.password2) {
            reject("Passwords do not match")
        }
        else {
            bcrypt.genSalt(10, function (err, salt) { // Generate a "salt" using 10 rounds
                bcrypt.hash(userData.password, salt, function (err, hash) { // encrypt the password: "myPassword123"

                    if (err) {
                        reject("There was an error encrypting the password");
                    }
                    else {
                        let newUser = new User(userData);
                        newUser.password = hash;

                        // save new User
                        newUser.save((error) => {
                            if (error) {
                                if (error.code == 11000) {
                                    reject("User Name already taken");
                                } else if (error) {
                                    reject("There was an error creating the user: " + error);
                                }
                            }
                            else {
                            resolve();
                            }
                        });
                    }
                });

            });
        }
    });
};

module.exports.checkUser = (userData) => {

    return new Promise((resolve, reject) => {

        User.find({ userName: userData.userName })
            //.sort({}) //optional "sort" - https://docs.mongodb.com/manual/reference/operator/aggregation/sort/ 
            .exec()
            .then((users) => {

                if (users[0] == null) {
                    reject("Unable to find user: " + userData.userName);
                } else {
           
                    bcrypt.compare(userData.password, users[0].password).then((res) => {

                        if (res) {                           
                            users[0].loginHistory.push({ dateTime: (new Date()).toString(), userAgent: userData.userAgent });
                            User.update({ userName: users[0].userName},
                                { $set: { loginHistory: users[0].loginHistory }})
                                .exec()
                                .then(() => {
                                    resolve(users[0]);
                                    //console.log("logged in", users);
                                })
                                .catch((err) => reject("There was an error verifying the user: ", err));
                        }
                        else {
                            reject("Unable to find user: " + userData.userName);
                        }
                        resolve(users[0]);
                    }).catch((err) => reject("There was an error encrypting the password"));
                }
            })
            .catch(err => reject("Unable to find user: ", userData.user));
    });
};
