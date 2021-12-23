/** @format */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const unitCollection = new Schema({
	unitID: {
		type: String,
	},
	unitName: {
		type: String,
	},
	unitHistory: {
		type: Array,
	},
});

module.exports = mongoose.model('unitCollection', unitCollection);
