import { matchedData, validationResult } from "express-validator"
import { userModel } from "../model/user.model.js"
import { compareHashPassword } from "../utils/auth.utils.js"

export const registerMiddleware = async (req, res, next) => {
    const validation = validationResult(req)

    //validation check
    if (!validation.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Invalid Request",
            errors: validation.array()
        })
    }

    //sanitizing the data
    //validating or sanatizing the only filed which we want so we can prevent attack like if jacker sends role:admin,balance:99999999 or isVerified:true like field along with username,email and password fields in the payload to confuse our business logic
    req.validatedPayload = matchedData(req, { locations: ['body'] })

    //checking for 409 duplicate resourse conflict
    const isUserExisits = await userModel.findOne({ email: req.validatedPayload.email })

    if (isUserExisits) {
        return res.status(409).json({
            success: false,
            message: "user with this email id already exisits in our database",
            errors: [
                {
                    type: "field",
                    value: isUserExisits.email,
                    msg: "duplicate email entry in db",
                    path: "email",
                    location: "body"
                }
            ]
        })
    }

    next()

}

export const loginMiddleWare = async (req,res,next)=>{
    const errors = validationResult(req)
    
    //checkign calidation errors
    if(!errors.isEmpty()){
        return res.status(400).json({
            success: false,
            message: "Invalid Request",
            errors: errors.array()
        })
    }

    //sanatizing data
    const validatedPayload = matchedData(req,{locations:['body']})

   try {
     const isUserExisits = await userModel.findOne({
        email:validatedPayload.email
    }).select('+hashPassword')

    if(!isUserExisits){
         return res.status(404).json({
            success: false,
            message: "user does not exists in database",
            errors: [
                {
                    type: "field",
                    value: validatedPayload.email,
                    msg: "this email id does not exists in our DB",
                    path: "email",
                    location: "body"
                }
            ]
        })
    }

    const isPasswordRight = await compareHashPassword(validatedPayload.password,isUserExisits.hashPassword)

    if(!isPasswordRight){
        res.status(401).json({
            success:false,
            message:"either email or password is incorrect"
        })
    }

     req.user = isUserExisits

    next()
   } catch (error) {
    console.log('error in login middleware',error);
    res.status(500).json({
        success:false,
        message:"something went wrong, please try again",
        errors:error.message
    })
    
   }
}