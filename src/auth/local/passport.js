import passport from 'passport';
import passportLocal from 'passport-local';
import bcrypt from 'bcrypt';

import User from '../../api/user/user.model';


const LocalStrategy = passportLocal.Strategy;


exports.setup = function() {
	passport.use(new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password'
	}, function(email, password, done) {
		User.findOne({email: email.toLowerCase()})
			.populate(
				{
					path: 'role',
					select: 'name slug', 
					populate: {
						path: 'permissions',
						select: 'slug'
					}
				}
			)
			.exec(function(err, user) {
				if(err) { return done(err); }
				if(!user) { return done(null, false, {message: 'This email is not registered'}) }

					// console.log('User: ', user);


				bcrypt.compare(user.password, password, function(err, result) {
					if(err) { return done(null, false, {message: 'This password not correct'}); }
					return done(null, user);
				});


				// user.authenticate2(password, function(err, success) {
				// 	if(err) { return done(null, false, {message: 'This password not correct'}); }
				// 	return done(null, user);
				// })

				// if(!user.authenticate(password)) {
				// 	return done(null, false, {message: 'This password not correct'})
				// }

				// return done(null, user);
			});
	}));
}