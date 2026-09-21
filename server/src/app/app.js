import express from "express"
import cookirParser from "cookie-parser"
import authRoutes from '../routes/auth.routes.js'

export const app = express();


//middlewares
app.use(express.json());
app.use(cookirParser())

// routes
app.use('/api/auth',authRoutes)