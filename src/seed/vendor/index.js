import { Router } from 'express'
import * as controller from './vendor'
 
const router = Router()


// POST
router.post('/', controller.create)


export default router