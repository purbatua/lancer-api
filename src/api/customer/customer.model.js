import mongoose from 'mongoose';
import kebabCase from 'lodash/kebabCase';


const ObjectId = mongoose.Schema.Types.ObjectId;


const CustomerSchema = mongoose.Schema({
  company: {type: ObjectId, ref: 'Company'},
	name: {type: String, required: true},
  slug: {type: String, unique: true},
  email: {type: String, default: ''},
  phone1: {type: String, default: ''},
  phone2: {type: String, default: ''},
  description: String,
  location: {
    kind: String,
    street: String,
    province: String,
    city: String,
    district: String,
    village: String,
    zipcode: String,
    country: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
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
CustomerSchema.pre('save', function(next) {
	if(this.isNew) {
		if(!this.slug) this.slug = kebabCase(this.name);
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
CustomerSchema.statics.active = function() {
	return this.where({ 'deleted.at': {$exists: false} });
}

CustomerSchema.statics.byCompany = function(company) {
  console.log('THIS', this)
  return this.where({company: company})
	// return this.find({ company: this});
}

CustomerSchema.statics.activeByCompany = function(companyId) {
  return this.where({ 'deleted.at': {$exists: false} }).where({company: companyId})
}

// CustomerSchema.statics.inactive = function() {
// 	return this.find({
// 		$or: [
// 			{ published: false},
// 			{'deleted.at': {$exists: true}}
// 		]
// 	});
// }

// CustomerSchema.statics.removed = function() {
// 	return this.find({ 'deleted.at': {$exists: true} });
// }


// Methods
// CustomerSchema.methods.byCompany = function(cb) {
//   console.log('THIS', this)
//   return this.find({}, cb)
// }


CustomerSchema.set('toJSON', {virtuals: true});

export default mongoose.model('Customer', CustomerSchema);