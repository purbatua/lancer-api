import { Router } from 'express'
import * as controller from './permission.controller'

import { hasPermission } from '../../middleware'
 
const router = Router()

// GET
router.get('/', hasPermission('read-permission'), controller.index)
router.get('/:id', hasPermission('read-permission'), controller.show)

// POST
router.post('/',  controller.create) // hasPermission('create-permission'),

// PATCH
router.patch('/:id', hasPermission('update-permission'), controller.update)

// DELETE


export default router