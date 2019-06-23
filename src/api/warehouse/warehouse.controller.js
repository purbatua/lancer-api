import { response } from '../../utils';
import config from '../../config';
import Warehouse from './warehouse.model';




// GET
exports.index = (req, res) => {
	let page  = req.query.page || 1,
			limit = req.query.limit || 10,
			skip	= (page - 1) * limit;

	let sort 	= req.query.sort || '-created';

	Warehouse.active().find().skip(skip).limit(limit).sort(sort)
		.populate([
			{path: 'created.by'},
			{path: 'updated.by'}
		])
		.then(response.success(res))
		.catch(response.error(res));
};

exports.show = (req, res) => {
	Warehouse.findById(req.params.id)
		.then(response.notFound(res))
		.then(response.success(res))
		.catch(response.error(res));
};


// POST
exports.create = (req, res) => {
	let body = req.body;

	Warehouse.create(body)
		.then(response.success(res, 201))
		.catch(response.error(res));
};


// PUT AND PATCH
exports.update = (req, res) => {
	let body = req.body;

	Warehouse.findById(req.params.id)
		.then(response.notFound(res))
		.then(response.update(body))
		.then(response.success(res))
		.catch(response.error(res));
};
