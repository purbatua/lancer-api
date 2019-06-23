import mongoose from 'mongoose'
import Hashids from 'hashids'
import _ from 'lodash'

const ObjectId = mongoose.Schema.Types.ObjectId

const LocationSchema = mongoose.Schema({
  hashid: {type: String, unique: true},
  name: {type: String, required: true},
  slug: {type: String, unique: true},
  description: {type: String},
  warehouse: {type: ObjectId, ref: 'Warehouse'},
  rack: {type: String},
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
LocationSchema.pre('save', function (next) {
  if (this.isNew) {
    let salt = 'location'
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
LocationSchema.statics.active = function () {
  return this.find({ 'deleted.at': {$exists: false} })
}

// LocationSchema.statics.inactive = function() {
// 	return this.find({
// 		$or: [
// 			{ published: false},
// 			{'deleted.at': {$exists: true}}
// 		]
// 	});
// }

// LocationSchema.statics.removed = function() {
// 	return this.find({ 'deleted.at': {$exists: true} });
// }

// Methods

LocationSchema.set('toJSON', {virtuals: true})

export default mongoose.model('Location', LocationSchema)
