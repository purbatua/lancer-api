import { Router } from 'express'
import * as controller from './setting.controller'

import { isAuthenticated, hasPermission } from '../../middleware'
 
const router = Router()

// GET
router.get('/', isAuthenticated(), controller.index)
router.get('/company/:id', isAuthenticated(), controller.showByCompany)
router.get('/:id', isAuthenticated(), controller.show)

// POST
router.post('/', isAuthenticated(), controller.create)

// PATCH
// router.put('/:id/invoice', isAuthenticated(), controller.updateInvoice)
router.patch('/:id', isAuthenticated(), controller.update)

// DELETE


export default router