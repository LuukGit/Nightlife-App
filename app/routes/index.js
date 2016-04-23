"use strict";

var Bar = require("../models/bar.js")
var Yelp = require("yelp");
require("dotenv").config();

var yelp = new Yelp({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    token: process.env.TOKEN,
    token_secret: process.env.TOKEN_SECRET
});

var path = process.cwd();

module.exports = function(app, passport) {
    app.route("/")
        .get(function(req, res) {
            res.sendFile(path + '/client/index.html');
        });

    app.route('/auth/github')
        .get(passport.authenticate('github'));

    app.route('/auth/github/callback')
        .get(passport.authenticate('github', {
            successRedirect: '/',
            failureRedirect: '/'
        }));

    app.route("/api/:location")
        .post(function(req, res) {
            var location = req.params.location;
            yelp.search({ term: "bars", location: location })
                .then(function(data) {
                    res.json(data);
                })
                .catch(function(err) {
                    console.error(err);
                });
        });

    app.route('/api/user/:user')
        .get(function (req, res) {
            if (req.user) {
                    res.json(req.user);
            }
        });

    app.route("/database/:name")
        .get(function(req, res) {
            Bar.findOne({name: req.params.name}, function(err, data) {
                if (err) { throw err; }
                if (data) {
                    console.log(data);
                    res.json(data.going.length);
                }
                else {
                    res.send("not found");
                }
            })
        });

    app.route("/database")
        .post(function(req, res) {
            var barName = req.body.bar.name;
            var userID = req.body.user.github.id;

            console.log(barName);
            console.log(userID);

            // Check if bar is already in the database.
            // If not add bar.
            // Else if user is already added to bar, remove user.
            // Else add user.
            Bar.findOne({name: barName}, function(err, bar) {
                if (err) { throw err; }
                if (bar) {
                    if (bar.going.indexOf(userID) < 0) {
                        // Add user
                        bar.going.push(userID);
                    }
                    else {
                        // Remove user
                        bar.going.splice(bar.going.indexOf(userID));
                    }
                    var conditions = {name: barName}
                      , update = { $set: {going: bar.going} }
                      , options = { multi: false };

                    Bar.update(conditions, update, options, function(err) {
                      if (err) { throw err; }
                      console.log("Bar succesfully updated!");
                      if (bar.going.length > 0) {
                          res.json(bar.going.length);
                      }
                      else {
                         // Remove bar entry
                         Bar.remove({name: barName}, function(err) {
                             if (err) { throw err; }
                             console.log("Going length: " + bar.going.length);
                             console.log("Bar succesfully removed");
                             res.json(0);
                         })
                      }
                    });
                }
                else {
                    var newBar = new Bar();
                    newBar.name = barName;
                    newBar.going.push(userID);
                    newBar.save(function(err) {
                        if (err) { throw err; }
                        console.log("Saved bar " + newBar.name + " to database");
                        res.json(1);
                    });
                }
            })
        });
}
