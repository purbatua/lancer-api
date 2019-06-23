import { response } from '../../utils';
import config from '../../config';
import Setting from './setting.model';




// GET
export function index(req, res) {
	let page  = req.query.page || 1,
			limit = req.query.limit || 10,
			skip	= (page - 1) * limit;

	let sort 	= req.query.sort || '-created';

	Setting.active().find().skip(skip).limit(limit).sort(sort)
		.populate([
			{path: 'created.by'},
			{path: 'updated.by'}
		])
		.then(response.success(res))
		.catch(response.error(res));
}

export function show(req, res) {
  
	Setting.findById(req.params.id)
		.then(response.notFound(res))
		.then(response.success(res))
		.catch(response.error(res));
}

export function showByCompany(req, res) {
  console.log(req.params.id)
  
	Setting.findOne({company: req.params.id})
		.then(response.notFound(res))
		.then(response.success(res))
		.catch(response.error(res));
}



// POST
export function create(req, res) {
	let body = req.body;

	Setting.create(body)
		.then(response.success(res, 201))
		.catch(response.error(res));
}


// PATCH
export function update(req, res) {
	let body = req.body;

	Setting.findById(req.params.id)
		.then(response.notFound(res))
		.then(response.update(body))
		.then(response.success(res))
		.catch(response.error(res));
}

export function updateInvoice(req, res) {
	let body = req.body;

	Setting.findById(req.params.id)
		.then(response.notFound(res))
		.then(response.update(body))
		.then(response.success(res))
		.catch(response.error(res));
}
