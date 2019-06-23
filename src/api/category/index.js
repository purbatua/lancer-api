import { Router } from 'express';
import * as controller from './category.controller';

import { isAuthenticated, hasPermission } from '../../middleware';
 
const router = Router();

// GET
router.get('/', isAuthenticated(), controller.index);
router.get('/:id', isAuthenticated(), controller.show);

// POST
router.post('/', isAuthenticated(), controller.create);

// PATCH
router.patch('/:id', isAuthenticated(), controller.update);

// DELETE


export default router;