'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Nightlife_User = new Schema({
	github: {
		id: String,
		displayName: String,
		username: String
	}
});

module.exports = mongoose.model('Nightlife_User', Nightlife_User);
