"use strict";

var http = require("http");
var express = require("express");
var mongoose = require("mongoose");
var passport = require("passport");
var session = require("express-session");
var routes = require("./app/routes/index.js");

var app = express();
var server = http.createServer(app);

require("dotenv").load();
require("./app/config/passport")(passport);

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI);

app.use("/client", express.static(process.cwd() + "/client"));

app.use(session({
	secret: 'secretClementine',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});
