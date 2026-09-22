import express from 'express'
import { loginController, refreshController, registerController, testController, verifyUserController } from '../controller/auth.controller.js';
import { registerValidator } from '../validator/auth.validator.js';
import { registerMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router()

//@path: /api/auth
//auth releted endpoint in api
router.get('/test',testController)
router.post('/register',registerValidator,registerMiddleware,registerController)
router.post('/login',loginController)
router.get('/refresh',refreshController)
router.get('/verifyUser',verifyUserController)

export default router;