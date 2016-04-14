"use strict";

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
            failureRedirect: '/login'
        }));

    app.route("/*")
        .get(function(req, res) {
            res.redirect("/");
        });
}
