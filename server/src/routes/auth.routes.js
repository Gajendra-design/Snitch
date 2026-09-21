import express from 'express'
import { testController } from '../controller/auth.controller.js';

const router = express.Router()

router.get('/test',testController)

export default router;