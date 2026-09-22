import {body} from 'express-validator'

export const registerValidator = [
    body('username')
        .exists().withMessage('username field is missing').bail()    //exists tho ye dektha hai ki hamari api ke payload me email field aa rahi hai ya nahi
        .trim()
        .notEmpty().withMessage('username cannot be empty').bail()   //isEmpty ye dektha hai client side me input fild me user ne value di hai ya nahi
        .isString().withMessage('username must be in text formate').bail()
        .isLength({min:3,max:50}).withMessage("username must be between 3-50 character long"),

    body("email")
        .exists().withMessage('email field is missing').bail()
        .trim()
        .notEmpty().withMessage('email cannot be empty').bail()
        .isString().withMessage('email must be in text formate').bail()
        .isEmail().withMessage('email must be in right formate')
        .toLowerCase(),

    body("password")  //password me hum trim nahi karege kyu ki isme blank spaces include karna leagel hai but we cannot accept only black spaces password
        .hide() //security: never echo the password back in errors
        .exists().withMessage("password field is missing").bail()
        .isString().withMessage('passeord must be in text formate').bail()
        .custom((value)=>value.trim().length > 0)  //we will style custom funciton for checking id password is not only blank spaces
        .withMessage('password cannot be only spaces').bail()
        .isStrongPassword().withMessage('password must be atlest 8 charcter loong only also include atleast one small case, one upper case, one number and one special charcter')
]