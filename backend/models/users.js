var mongoose = require('mongoose');
var Schema = mongoose.Schema;


mongoose.Promise = global.Promise;


var userSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	wallet: {
		type: Number,
		default: 10
	},
	investment: {
		type: Number,
		default: 0
	},
	bih: {
		type: Number,
		default: 0
	},
	profit: {
		type: Number,
		default: 0
	},
	amount: {
		type: Number,
		default: 0
	},
	flag: {
		type: Boolean,
		default: false
	},
	logs: [{
		inv_with: Boolean,
		date: {
			type: Date,
			default: Date.now
		},
		btc: Number,
		inr: Number
	}],
	authKey: String
});


module.exports = mongoose.model('User', userSchema);
