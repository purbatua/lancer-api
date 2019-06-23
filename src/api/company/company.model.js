import mongoose from 'mongoose'
import kebabCase from 'lodash/kebabCase'
import uuid from 'uuid/v4'

import Setting from '../setting/setting.model'

const ObjectId = mongoose.Schema.Types.ObjectId

const CompanySchema = mongoose.Schema({
  uuid: {type: String, unique: true, required: true},
  name: {type: String, required: true},
  slug: {type: String, unique: true},
  phone: String,
  email: String,
  location: {
    type: String,
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
  description: String,
  setting: {type: ObjectId, ref: 'Setting'},
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
})

// Middleware
CompanySchema.pre('validate', function(next) {
  if(this.isNew) {
    this.uuid = uuid()
    next()
  } else {
    next()
  }
})

CompanySchema.pre('save', function (next) {
  if (this.isNew) {
    const settingBody = {
      company: this._id,
      bussiness: {
        name: this.name
      }
    }

    const self = this
    Setting.create(settingBody)
      .then(function(setting) {
        self.slug = kebabCase(self.name)
        self.setting = setting._id
        next()
      })
      .catch(function(err) {
        next(err)
      })
  } else {
    done()
  }
})

// CompanySchema.post('save', function(doc, next) {
//   next()
// })

// Virtuals

// Statics
/**********************
 * active 	: published == true AND deleted.at != exists
 * inactive	: published == false OR deleted.at == eixsts
 * removed 	: deleted.at == exists
 */
CompanySchema.statics.active = function () {
  return this.find({ 'deleted.at': {$exists: false} })
}

// CompanySchema.statics.inactive = function() {
// 	return this.find({
// 		$or: [
// 			{ published: false},
// 			{'deleted.at': {$exists: true}}
// 		]
// 	});
// }

// CompanySchema.statics.removed = function() {
// 	return this.find({ 'deleted.at': {$exists: true} });
// }

// Methods

CompanySchema.set('toJSON', {virtuals: true})

export default mongoose.model('Company', CompanySchema)
