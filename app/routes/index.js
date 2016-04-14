"use strict";

var path = process.cwd();
var requestHandler = require("../common/requestHandler.js");

module.exports = function(app, passport) {
	app.route("/")
		.get(function (req, res) {
				res.sendFile(path + '/client/index.html');
		});

	app.route('/login')
		.get(function (req, res) {
				res.sendFile(path + '/client/index.html');
		});

	app.route('/logout')
    .get(function (req, res) {
        req.logout();
        res.redirect('/');
    });

	app.route("/mypolls")
		.get(function(req, res) {
			res.sendFile(path + '/client/index.html');
		});

	app.route('/newpoll')
		.post(requestHandler.newPoll)
		.get(function (req, res) {
				res.sendFile(path + '/client/index.html');
		});

	app.route('/profile')
		.get(function (req, res) {
				res.sendFile(path + '/client/index.html');
		});

	app.route("/poll")
		.get(function(req, res) {
			res.sendFile(path + "/client/index.html");
		});

	app.route("/poll/:id")
		.get(function(req, res) {
			res.sendFile(path + "/client/index.html");
		});

	app.route('/api/poll/:id')
		.get(requestHandler.getPoll)
		.post(requestHandler.addVoteToPoll)
		.delete(requestHandler.deletePoll);

	app.route('/api/user/:user')
		.get(function (req, res) {
				if (req.user) {
						res.json(req.user);
				}
				else {
						// Create temp identity based on IP address that can be used to vote and check poll results.
						var user = {};
						user.github = {};
						user.github.username = ""; // Use this to check if this is no logged in user.
						user.github.id = req.headers['x-forwarded-for'] || req.connection.remoteAddress ||
						                          req.socket.remoteAddress || req.connection.socket.remoteAddress;
						res.json(user);
				}
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

  app.route('/auth/github/callback')
    .get(passport.authenticate('github', {
      successRedirect: '/',
      failureRedirect: '/login'
    }));

	app.route("/*")
		.get(function (req, res) {
				res.redirect("/");
		});
}
