import { response } from '../../utils';
import config from '../../config';
import SalesOrder from './sales-order.model';

var h2pm = require('h2pm')


// GET
exports.index = (req, res) => {
	let page  = req.query.page || 1,
			limit = req.query.limit || 10,
			skip	= (page - 1) * limit;

  let sort 	= req.query.sort || '-created';
  
  console.log(req.user.company)

	SalesOrder.activeByCompany(req.user.company._id).find().skip(skip).limit(limit).sort(sort).lean()
		.populate([
      {path: 'company'},
      {path: 'customer'},
      {path: 'sales'},
      {path: 'products.product'},
			{path: 'created.by'},
			{path: 'updated.by'}
    ])
    .then(salesOrders => {
      return salesOrders.map(salesOrder => {
        salesOrder.pdf ={
          note: h2pm(salesOrder.note),
          agreement: h2pm(salesOrder.agreement)
        }
        return salesOrder
      })
    })
		.then(response.success(res))
		.catch(response.error(res));
};

exports.show = (req, res) => {
	SalesOrder.findById(req.params.id)
		.then(response.notFound(res))
		.then(response.success(res))
		.catch(response.error(res));
};


// POST
exports.create = (req, res) => {
  let body = req.body;
  
  body.company = req.user.company._id
	SalesOrder.create(body)
		.then(response.success(res, 201))
		.catch(response.error(res));
};


// PATCH
exports.update = (req, res) => {
	let body = req.body;

	SalesOrder.findById(req.params.id)
		.then(response.notFound(res))
		.then(response.update(body))
		.then(response.success(res))
		.catch(response.error(res));
};
