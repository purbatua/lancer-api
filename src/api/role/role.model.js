import mongoose from 'mongoose';
import Hashids from 'hashids';
import kebabCase from 'lodash/kebabCase';


const ObjectId = mongoose.Schema.Types.ObjectId;


const RoleSchema = mongoose.Schema({
	hashid: {type: String, unique: true},
	name: {type: String, required: true},
	slug: {type: String, unique: true},
	description: {type: String},
	permissions: [
		{type: ObjectId, ref: 'Permission'}
	],
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
RoleSchema.pre('save', function(next) {
	if(this.isNew) {
		let salt = 'role';
		let length = 5;

		this.hashid = new Hashids(salt, length).encodeHex(this._id);
		this.slug = kebabCase(this.name);
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
RoleSchema.statics.active = function() {
	return this.find({ published: true, 'deleted.at': {$exists: false} });
}

RoleSchema.statics.inactive = function() {
	return this.find({
		$or: [
			{ published: false},
			{'deleted.at': {$exists: true}}
		]
	});
}

RoleSchema.statics.removed = function() {
	return this.find({ 'deleted.at': {$exists: true} });
}


// Methods



RoleSchema.set('toJSON', {virtuals: true});

export default mongoose.model('Role', RoleSchema);