import { response } from '../../utils';
import config from '../../config';
import Permission from './permission.model';




// GET
exports.index = (req, res) => {
	let page  = req.query.page || 1,
			limit = req.query.limit || 10,
			skip	= (page - 1) * limit;

	let sort 	= req.query.sort || '-created';

	Permission.active().find().skip(skip).limit(limit).sort(sort)
		.populate([
			{path: 'created.by'},
			{path: 'updated.by'}
		])
		.then(response.success(res))
		.then(null, response.error(res));
};

exports.show = (req, res) => {
	Permission.findById(req.params.id)
		.then(response.notFound(res))
		.then(response.success(res))
		.then(null, response.error(res));
};


// POST
exports.create = (req, res) => {
	let body = req.body;

	Permission.create(body)
		.then(response.success(res, 201))
		.then(null, response.error(res));
};


// PUT AND PATCH
exports.update = (req, res) => {
	let body = req.body;

	Permission.findById(req.params.id)
		.then(response.notFound(res))
		.then(response.update(body))
		.then(response.success(res))
		.then(null, response.error(res));
};
