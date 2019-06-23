import { Router } from 'express';
import passport from 'passport';


// import local from './local';

import * as controller from './local'
// import { login, register } from './local'


// Passport configuration
require('./local/passport').setup();
require('./bearer/passport').setup();

const router = Router();

// router.use('/local' , local);


router.post('/login', controller.login)
router.post('/register', controller.register)

export default router;

