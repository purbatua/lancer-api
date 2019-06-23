import mongoose from 'mongoose';
import Hashids from 'hashids';
import _ from 'lodash';

import config from '../../config';


const ObjectId = mongoose.Schema.Types.ObjectId;


const PermissionSchema = mongoose.Schema({
	hashid: {type: String, unique: true},
	name: {type: String, required: true},
	slug: {type: String, unique: true},
	resource: {type: String, required: true},
	access: {type: String, required: true},
	description: {type: String},
	active: {type: Boolean, default: true},
	deleted: {
		by: {type: ObjectId, ref: 'User'},
		at: {type: Date}
	},
	created: {
		by: {type: ObjectId, ref: 'User'},
		at: {type: Date, default: Date.now}
	},
	updated: {
		by: {type: ObjectId, ref: 'User'},
		at: {type: Date, default: Date.now}
	}
});



// Middleware
PermissionSchema.pre('save', function(next) {
	if(this.isNew) {
		let salt = 'role';
		let length = 5;

		this.hashid = new Hashids(salt, length).encodeHex(this._id);
		this.slug = _.kebabCase(this.name);
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
PermissionSchema.statics.active = function() {
	return this.find({ 'deleted.at': {$exists: false} });
}

// PermissionSchema.statics.inactive = function() {
// 	return this.find({
// 		$or: [
// 			{ published: false},
// 			{'deleted.at': {$exists: true}}
// 		]
// 	});
// }

// PermissionSchema.statics.removed = function() {
// 	return this.find({ 'deleted.at': {$exists: true} });
// }


// Methods



PermissionSchema.set('toJSON', {virtuals: true});

export default mongoose.model('Permission', PermissionSchema);