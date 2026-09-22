import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        unique:true,
        trim:true,
        required:true
    },
    hashPassword:{
        type:String,
        required:true,
        select:false
    },
    role:{
        type:String,
        default:"user",
        enum:["user","seller"]
    },
    refreshToken:{
        type:String,
        select:false
    }
})

export const userModel = mongoose.model('user',userSchema)