const express = require("express");
const bodyParser = require("body-parser");
// const data = require(__dirname + "/date.js");
const { Template } = require("ejs");
const mongoose = require("mongoose");
var _ = require('lodash');
require('dotenv').config();



const app = express();

mongoose.connect(process.env.URL, { useNewUrlParser: true, useUnifiedTopology: true });

const todo = {
    name: String
};

const Item = mongoose.model("item", todo);


const listSchema = {
    name: String,
    items: [todo]
};

const Listschema = mongoose.model("Listscheme", listSchema);

const rootdatabase = {
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    items: [todo]
};
const List = mongoose.model("Todolist", rootdatabase);

app.set('view engine', 'ejs');
const item1 = new Item({
    name: "Hello"
})
const today = new Listschema({
    name: "Today",
    items: []
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static("public"));

app.get("/", function(req, res) {
    res.render('homepage');
});

app.get("/login", function(req, res) {
    res.render('lgandsb', {
        Heading: "Login",
        headpost: "login"
    });
});

app.get("/signup", function(req, res) {
    res.render('lgandsb', {
        Heading: "Sign Up",
        headpost: "signup"
    });
});


app.post("/:id", function(req, res) {

    if (req.params.id == "signup") {
        const newEntry = new List({
            name: req.body.username,
            password: req.body.password,
            items: []
        });
        newEntry.save(function(err) {
            if (err) {
                res.render('info', {
                    err: err,
                    url: req.params.id
                });
            } else {
                res.redirect('/login');
            }

        });
    } else {
        List.findOne({ name: req.body.username, password: req.body.password }, function(err, user) {
            console.log(user);
            if (user == null) {
                res.render('info', {
                    err: "Incorrect Username and Password",
                    url: "Home"
                })
            } else if (!err) {
                res.redirect(req.body.username + '/today');
            } else {
                res.render('info', {
                    err: err,
                    url: "Home"
                });
            }
        });
    }
})

app.post("/:user/:id/add", function(req, res) {

    const item = req.body.newItem;
    const listname = _.camelCase(req.body.list);
    const user = req.params.user;
    const newItem = new Item({
        name: item
    });
    console.log(listname + " Add")

    console.log(newItem);
    List.findOne({ name: req.params.user }, 'items', function(err, foundList) {
        console.log(foundList);
        if (!err) {
            foundList.items.push(newItem);
            foundList.save();
            res.redirect("/" + user + "/" + listname);
        } else {
            res.redirect('info', {
                err: err,
                url: "Home"
            });
        }

    });
});

app.post("/:user/:id/delete", function(req, res) {
    const checkboxId = req.body.checkbox;
    const listname = _.camelCase(req.body.listname);
    const username = req.params.user;
    console.log(listname + " delete");

    List.findOneAndUpdate({ name: username }, { $pull: { items: { _id: checkboxId } } }, function(err, result) {
        if (!err) {
            res.redirect("/" + username + "/" + req.params.id);
        } else {
            console.log(err);
        }
    });
});

app.get("/:user/:customList", function(req, res) {
    const customListname = _.camelCase(req.params.customList);

    List.findOne({ name: req.params.user }, 'items', function(err, foundList) {
        if (!err) {
            res.render("list", {
                ListTitle: _.capitalize(customListname),
                newListitem: foundList,
                username: req.params.user,
                titlepost: customListname
            });
        } else {
            res.render("info", {
                err: err,
                url: "Home"
            });
        }

    });
});


app.get("/about", function(req, res) {
    res.render("about");
});

app.listen(process.env.PORT || 3000, function(req, res) {
    console.log("listening on port 3000");
});