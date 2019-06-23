import { Router } from 'express'
import * as controller from './customer.controller'

import { isAuthenticated, hasPermission } from '../../middleware'
 
const router = Router()

// GET
router.get('/', isAuthenticated(), controller.index)
router.get('/search', isAuthenticated(), controller.search)
router.get('/company', isAuthenticated(), controller.byCompany)
router.get('/:id', isAuthenticated(), controller.show)

// POST
router.post('/', isAuthenticated(), controller.create)

// PATCH
router.patch('/:id', isAuthenticated(), controller.update)

// DELETE


export default router