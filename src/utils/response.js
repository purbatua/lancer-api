import merge from 'lodash/merge'
import isArray from 'lodash/isArray'



export default {
	error: (res, statusCode) => {
		statusCode = statusCode || 500;
		return (err) => {
			res.status(statusCode).json(err);
		};
	},

	success: (res, statusCode) => {
		statusCode = statusCode || 200;

		return (entity) => {
			if(entity) {
				res.status(statusCode).json(entity);
			}
		};
	},

	notFound: (res) => {
		return (entity) => {
			if(!entity) {
				res.send(404);
				return null;
			}
			return entity;
		};
	},

	update: (body) => {
		return (entity) => {

			let updatedBody = merge(entity, body);

			for(let key in body) {
				if(isArray(body[key])) {
					updatedBody[key] = body[key];
					updatedBody.markModified(key);
				} else {
					updatedBody.set({key: body[key]});
				}
			}

			return updatedBody.save()
				.then((updatedData) => {
					return updatedData;
				});
		}
	},

	remove: (res) => {
		return (entity) => {
			if(entity) {
				return entity.remove()
					.then(() => {
						res.send(204);
					});
			}
		}
	}

};