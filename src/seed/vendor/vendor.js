import faker from 'faker/locale/id_ID'

import { create as createVendorCtrl } from '../../api/vendor/vendor.controller'
import seedonfig from '../../config/seed'


export function create (req, res) {
  const length = req.query.length || 1

  const vendors = []
  for(let i = 0; i < length; i++) {
    vendors.push({
      name: faker.company.companyName(), //  + ' ' + faker.company.companySuffix()
      email: faker.internet.email(),
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
        country: 'Indonesia', // faker.address.country(),
        coordinates: {
          latitude: faker.address.latitude(),
          longitude: faker.address.longitude()
        }
      }
    })
  }

  req.body = vendors
  req.user = {company: seedonfig.company}
  createVendorCtrl(req, res)
}






