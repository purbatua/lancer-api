import mongoose from 'mongoose'
import Hashids from 'hashids'
import _ from 'lodash'

const ObjectId = mongoose.Schema.Types.ObjectId

const VendorSchema = mongoose.Schema({
  company: {type: ObjectId, ref: 'Company'},
  hashid: {type: String, unique: true},
  name: {type: String, required: true},
  slug: {type: String, unique: true},
  email: {type: String},
  phone1: {type: String},
  phone2: {type: String},
  description: {type: String},
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
})

// Middleware
VendorSchema.pre('save', function (next) {
  if (this.isNew) {
    let salt = 'vendor'
    let length = 5

    this.hashid = new Hashids(salt, length).encodeHex(this._id)
    this.slug = _.kebabCase(this.name)
  }
  next()
})

// Virtuals

// Statics
/**********************
 * active 	: published == true AND deleted.at != exists
 * inactive	: published == false OR deleted.at == eixsts
 * removed 	: deleted.at == exists
 */
VendorSchema.statics.active = function () {
  return this.find({ 'deleted.at': {$exists: false} })
}

// VendorSchema.statics.inactive = function() {
// 	return this.find({
// 		$or: [
// 			{ published: false},
// 			{'deleted.at': {$exists: true}}
// 		]
// 	});
// }

// VendorSchema.statics.removed = function() {
// 	return this.find({ 'deleted.at': {$exists: true} });
// }

// Methods

VendorSchema.set('toJSON', {virtuals: true})

export default mongoose.model('Vendor', VendorSchema)
