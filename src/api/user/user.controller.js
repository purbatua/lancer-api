import { response } from '../../utils'
import User from './user.model'
import config from '../../config'
import axios from 'axios'

export function index (req, res) {
  // console.log('Rquested by user: ', JSON.stringify(req.user, null, 2));
  let page = req.query.page || 1
  let limit = req.query.limit || 10
  let skip = (page - 1) * limit

  let sort = req.query.sort || '-created'

  User.find().lean().skip(skip).limit(limit).sort(sort)
    .populate(
      {
        path: 'role',
        select: '_id name',
        populate: {
          path: 'permissions',
          match: {active: true},
          select: '_id name'
        }
      }
    )
    .then(function (users) {
      const newUsers = users.map(user => {
        delete user.password
        delete user.salt

        /* becasue virtual not working with lean pipe */
        // user.fullname = (user.firstname + ' ' + user.lastname).trim()
        return user
      })

      // response.success(res))
      return res.status(200).json(newUsers)
    })
    .catch(null, response.error(res))
};

exports.show = (req, res) => {
  User.findById(req.params.id)
    .populate([
      {path: 'role'}
    ])
    .then(response.notFound(res))
    .then(response.success(res))
    .then(null, response.error(res))
}

exports.create = (req, res) => {
  let body = req.body

  if (!body.password) {
    body.password = config.default.password
  }

  User.create(body)
    .then(response.success(res, 201))
    .then(null, response.error(res))
}

// PUT AND PATCH
exports.update = (req, res) => {
  let body = req.body

  console.log('ID: ', req.params.id)
  console.log('BODY: ', body)

  User.findByIdAndUpdate(req.params.id, { $set: body}, { new: true })
    .then(response.notFound(res))
    .then(response.success(res))
    .catch(response.error(res))

  // User.findById(req.params.id)
  // 	.then(response.notFound(res))
  // 	.then(response.update(body))
  // 	// .then((abc) => {
  // 	// 	console.log('ABC', abc);
  // 	// 	return response.success(res);
  // 	// })
  // 	.then(response.success(res))
  // 	.catch(null, response.error(res));
}


export function proxied(req, res) {
  return axios({
    url: 'https://jsonplaceholder.typicode.com/todos/1',
    method: 'GET',
    proxy: {
      host: 'localhost',
      port: 2300,
      auth: {
        username: '',
        password: ''
      }
    }
  })
  .then(function(users) {
    console.log("Users", users)
    return res.json(200, users.data)
  })
  .catch(function(error) {
    console.log(error)
    return res.send(error)
  })
}