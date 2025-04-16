var http = require("http");
var path = require("path");
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");

var app = express();

//The first line tells Express that the views are in the views folder; the next line says the views will use the EJS engine.
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

//Creates a global array to store all your entries
var entries = [];

//Makes this entries array available in all views
app.locals.entries = entries;

//Uses Morgan to log  every request
app.use(logger("dev"));

//Populates a variable called req.body if the user is submitting a form. (The extended option is required.)
app.use(bodyParser.urlencoded({ extended: false }));

//When visiting the site root, renders the homepage (at views/index.ejs)
app.get("/", function (request, response) {
  response.render("index");
});

//Renders the “new entry” page (at views/index.ejs) when GETting the URL
app.get("/new-entry", function (request, response) {
  response.render("new-entry");
});

//Defines a route handler when you POST to the “new￾entry” URL in contrast to a GET
app.post("/new-entry", function (request, response) {
  // If user submits the form with no title or content, responds with a 400 error
  if (!request.body.title || !request.body.body) {
    response.status(400).send("Entries must have a title and a body.");
    return;
  }

  //Adds a new entry to the list of entries
  entries.push({
    title: request.body.title,
    content: request.body.body,
    published: new Date(),
  });
  response.redirect("/"); //Redirects to the homepage to see your new entry
});

//Renders a 404 page because you’re requesting an unknown source
app.use(function (request, response) {
  response.status(404).render("404");
});

//Starts the server on port 3000!
http.createServer(app).listen(3000, function () {
  console.log("Guestbook app started on port 3000.");
});
