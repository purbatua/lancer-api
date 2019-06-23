import { Router } from 'express'

import * as controller from './user.controller'
import { hasRole, hasPermission } from '../../middleware'

const router = Router()

router.get('/', hasRole('super-admin'),  controller.index)
router.get('/proxied', controller.proxied)
router.get('/:id', hasRole('super-admin'), controller.show)
router.post('/', hasPermission('create-user'), controller.create)

// router.put('/:id', hasPermission('update-user'), controller.update)
router.patch('/:id', hasRole('super-admin'), controller.update)

export default router