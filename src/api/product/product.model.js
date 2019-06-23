import mongoose from 'mongoose'
import kebabCase from 'lodash/kebabCase'
import uuid from 'uuid/v4'


const ObjectId = mongoose.Schema.Types.ObjectId

const ProductSchema = mongoose.Schema({
  uuid: {type: String, unique: true, required: true},
  company: {type: ObjectId, ref: 'Company'},
  name: {type: String, required: true},
  slug: {type: String, unique: true},
  aliases: [
    {type: String}
  ],
  sku: {type: String},
  stock: {type: Number, default: 0},
  unit: {type: ObjectId, ref: 'Unit'},
  weight: {type: Number},
  volume: {type: Number},
  dimension: {
    length: Number,
    breadth: Number,
    height: Number
  },
  price: {
    sell: {type: Number, required: true},
    cost: Number,
    currency: String
  },
  tax: {
    rate: Number,
    cost: Number
  },
  description: {type: String},
  category: {type: ObjectId, ref: 'Category'},
  vendor: {type: ObjectId, ref: 'Vendor'},
  image: {
    small: String,
    medium: String,
    large: String
  },
  date: {
    expiry: Date,
    purchase: Date,
    onhand: Date
  },
  location: {type: ObjectId, ref: 'Location'},
  customFields: {},
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
ProductSchema.pre('validate', function(next) {
  if(this.isNew) {
    this.uuid = uuid()
    next()
  } else {
    next()
  }
})

ProductSchema.pre('save', function (next) {
  if (this.isNew) {
    if(!this.slug) this.slug = kebabCase(this.name)
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
ProductSchema.statics.active = function () {
  return this.find({ 'deleted.at': {$exists: false} })
}

ProductSchema.statics.activeByCompany = function(company) {
  return this.where({'deleted.at': {$exists: false}}).where({company: company})
}

// ProductSchema.statics.inactive = function() {
// 	return this.find({
// 		$or: [
// 			{ published: false},
// 			{'deleted.at': {$exists: true}}
// 		]
// 	});
// }

// ProductSchema.statics.removed = function() {
// 	return this.find({ 'deleted.at': {$exists: true} });
// }

// Methods

ProductSchema.set('toJSON', {virtuals: true})

export default mongoose.model('Product', ProductSchema)
