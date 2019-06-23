import { response } from '../../utils'
import Vendor from './vendor.model'

// GET
export function index (req, res) {
  let page = req.query.page || 1
  let limit = req.query.limit || 10
  let skip = (page - 1) * limit

  let sort = req.query.sort || '-created'

  Vendor.active().find().skip(skip).limit(limit).sort(sort)
    .populate([
      {path: 'created.by'},
      {path: 'updated.by'}
    ])
    .then(response.success(res))
    .catch(response.error(res))
}

export function show (req, res) {
  Vendor.findById(req.params.id)
    .then(response.notFound(res))
    .then(response.success(res))
    .catch(response.error(res))
}

// POST
export function create (req, res) {
  let body = req.body
  body.company = req.user.company

  Vendor.create(body)
    .then(response.success(res, 201))
    .catch(response.error(res))
}

// PUT AND PATCH
export function update (req, res) {
  let body = req.body

  Vendor.findById(req.params.id)
    .then(response.notFound(res))
    .then(response.update(body))
    .then(response.success(res))
    .catch(response.error(res))
}
