import { response } from '../../utils';
import config from '../../config';
import Role from './role.model';




// GET
exports.index = (req, res) => {
	let page  = req.query.page || 1,
			limit = req.query.limit || 10,
			skip	= (page - 1) * limit;

	let sort 	= req.query.sort || '-created';


	Role.find().skip(skip).limit(limit).sort(sort)
		.populate([
			{path: 'permissions'},
			{path: 'created.by'},
			{path: 'updated.by'}
		])
		.then(response.success(res))
		.then(null, response.error(res));
};

exports.show = (req, res) => {
	Role.findById(req.params.id)
		.then(response.notFound(res))
		.then(response.success(res))
		.then(null, response.error(res));
};



// POST
exports.create = (req, res) => {
	let body = req.body;

	console.log('Request: ', req.params);

	console.log('Role body: ', body);

	Role.create(body)
		.then(response.success(res, 201))
		.then(null, response.error(res));
};


// PUT AND PATCH
exports.update = (req, res) => {
	let body = req.body;

	Role.findByIdAndUpdate(req.params.id, { $set: body}, { new: true })
	.then(response.notFound(res))
	.then(response.success(res))
	.catch(response.error(res));

	// Role.findById(req.params.id)
	// 	.then(response.notFound(res))
	// 	.then(response.update(body))
	// 	.then(response.success(res))
	// 	.then(null, response.error(res));
};
