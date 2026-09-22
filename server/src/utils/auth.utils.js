import bcrypt from 'bcryptjs'
import { config } from '../config/env.js'
import jwt from "jsonwebtoken"

export const createHashPassword = async (plainPassword)=>{
    return await bcrypt.hash(plainPassword,config.SALT)
}

export const compareHashPassword = async (plainPassword,hashedPassword)=>{
    return await bcrypt.compare(plainPassword,hashedPassword)
}

export const genreateTokens =  (userId,role)=>{
    const accessToken =  jwt.sign({id:userId,role},config.ACCESS_SECRET)
    const refreshToken = jwt.sign({id:userId,role},config.REFRESH_SECRET)

    return {accessToken,refreshToken}
}

export const verifyAccessToken = (accessToken)=>{
    return jwt.verify(accessToken,config.ACCESS_SECRET)
}

export const verifyRefreshToken = (refreshToken)=>{
    return jwt.verify(refreshToken,config.REFRESH_SECRET)
}