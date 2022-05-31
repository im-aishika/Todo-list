const express = require("express");
const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');

console.log(date);
const app = express();

app.use(express.urlencoded( {extended: true }));
app.use(express.static("public"));

app.set('view engine', 'ejs');


const port = (process.env.PORT || 3000);

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemSchema = {
    name: {
      type: String,
      required: [true, "Task name required, please specify a name"]
    }
};

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Welcome to your todo-list"
});

const item2 = new Item({
  name: "Hit the + button to add a new item"
});

const item3 = new Item({
  name: "<-- Hit this to delete an item"
});

const defaultItems = [item1, item2, item3];

app.get("/", function (req, res) {

    //let day = date();
    Item.find({}, function(err, foundItems) {

      if(foundItems.length === 0) {

        Item.insertMany(defaultItems, function (err) {
            if(err) {
              console.log(err);
            } else {
              console.log("Successfully saved default items to DB!");
            }
          });

          res.redirect("/");
      }
      else {
          res.render("list", {listTitle: "Today", newListItems: foundItems});
      }

    });
});

app.get("/:customListName", function(req, res) {
    const customListName = req.params.customListName;
    console.log(customListName);

    List.findOne({name: customListName}, function(err, foundList) {
        if(!err) {
            if(!foundList) {
              //create a new list
              const list = new List ({
                  name: customListName,
                  items: defaultItems
              });

              list.save();

              res.redirect("/" + customListName);
            } else {
                //show an existing list
                res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
            }
        }
    });
});

const listSchema = {
  name: String,
  items: [itemSchema]
};

const List = mongoose.model("List", listSchema);

app.post("/", function(req, res){
    const itemName = req.body.newItem;
    const listName = req.body.listName;

    const item = new Item ({
      name: itemName
    });

    if(listName === "Today") {
      item.save();
      res.redirect("/");
    } 
    else {
      List.findOne({name: listName}, function (err, foundList) {
        foundList.items.push(item);
        foundList.save();
        res.redirect("/" + listName);
      });
    }
});


app.post("/delete", function(req, res) {
  const id = req.body.deleteItem;

  Item.findByIdAndRemove(id, function(err) {
    if(err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  })
})
app.listen(port, function() {
  console.log("Server listening to port " + port);
});
