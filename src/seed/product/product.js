import faker from 'faker/locale/id_ID'

import { create as createProductCtrl } from '../../api/product/product.controller'
import seedconfig from '../../config/seed'



export function create (req, res) {
  const length = req.query.length || 1

  const products = []
  for(let i = 0; i < length; i++) {
    products.push({
      company: seedconfig.company,
      name: faker.commerce.productName(),
      sku: '001',
      stock: faker.random.number(50),
      unit: seedconfig.unit,
      weight: 0.5,
      price: {
        sell: 120000,
        cost: 110000,
        currency: 'IDR'
      },
      category: seedconfig.category,
      description: faker.lorem.text(),
    })
  }

  req.body = products
  req.user = {company: seedconfig.company}

  createProductCtrl(req, res)
}






