import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import uuid from 'uuid/v4'

// import config from '../../config'
import Role from '../role/role.model'

const ObjectId = mongoose.Schema.Types.ObjectId


const UserSchema = mongoose.Schema({
  // username: {type: String, unique: true, required: true},
  uuid: {type: String, unique: true, required: true},
	email: {type: String, unique: true, required: true},
	username: {type: String, unique: true, required: true},
	password: {type: String, required: true},
	salt: String,
  // fullname: {type: String, required: true},
  picture: {type: String, defualt: 'https://api.adorable.io/avatars/285/abott@adorable.png'},
  // company: {type: ObjectId, ref: 'Company', default: null},
	role: {type: ObjectId, ref: 'Role', default: null},
	// preference: {
	// 	language: {type: String, default: 'id-ID'}
	// },
  active: {type: Boolean, default: true},
  deleted: {
    at: {type: Date, default: Date.now},
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




// Plugin
// UserSchema.plugin(autopopulate)

// Middleware
UserSchema.pre('validate', function(next) {
  if(this.isNew) {
    this.uuid = uuid()
    next()
  }
  next()
})

UserSchema.pre('save', function(next) {
	let self = this
	if(this.isNew) {
    // if(!this.role) {
    //   Role.findOne({slug: 'user'})
    //   .then(function(role) {
    //     self.role = role._id
    //     next()
    //   })
    //   .catch(function(err) {
    //     next(err)
    //   })
    // }

		let saltRounds = 11
		bcrypt.genSalt(saltRounds, function(err, salt) {
      if(err) return next(err)

			self.salt = salt
			bcrypt.hash(self.password, salt, function(err, hash) {
				if(err) return next(err)
				self.password = hash
				next()
			})
		})
	} else {
		next()
	}
})

// UserSchema.post('save', function(doc, next) {
//   console.log('DOC USER POST SAVE MIDDLEWARE: ', doc)
//   doc.populate('company').execPopulate(function() {
//     next()
//   })
// })


// Virtuals
// UserSchema.virtual('fullname').get(function() {
// 	return (this.firstname || "") + ' ' + (this.lastname || "")
// })

// UserSchema.virtual('hashpassword')
// 	.set(function(password) {
// 		this._password = password
// 		this.salt = this.makeSalt()
// 		this.hashedPassword = this.encrypt(password)
// 	})
// 	.get(function() {
// 		return this._password
// 	})


// Methods
// UserSchema.methods= {
// 	authenticate: function(plainPassword) {
// 		return this.encrypt(plainPassword) === this.password
// 	},

// 	makeSalt: function() {
// 		return crypto.randomBytes(16).toString('base64')
// 	},

// 	encrypt: function(password) {
// 		if(!password || !this.salt) return ''
// 		var salt= new Buffer(this.salt, 'base64')

// 		return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64')
// 	}
// }


// Statics
UserSchema.statics = {
	authenticate: function(email, password, callback) {
    this.findOne({email: email, active: true})
      .populate({
        path: 'role',
        select: 'id name slug permissions',
        populate: {
          path: 'permissions',
          match: {active: true},
          select: 'id name slug'
        }
      })
      .populate({path: 'company'})
      .exec(function(err, user) {
        if(err) { return callback(err) }
        if(!user) { return callback(null, null) }

        bcrypt.compare(password, user.password, function(err, result) {
          if(result) { return callback(null, user) }
          return callback(null, null)
        })
      })
	},
	// authenticate2: function(password, callback) {
	// 	bcrypt.compare(this.password, password, function(err,result) {
	// 		if(err) { return callback(err) }

	// 		return callback(null, result)
	// 	})
	// }
}


UserSchema.set('toJSON', {virtuals: true})

export default mongoose.model('User', UserSchema)