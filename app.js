const express = require("express");
const bodyParser = require("body-parser");
// const data = require(__dirname + "/date.js");
const { Template } = require("ejs");
const mongoose = require("mongoose");
var _ = require('lodash');

const app = express();

mongoose.connect('mongodb+srv://admin-sarfraz:2june2002@cluster0.f1xwx.mongodb.net/todolistDB', { useNewUrlParser: true, useUnifiedTopology: true });

const todo = {
    name: String
};

const Item = mongoose.model("TodoList", todo);

const item1 = new Item({
    name: "Welcome to your ToDoList"
});

const item2 = new Item({
    name: "Testing 2"
});

const item3 = new Item({
    name: "Testing 3"
});

const defaultItems = [item1, item2, item3];


const listSchema = {
    name: String,
    items: [todo]
};

const List = mongoose.model("List", listSchema);

app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static("public"));

app.get("/", function(req, res) {


    Item.find({}, function(err, item) {

        res.render("list", {
            ListTitle: "Today",
            newListitem: item
        });

    });

});



app.post("/", function(req, res) {

    const item = req.body.newItem;
    const listname = _.camelCase(req.body.list);
    const newItem = new Item({
        name: item
    });
    console.log(listname + " Add")
    if (listname === "today") {
        newItem.save();
        res.redirect("/");
    } else {
        List.findOne({ name: listname }, function(err, foundList) {
            foundList.items.push(newItem);
            foundList.save();
            res.redirect("/" + listname);
        });
    }
});

app.post("/delete", function(req, res) {
    const checkboxId = req.body.checkbox;
    const listname = _.camelCase(req.body.listname);
    console.log(listname + " delete");

    if (listname === "today") {
        Item.findByIdAndRemove(checkboxId, function(err) {
            if (err) {
                res.redirect("/");
            } else {
                res.redirect("/");
            }
        });
    } else {
        List.findOneAndUpdate({ name: listname }, { $pull: { items: { _id: checkboxId } } }, function(err, result) {
            if (!err) {
                res.redirect("/" + listname);
            }
        });

    }

});

app.get("/:customList", function(req, res) {
    const customListname = _.camelCase(req.params.customList);

    List.findOne({ name: customListname }, function(err, foundList) {

        if (!err) {
            if (!foundList) {
                const list = new List({
                    name: customListname,
                    items: []
                });
                list.save();
                console.log("Does not Exit");
                res.redirect("/" + customListname);
            } else {
                console.log(foundList.items);
                res.render("list", {
                    ListTitle: _.capitalize(customListname),
                    newListitem: foundList.items
                });
                console.log("Exists");
            }
        }
    })

});


app.get("/about", function(req, res) {
    res.render("about");
});

app.listen(process.env.PORT || 3000, function(req, res) {
    console.log("listening on port 3000");
});