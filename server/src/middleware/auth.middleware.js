import { matchedData, validationResult } from "express-validator"
import { userModel } from "../model/user.model.js"

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