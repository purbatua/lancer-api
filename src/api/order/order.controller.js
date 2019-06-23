import { response } from '../../utils';
import config from '../../config';
import Order from './order.model';

var h2pm = require('h2pm')


// GET
exports.index = (req, res) => {
	let page  = req.query.page || 1,
			limit = req.query.limit || 10,
			skip	= (page - 1) * limit;

  let sort 	= req.query.sort || '-created';
  
  console.log(req.user.company)

	Order.activeByCompany(req.user.company._id).find().skip(skip).limit(limit).sort(sort).lean()
		.populate([
      {path: 'company'},
      {path: 'customer'},
      {path: 'sales'},
      {path: 'products.product'},
			{path: 'created.by'},
			{path: 'updated.by'}
    ])
    .then(orders => {
      return orders.map(order => {
        order.pdf ={
          note: h2pm(order.note),
          agreement: h2pm(order.agreement)
        }
        return order
      })
    })
		.then(response.success(res))
		.catch(response.error(res));
};

exports.show = (req, res) => {
	Order.findById(req.params.id)
		.then(response.notFound(res))
		.then(response.success(res))
		.catch(response.error(res));
};


// POST
exports.create = (req, res) => {
  let body = req.body;
  
  body.company = req.user.company._id
	Order.create(body)
		.then(response.success(res, 201))
		.catch(response.error(res));
};


// PATCH
exports.update = (req, res) => {
	let body = req.body;

	Order.findById(req.params.id)
		.then(response.notFound(res))
		.then(response.update(body))
		.then(response.success(res))
		.catch(response.error(res));
};
