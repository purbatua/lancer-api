import mongoose from 'mongoose';
import _ from 'lodash';



const ObjectId = mongoose.Schema.Types.ObjectId;


const CurrencySchema = mongoose.Schema({
  country: String,
	name: {type: String},
	ISOcode: String,
	active: {type: Boolean, default: true},
	// deleted: {
	// 	at: {type: Date},
	// 	by: {type: ObjectId, ref: 'User'}
	// },
	// created: {
	// 	at: {type: Date, default: Date.now},
	// 	by: {type: ObjectId, ref: 'User'}
	// },
	// updated: {
	// 	at: {type: Date, default: Date.now},
	// 	by: {type: ObjectId, ref: 'User'}
	// }
});



// Middleware
CurrencySchema.pre('save', function(next) {
	if(this.isNew) {
    // @remove
	}
	next();
});

// Virtuals
CurrencySchema.virtual('_displayName').get(function() {
  return this.ISOcode + ' - ' + this.country
})

// Statics
/**********************
 * active 	: published == true AND deleted.at != exists
 * inactive	: published == false OR deleted.at == eixsts
 * removed 	: deleted.at == exists
 */
CurrencySchema.statics.active = function() {
	return this.find({active: true});
}

// CurrencySchema.statics.inactive = function() {
// 	return this.find({
// 		$or: [
// 			{ published: false},
// 			{'deleted.at': {$exists: true}}
// 		]
// 	});
// }

// CurrencySchema.statics.removed = function() {
// 	return this.find({ 'deleted.at': {$exists: true} });
// }


// Methods



CurrencySchema.set('toJSON', {virtuals: true});

export default mongoose.model('Currency', CurrencySchema);