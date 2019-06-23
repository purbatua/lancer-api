import passport from 'passport';

import User from '../api/user/user.model';




/* Is authenticated */
export function isAuthenticated() {
	return passport.authenticate('bearer', {session: false})
};

/* Has role */
export function hasRole(role) {

	return function(req, res, next) {
		passport.authenticate('bearer', {session: false}, (err, user, info) => {

			if(err) { return res.status(500).json(err); }
			if(!user) { return res.status(401).json({message: 'Unauthorized: The user does not have the necessary credentials'}) }

			User.findById(user._id)
				.populate(
					{
						path: 'role',
						select: 'name slug', 
						populate: {
              path: 'permissions',
              match: {active: true},
							select: 'name slug'
						}
					}
				).exec()
				.then((userData) => {
          if(userData.role.slug === 'super-admin') {
            /* special power */
            req.user = userData
            next();
            return;
          }

					if(userData.role.slug === role) {
						return res.status(403).json({message: 'Forbidden: The user not have the necessary role for a resource'})
					}

					req.user = userData;
					next();
				})
				.catch(err => {
					return res.status(500).json({message: 'Internal server error'});
				})
		})(req, res, next);
	}
}

/* Has permission */
export function hasPermission(permission) {

	return function(req, res, next) {
		passport.authenticate('bearer', {session: false}, (err, user, info) => {

			if(err) { return res.status(500).json(err); }
			if(!user) { return res.status(401).json({message: 'Unauthorized: The user does not have the necessary credentials'}) }

			User.findById(user._id)
				.populate(
					{
						path: 'role',
						select: 'name slug', 
						populate: {
              path: 'permissions',
              match: {active: true},
							select: 'name slug'
						}
					}
				).exec()
				.then((userData) => {
          if(userData.role.slug === 'super-admin') {
            /* special power */
            req.user = userData
            next();
            return;
          }

					const permissionFound = userData.role.permissions.find(p => p.slug === permission);

					if(!permissionFound || Object.keys(permissionFound).length === 0) {
						return res.status(403).json({message: 'Forbidden: The user not have the necessary permission for a resource'})
					}

					req.user = userData;
					next();
				})
				.catch(err => {
					return res.status(500).json({message: 'Internal server error'});
				})
		})(req, res, next);
	}
}