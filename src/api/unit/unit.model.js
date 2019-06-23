import mongoose from 'mongoose'
import Hashids from 'hashids'
import _ from 'lodash'

const ObjectId = mongoose.Schema.Types.ObjectId

const UnitSchema = mongoose.Schema({
  company: {type: ObjectId, ref: 'Company'},
  name: {type: String, required: true},
  slug: {type: String, unique: true},
  aliases: [{type: String}],
  description: {type: String},
  translation: {
    id: String,
    en: String
  },
  min: {type: Number, required: true, default: 0},
  step: {type: Number, required: true, default: 1},
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
UnitSchema.pre('save', function (next) {
  if (this.isNew) {
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
UnitSchema.statics.active = function () {
  return this.find({ 'deleted.at': {$exists: false} })
}

// UnitSchema.statics.inactive = function() {
// 	return this.find({
// 		$or: [
// 			{ published: false},
// 			{'deleted.at': {$exists: true}}
// 		]
// 	});
// }

// UnitSchema.statics.removed = function() {
// 	return this.find({ 'deleted.at': {$exists: true} });
// }

// Methods

UnitSchema.set('toJSON', {virtuals: true})

export default mongoose.model('Unit', UnitSchema)
