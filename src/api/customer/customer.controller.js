import { response } from '../../utils'
import config from '../../config'
import Customer from './customer.model'




// GET
export function index(req, res) {
	let page  = req.query.page || 1,
			limit = req.query.limit || 10,
			skip	= (page - 1) * limit

	let sort 	= req.query.sort || '-created'

	Customer.active().find({company: req.user.company._id}).skip(skip).limit(limit).sort(sort)
		.populate([
			{path: 'created.by'},
			{path: 'updated.by'}
		])
		.then(response.success(res))
		.catch(response.error(res))
}

export function byCompany(req, res) {
	let page  = req.query.page || 1,
			limit = req.query.limit || 10,
			skip	= (page - 1) * limit

  let sort 	= req.query.sort || '-created'
  
  console.log('req.user: ', req.user)

	Customer.active().find({company: req.user.company._id}).skip(skip).limit(limit).sort(sort)
		.populate([
			{path: 'created.by'},
			{path: 'updated.by'}
		])
		.then(response.success(res))
		.catch(response.error(res))
}

export function search(req, res) {
	let page  = req.query.page || 1,
			limit = req.query.limit || 10,
			skip	= (page - 1) * limit

  let sort 	= req.query.sort || '-created'

	Customer.activeByCompany(req.user.company._id).find({name: {$regex: req.query.term, $options: 'i'}}).skip(skip).limit(limit).sort(sort)
		.populate([
			{path: 'created.by'},
			{path: 'updated.by'}
		])
		.then(response.success(res))
		.catch(response.error(res))
}

export function show(req, res) {
	Customer.findById(req.params.id)
		.then(response.notFound(res))
		.then(response.success(res))
		.catch(response.error(res))
}


// POST
export function create(req, res) {
  let body = req.body
  body.company = req.user.company

	Customer.create(body)
		.then(response.success(res, 201))
		.catch(response.error(res))
}


// PUT AND PATCH
export function update(req, res) {
	let body = req.body

	Customer.findById(req.params.id)
		.then(response.notFound(res))
		.then(response.update(body))
		.then(response.success(res))
		.catch(response.error(res))
}
