const express = require("express");
const bodyParser = require("body-parser");
const data = require(__dirname + "/date.js");
const { Template } = require("ejs");

const app = express();

app.set('view engine', 'ejs');

const items = ['Buy Food', 'Cook Food', 'Eat Food'];
const workitems = [];


app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static("public"));

app.get("/", function(req, res) {

    let day = data.getDate();

    res.render("list", {
        ListTitle: day,
        newListitem: items
    });
});



app.post("/", function(req, res) {

    const item = req.body.newItem;
    if (req.body.list === "Work") {
        workitems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }


});

app.get("/work", function(req, res) {
    res.render("list", {
        ListTitle: "Work List",
        newListitem: workitems
    })
});

app.post("/work", function(req, res) {
    let item = req.body.newItem;
    workitems.push(item);
    res.redirect("/work");
});

app.get("/about", function(req, res) {
    res.render("about");
});

app.listen(3000, function(req, res) {
    console.log("listening on port 3000");
});