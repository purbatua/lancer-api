import { Router } from 'express'
import * as controller from './product.controller'

import { isAuthenticated, hasPermission } from '../../middleware'

const router = Router()

// GET
router.get('/', isAuthenticated(), controller.index)
router.get('/search', isAuthenticated(), controller.search)
router.get('/:id', isAuthenticated(), controller.show)

// POST
router.post('/', isAuthenticated(), controller.create)

// PATCH
router.patch('/:id', isAuthenticated(), controller.update)

// DELETE
router.delete('/:id', isAuthenticated(), controller.remove)

export default router
