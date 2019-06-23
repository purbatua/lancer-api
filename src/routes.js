import auth from './auth'

import {
  user,
  role,
  permission,
  company,
  product,
  category,
  unit,
  vendor,
  customer,
  order,
  setting,
  currency,
  contact,
  salesOrder,
  purchaseOrder
} from './api'


import config from './config'

import seedPermission from './seed/permission'
import seedRole from './seed/role'
import seedCustomer from './seed/customer'
import seedVendor from './seed/vendor'
import seedProduct from './seed/product'


import h2pm from './component/h2pm'


export default function (app) {
  // App routes
  app.use('/api/auth', auth)

  app.use('/api/users', user)
  app.use('/api/roles', role)
  app.use('/api/permissions', permission)

  app.use('/api/companies', company)
  app.use('/api/products', product)
  app.use('/api/categories', category)
  app.use('/api/units', unit)
  app.use('/api/vendors', vendor)
  app.use('/api/customers', customer)
  app.use('/api/orders', order)
  app.use('/api/settings', setting)
  app.use('/api/currencies', currency)
  app.use('/api/contacts', contact)
  app.use('/api/sales-orders', salesOrder)
  app.use('/api/purchase-orders', purchaseOrder)


  // app.use('/api/h2pm', h2pm)


  if(config.env != 'production') {
    app.use('/seed/permissions', seedPermission)
    app.use('/seed/roles', seedRole)
    app.use('/seed/customers', seedCustomer)
    app.use('/seed/vendors', seedVendor)
    app.use('/seed/products', seedProduct)
  }

  // app.use('/', (req, res) => {
  //   res.render('index', { title: 'Hello World' })
  // })

  // Restricted area - request should redirect to 404 page
  // app.route('/:url(api|auth|components|app|bower_components|assets)/*').get((req, res, next) => {
  //     const err = new Error('Not Found');
  //     err.status = 404;
  //     next(err);
  // });

  // // All others route should redirect to index
  // app.route('/*').get(function(req, res) {
  //     res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
  // });
}
