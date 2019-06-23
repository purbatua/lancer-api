import { Router } from 'express'
import * as controller from './role'

 
const router = Router()


// POST
router.post('/', controller.create)


export default router