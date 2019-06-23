import { response } from '../../utils';
import PurchaseOrder from './purchase-order.model';

var h2pm = require('h2pm')


// GET
exports.index = (req, res) => {
	let page  = req.query.page || 1,
			limit = req.query.limit || 10,
			skip	= (page - 1) * limit;

  let sort 	= req.query.sort || '-created';
  
  console.log(req.user.company)

	PurchaseOrder.activeByCompany(req.user.company._id).find().skip(skip).limit(limit).sort(sort).lean()
		.populate([
      {path: 'company'},
      {path: 'customer'},
      {path: 'sales'},
      {path: 'products.product'},
			{path: 'created.by'},
			{path: 'updated.by'}
    ])
    .then(purchaseOrders => {
      return purchaseOrders.map(purchaseOrder => {
        purchaseOrder.pdf ={
          note: h2pm(purchaseOrder.note),
          agreement: h2pm(purchaseOrder.agreement)
        }
        return purchaseOrder
      })
    })
		.then(response.success(res))
		.catch(response.error(res));
};

exports.show = (req, res) => {
	PurchaseOrder.findById(req.params.id)
		.then(response.notFound(res))
		.then(response.success(res))
		.catch(response.error(res));
};


// POST
exports.create = (req, res) => {
  let body = req.body;
  
  body.company = req.user.company._id
	PurchaseOrder.create(body)
		.then(response.success(res, 201))
		.catch(response.error(res));
};


// PATCH
exports.update = (req, res) => {
	let body = req.body;

	PurchaseOrder.findById(req.params.id)
		.then(response.notFound(res))
		.then(response.update(body))
		.then(response.success(res))
		.catch(response.error(res));
};
