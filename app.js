const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
// const md5 = require("md5");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect('mongodb+srv://akash-admin:new123@cluster2.nhfnq.mongodb.net/adminuserdb?retryWrites=true&w=majority', { useNewUrlParser: true });


const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// var secret = "thisislittlebitsecret";
// userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);
app.get('/', (req, res) => {
    res.render('home')
});
app.get('/login', (req, res) => {
    res.render('login')
});
app.get('/register', (req, res) => {
    res.render('register')
});

app.post("/register", function(req, res) {

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {

        const newUser = new User({
            email: req.body.username,
            password: hash
        });
        newUser.save(function(err) {
            if (err) {
                console.log(err);
            } else {
                res.render("secrets");
            }
        });
    });
    // const newUser = new User({
    //     email: req.body.username,
    //     password: md5(req.body.password)
    // });
    // newUser.save(function(err) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         res.render("secrets");
    //     }
    // });
});
app.post("/login", function(req, res) {

    var username = req.body.username;
    var password = req.body.password;
    User.findOne({ email: username }, function(err, find) {
        if (err) {
            console.log(err);
        } else {
            if (find) {
                bcrypt.compare(password, find.password, function(err, result) {
                    if (result === true) {
                        res.render("secrets");
                    } else {
                        res.send("Wrong information ! please enter write information then try again");
                    }
                });


            } else {
                res.send("Wrong information ! please enter write information then try again");
            }
        }
    })
})
let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}
app.listen(port, function() {
    console.log("Server started");
});