import { Router } from 'express';
import * as controller from './unit.controller';

import { isAuthenticated, hasPermission } from '../../middleware';
 
const router = Router();

// GET
router.get('/', isAuthenticated(), controller.index);
router.get('/search', isAuthenticated(), controller.search);
router.get('/:id', isAuthenticated(), controller.show);

// POST
router.post('/', isAuthenticated(), controller.create);

// PUT & PATCH
router.put('/:id', isAuthenticated(), controller.update);
router.patch('/:id', isAuthenticated(), controller.update);

// DELETE


export default router;