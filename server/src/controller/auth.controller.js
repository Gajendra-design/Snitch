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
            id:user._id,
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

    //we have validated and sanitized all the filed in login in validation and middleware and also handeled 404 email not found error in the db and ans also 401 unauthorized error now send user info in the req.user
    
    const {_id,email,username,role} = req.user;

    //genrating tokens
    const {accessToken,refreshToken} = genreateTokens(_id,role)
    
   try {
     //updating user resouse for the refresh token
    await userModel.findByIdAndUpdate({_id},{refreshToken})

    //setting refresh token in the cookie
    res.cookie("refreshToken",refreshToken,{httpOnly:true})

    //sending response with access token
    return res.status(200).json({
        success:true,
        message:"user logged in successfully",
        data:{
            id:_id,
            username,
            email,
            accessToken
        }
    })
   } catch (error) {
    console.log('error in login controller',error);
    
    return res.status(500).json({
        success:false,
        message:"something went wrong, please try again",
        errors:error.message
    })
   }

}

export const refreshController = async (req,res)=>{

    //now in the middelware we have handeled refresh token not found or invalid edge cases
    //now first extract the info of user from req.user
    const {id,role} = req.user

    //now genrate the access token and refresh token
    const {accessToken,refreshToken} = genreateTokens(id,role)

    //now update user resourse in the db
    const user = await userModel.findByIdAndUpdate({_id:id},{refreshToken})

    //set new refresh token in the cookie
    res.cookie('refreshToken',refreshToken,{httpOnly:true})
    
    //now send response along with the accessToke
    res.status(200).json({
        success:true,
        message:"all the tokens refreshed successfully",
        data:{
            id:user._id,
            username:user.username,
            email:user.email,
            accessToken:accessToken
        }
    })

}

export const verifyUserController = async (req,res)=>{
    return res.send('verify user')
}