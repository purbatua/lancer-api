import mongoose from 'mongoose'
import _ from 'lodash'
import uuid from 'uuid/v4'


const ObjectId = mongoose.Schema.Types.ObjectId


const PurchaseOrderSchema = mongoose.Schema({
  uuid: {type: String, unique: true},
  company: {type: ObjectId, ref: 'Company'},
  customer: {type: ObjectId, ref: 'Customer'},
  sales: {type: ObjectId, ref: 'User'},
  soNumber: String,
  inNumber: String,
  poNumber: String,
  creationDate: {type: Date, default: Date.now},
	dueDate: Date,
	products: [
		{
			product: {type: ObjectId, ref: 'Product'},
			quantity: Number,
			price: Number,
			discount: Number,
			tax: Number,
			amount: Number,
		}
	],
	subtotal: Number,
	discount: Number,
	tax: Number,
	total: Number,
	note: String,
  agreement: String,
  status: {type: String, enum: ['draft', 'sent', 'paid', 'paid-partial', 'cancel'], default: 'sent'},
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
PurchaseOrderSchema.pre('save', function(next) {
	if(this.isNew) {
		this.uuid = uuid()
		this.slug = _.kebabCase(this.name)
	}
	next()
})

// Virtuals
PurchaseOrderSchema.virtual('totalItem').get(function() {
	return this.products.length
});

// Statics
/**********************
 * active 	: published == true AND deleted.at != exists
 * inactive	: published == false OR deleted.at == eixsts
 * removed 	: deleted.at == exists
 */
PurchaseOrderSchema.statics.active = function() {
	return this.find({ 'deleted.at': {$exists: false} })
}

PurchaseOrderSchema.statics.activeByCompany = function(companyId) {
  return this.where({'deleted.at': {$exists: false}}).where({company: companyId})
}

// PurchaseOrderSchema.statics.inactive = function() {
// 	return this.find({
// 		$or: [
// 			{ published: false},
// 			{'deleted.at': {$exists: true}}
// 		]
// 	})
// }

// PurchaseOrderSchema.statics.removed = function() {
// 	return this.find({ 'deleted.at': {$exists: true} })
// }


// Methods



PurchaseOrderSchema.set('toJSON', {virtuals: true})

export default mongoose.model('PurchaseOrder', PurchaseOrderSchema)