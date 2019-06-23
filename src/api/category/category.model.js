import mongoose from 'mongoose'
import kebabCase from 'lodash/kebabCase'

const ObjectId = mongoose.Schema.Types.ObjectId

const CategorySchema = mongoose.Schema({
  company: {type: ObjectId, ref: 'Company'},
  name: {type: String, required: true},
  slug: {type: String, unique: true},
  description: {type: String},
  parent: {type: ObjectId, ref: 'Category'},
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
CategorySchema.pre('save', function (next) {
  if (this.isNew) {
    this.slug = kebabCase(this.name)
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
CategorySchema.statics.active = function () {
  return this.find({ 'deleted.at': {$exists: false} })
}

// CategorySchema.statics.inactive = function() {
// 	return this.find({
// 		$or: [
// 			{ published: false},
// 			{'deleted.at': {$exists: true}}
// 		]
// 	});
// }

// CategorySchema.statics.removed = function() {
// 	return this.find({ 'deleted.at': {$exists: true} });
// }

// Methods

CategorySchema.set('toJSON', {virtuals: true})

export default mongoose.model('Category', CategorySchema)
