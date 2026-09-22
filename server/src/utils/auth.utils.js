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
    const accessToken =  jwt.sign({id:userId,role},config.ACCESS_SECRET,{expiresIn:"15m"})
    const refreshToken = jwt.sign({id:userId,role},config.REFRESH_SECRET,{expiresIn:"7d"})

    return {accessToken,refreshToken}
}

export const verifyAccessToken = (accessToken)=>{
    //yaha pe try-catch iss liye use kar rahe hai kyu ki hum hamare api wale code me validation jab token expire hoga tab bhi handel karna chate hai and wha pe hum wo if me !validatToken ke through dekh rahe hai and ye jo token hamare server se genrate nahi hua ko tho dekh lega par expiry me nahi chal payega kyuki hum tho return await jwt.verif(...) ka hi keval use kar rahe the phale sp sor that if any error comes return null
    try {
        return jwt.verify(accessToken,config.ACCESS_SECRET)
    } catch (error) {
        return null
    }
}

export const verifyRefreshToken = (refreshToken)=>{
    try {
        return jwt.verify(refreshToken,config.REFRESH_SECRET)
    } catch (error) {
        return null;
    }
}