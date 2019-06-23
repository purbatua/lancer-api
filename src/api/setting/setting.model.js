import mongoose from 'mongoose';
import Hashids from 'hashids';
import _ from 'lodash';

import config from '../../config';


const ObjectId = mongoose.Schema.Types.ObjectId;


const SettingSchema = mongoose.Schema({
	// hashid: {type: String, unique: true},
	// name: {type: String, required: true},
	// slug: {type: String, unique: true},
  // description: {type: String},
  company: {type: ObjectId, ref: 'Company'},
  general: {

  },
  bussiness: {
    name: String
  },
  invoice: {
    note: String,
    agreement: String
  },
	active: {type: Boolean, default: true},
	deleted: {
		at: {type: Date},
		by: {type: ObjectId, ref: 'User'}
	},
	created: {
		at: {type: Date, default: Date.now},
		by: {type: ObjectId, ref: 'User'}
	},
	updated: {
		at: {type: Date, default: Date.now},
		by: {type: ObjectId, ref: 'User'}
	}
});



// Middleware
SettingSchema.pre('save', function(next) {
	if(this.isNew) {
		// let salt = 'setting';
		// let length = 5;

		// this.hashid = new Hashids(salt, length).encodeHex(this._id);
		// this.slug = _.kebabCase(this.name);
	}
	next();
});

// Virtuals

// Statics
/**********************
 * active 	: published == true AND deleted.at != exists
 * inactive	: published == false OR deleted.at == eixsts
 * removed 	: deleted.at == exists
 */
SettingSchema.statics.active = function() {
	return this.find({ 'deleted.at': {$exists: false} });
}

SettingSchema.statics.activeByCompany = function(company) {
  return this.where({'deleted.at': {$exists: false}}).where({company: company})
}

// SettingSchema.statics.inactive = function() {
// 	return this.find({
// 		$or: [
// 			{ published: false},
// 			{'deleted.at': {$exists: true}}
// 		]
// 	});
// }

// SettingSchema.statics.removed = function() {
// 	return this.find({ 'deleted.at': {$exists: true} });
// }


// Methods



SettingSchema.set('toJSON', {virtuals: true});

export default mongoose.model('Setting', SettingSchema);