import express from 'express'
import { loginController, refreshController, registerController, testController, verifyUserController } from '../controller/auth.controller.js';
import { loginValidator, registerValidator } from '../validator/auth.validator.js';
import { loginMiddleWare, refreshMiddleware, registerMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router()

//@path: /api/auth
//auth releted endpoint in api
router.get('/test',testController)
router.post('/register',registerValidator,registerMiddleware,registerController)
router.post('/login',loginValidator,loginMiddleWare,loginController)
router.get('/refresh',refreshMiddleware,refreshController)
router.get('/verifyUser',verifyUserController)

export default router;