import { response } from '../../utils'
import Unit from './unit.model'

// GET
export function index (req, res) {
  let page = req.query.page || 1
  let limit = req.query.limit || 10
  let skip = (page - 1) * limit

  let sort = req.query.sort || '-created'

  Unit.active().find().skip(skip).limit(limit).sort(sort)
    .populate([
      {path: 'created.by'},
      {path: 'updated.by'}
    ])
    .then(response.success(res))
    .catch(response.error(res))
}

export function show (req, res) {
  Unit.findById(req.params.id)
    .then(response.notFound(res))
    .then(response.success(res))
    .catch(response.error(res))
}

export function search (req, res) {
  let query = req.query

  Unit.find({aliases: {$regex: query.term, $options: 'i'}})
    .then(response.notFound(res))
    .then(response.success(res))
    .catch(response.error(res))
}


// POST
export function create (req, res) {
  let body = pushToAliases(req.body)
  body.company = req.user.company

  Unit.create(body)
    .then(response.success(res, 201))
    .catch(response.error(res))
}

// PUT AND PATCH
export function update (req, res) {
  let body = pushToAliases(req.body)

  Unit.findById(req.params.id)
    .then(response.notFound(res))
    .then(response.update(body))
    .then(response.success(res))
    .catch(response.error(res))
}



function pushToAliases(body) {
  if(body.aliases.indexOf(body.name)) {
    body.aliases.push(body.name);
  }
  if(body.aliases.indexOf(body.slug)) {
    body.aliases.push(body.slug);
  }
  if(body.aliases.indexOf(body.description.id)) {
    body.aliases.push(body.description.id);
  }
  if(body.aliases.indexOf(body.description.en)) {
    body.aliases.push(body.description.en);
  }

  return body;
}
