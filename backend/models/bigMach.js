var mongoose = require('mongoose');
var Schema = mongoose.Schema;


mongoose.Promise = global.Promise;


var dataSchema = new Schema({
	x: [Number],
	total: Number,
	inf: Number,
	p: Number
});


module.exports = mongoose.model('Data', dataSchema);
