import { response, log } from '../../utils'
import config from '../../config'
import Product from './product.model'

// GET
export function index(req, res) {
  let page = req.query.page || 1
  let limit = req.query.limit || 10
  let skip = (page - 1) * limit

  let sort = req.query.sort || '-created'

  Product.active().find({company: req.user.company._id}).skip(skip).limit(limit).sort(sort)
    .populate([
      {path: 'created.by'},
      {path: 'updated.by'}
    ])
    .then(response.success(res))
    .catch(response.error(res))
}

export function search(req, res) {
  let page = req.query.page || 1
  let limit = req.query.limit || 10
  let skip = (page - 1) * limit

  let sort = req.query.sort || '-created'

  Product.activeByCompany(req.user.company._id).find({name: {$regex: req.query.term, $options: 'i'}}).skip(skip).limit(limit).sort(sort)
    .populate([
      {path: 'created.by'},
      {path: 'updated.by'}
    ])
    .then(response.success(res))
    .catch(response.error(res))
}

export function show(req, res) {
  Product.findById(req.params.id)
    .then(response.notFound(res))
    .then(response.success(res))
    .catch(response.error(res))
}

// POST
export function create(req, res) {
  let body = req.body
  body.company = req.user.company

  Product.create(body)
    .then(products => {
      log.beauty('PRODUCTS cretae', products)
      return products
    })
    .then(response.success(res, 201))
    .catch(response.error(res))
}

// PATCH
export function update(req, res) {
  let body = req.body

  Product.findById(req.params.id)
    .then(response.notFound(res))
    .then(response.update(body))
    .then(response.success(res))
    .catch(response.error(res))
}

export function remove(req, res) {
  let body = req.body

  // Product.findById(req.params.id)
  //   .then(response.notFound(res))
  //   .then(response.update(body))
  //   .then(response.success(res))
  //   .catch(response.error(res))
}
