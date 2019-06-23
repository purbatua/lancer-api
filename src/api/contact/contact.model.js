import mongoose from 'mongoose';
import kebabCase from 'lodash/kebabCase';


const ObjectId = mongoose.Schema.Types.ObjectId;


const ContactSchema = mongoose.Schema({
  company: {type: ObjectId, ref: 'Company'},
  type: {type: String, enum: ['customer', 'vendor']},
  name: {type: String, required: true},
  email: String,
  phone1: String,
  phone2: String,
  description: String,
  billingAddress: {
    kind: String,
    street: String,
    province: String,
    city: String,
    district: String,
    village: String,
    zipcode: String,
    country: String,
    coordinates: {
      latitude: String,
      longitude: String
    }
  },
  shippingAddress: {
    kind: String,
    street: String,
    province: String,
    city: String,
    district: String,
    village: String,
    zipcode: String,
    country: String,
    coordinates: {
      latitude: String,
      longitude: String
    }
  },
  payment: {
    currency: {type: ObjectId, ref: 'Currency'},
    terms: String
  },
  note: String,
	active: {type: Boolean, default: true},
	deleted: {
		at: Date,
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
ContactSchema.pre('save', function(next) {
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
ContactSchema.statics.active = function() {
	return this.where({ 'deleted.at': {$exists: false} });
}

ContactSchema.statics.byCompany = function(company) {
  console.log('THIS', this)
  return this.where({company: company})
	// return this.find({ company: this});
}

ContactSchema.statics.activeByCompany = function(companyId) {
  return this.where({ 'deleted.at': {$exists: false} }).where({company: companyId})
}

// ContactSchema.statics.inactive = function() {
// 	return this.find({
// 		$or: [
// 			{ published: false},
// 			{'deleted.at': {$exists: true}}
// 		]
// 	});
// }

// ContactSchema.statics.removed = function() {
// 	return this.find({ 'deleted.at': {$exists: true} });
// }


// Methods
// ContactSchema.methods.byCompany = function(cb) {
//   console.log('THIS', this)
//   return this.find({}, cb)
// }


ContactSchema.set('toJSON', {virtuals: true});

export default mongoose.model('Contact', ContactSchema);