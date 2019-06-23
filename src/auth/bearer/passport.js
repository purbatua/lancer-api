import passport from 'passport';
import bearer from 'passport-http-bearer';
import jwt from 'jsonwebtoken';

import config from '../../config';


const BearerStrategy = bearer.Strategy;





exports.setup = function() {
	passport.use(new BearerStrategy(
		function(token, done) {
			// console.log('Token: ', token);
			jwt.verify(token, config.token.secret, function(err, decoded) {
				if(err) { return done(err); }
				return done(null, decoded);
			});
			// User.findOne({toke: token}, function(err, user) {
			// 	if(err) { return done(err); }
			// 	if(!user) { return done(null, false); }
			// 	return done(null, user, { scope: 'read' });
			// });
		}
	));
};