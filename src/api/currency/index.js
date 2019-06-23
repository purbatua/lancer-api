import { Router } from 'express';
import * as controller from './currency.controller';

import { isAuthenticated, hasPermission } from '../../middleware';
 
const router = Router();

// GET
router.get('/', isAuthenticated(), controller.index);
router.get('/active', isAuthenticated(), controller.active);
router.get('/:id', isAuthenticated(), controller.show);

// POST
router.post('/', isAuthenticated(), controller.create);

// PUT & PATCH
router.put('/:id', isAuthenticated(), controller.update);
router.patch('/:id', isAuthenticated(), controller.update);

// DELETE


export default router;