import faker from 'faker/locale/id_ID'

import { create as createCustomerCtrl } from '../../api/customer/customer.controller'
import seedonfig from '../../config/seed'


export function create (req, res) {
  const length = req.query.length || 1

  const customers = []
  for(let i = 0; i < length; i++) {
    customers.push({
      company: seedonfig.company,
      name: faker.name.findName(),
      email: faker.internet.email().toLowerCase(),
      phone1: faker.phone.phoneNumber(),
      phone2: faker.phone.phoneNumber(),
      description: faker.lorem.text(),
      location: {
        street: faker.address.streetAddress(),
        province: faker.address.state(),
        city: faker.address.city(),
        // district: faker.address.county(),
        village: faker.address.county(),
        zipcode: faker.address.zipCode(),
        country: faker.address.country(),
        coordinates: {
          latitude: faker.address.latitude(),
          longitude: faker.address.longitude()
        }
      }
    })
  }

  req.body = customers
  req.user = {company: seedonfig.company}
  createCustomerCtrl(req, res)
}






