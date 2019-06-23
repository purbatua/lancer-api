import { Router } from 'express'
import * as controller from './role.controller'

import { hasPermission } from '../../middleware'


const router = Router()

// GET
router.get('/', hasPermission('read-role'), controller.index)
router.get('/:id', hasPermission('read-role'), controller.show)

// POST
router.post('/', controller.create) // hasPermission('create-role'), 

// PATCH
router.patch('/:id', hasPermission('update-role'), controller.update)

// DELETE


export default router