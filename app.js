const express = require("express");
const date = require(__dirname + "/date.js");

console.log(date);
const app = express();

app.use(express.urlencoded( {extended: true }));
app.use(express.static("public"));

app.set('view engine', 'ejs');


const port = (process.env.PORT || 3000);



let items = ["Leetcode", "GFG", "Core Domain"];
let workItems = [];

app.get("/", function (req, res) {

    let day = date();

    res.render("list", {kindOfDay: day, newListItems: items});

});

app.get("/work", function(req, res) {
  res.render("list", {kindOfDay: "Work", newListItems: workItems});
})

app.post("/", function (req, res){
  let item = req.body.newItem;

  if(req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }

});

app.listen(port, function() {
  console.log("Server listening to port " + port);
});
