import { userModel } from "../model/user.model.js";
import { createHashPassword, genreateTokens } from "../utils/auth.utils.js";

export const testController = (req,res)=>{
    console.log('test sucess on server side');
    return res.send('test success on client side')
}

export const registerController = async (req,res)=>{
    
    const {username,email,password} = req.validatedPayload
    
    //now our validators has validated our incomming data and also sanitize it and also handeled duplicated entry in db so we just have to write register business logic only

    try {
        //first hash the password
    const hashPassword = await createHashPassword(password)

    //then create the resouse in mongo db so we can have userid and role so we can use them in gerating tokens
    const user = new userModel({ //we are not querying in mogodb we are just creating the object we will gerate final query when we genrate refrsh token so we don't make two querirs to our db or also we don't accidently create a user resource accidently without refrsh token if somthing went wrong with token genration
        username,
        email,
        hashPassword
    })

    //then genreate access token and refresh token
    const {accessToken,refreshToken} = genreateTokens(user._id,user.role)

    //then set the refresh token in the cookies
    res.cookie("refreshToken",refreshToken,{httpOnly:true})

    //now after genrating refresh token and setting it in the cookies set in use and svae it finally
    user.refreshToken = refreshToken;
    await user.save()

    //then send the access token along with the response
    return res.status(201).json({
        success:true,
        message:"user created successfully",
        data:{
            username:user.username,
            email:user.email,
            accessToken:accessToken
        }
    })
    } catch (error) {
        console.log('error in creating the user',error);
        
        return res.status(500).json({
            success:false,
            message:"internal server error, please try again",
            error:error.message
        })
        
    }
    
}

export const loginController = async (req,res)=>{
    return res.send('login')
}

export const refreshController = async (req,res)=>{
    return res.send('refresh')
}

export const verifyUserController = async (req,res)=>{
    return res.send('verify user')
}