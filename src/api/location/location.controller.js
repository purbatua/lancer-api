import { response } from '../../utils';
import config from '../../config';
import Location from './location.model';




// GET
exports.index = (req, res) => {
	let page  = req.query.page || 1,
			limit = req.query.limit || 10,
			skip	= (page - 1) * limit;

	let sort 	= req.query.sort || '-created';

	Location.active().find().skip(skip).limit(limit).sort(sort)
		.populate([
			{path: 'created.by'},
			{path: 'updated.by'}
		])
		.then(response.success(res))
		.catch(response.error(res));
};

exports.show = (req, res) => {
	Location.findById(req.params.id)
		.then(response.notFound(res))
		.then(response.success(res))
		.catch(response.error(res));
};


// POST
exports.create = (req, res) => {
	let body = req.body;

	Location.create(body)
		.then(response.success(res, 201))
		.catch(response.error(res));
};


// PUT AND PATCH
exports.update = (req, res) => {
	let body = req.body;

	Location.findById(req.params.id)
		.then(response.notFound(res))
		.then(response.update(body))
		.then(response.success(res))
		.catch(response.error(res));
};
