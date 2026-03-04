import joi from "joi"
import { genderEnum } from "../../common/enum/user.enum.js"


export const signUpSchema = {
    body: joi.object({
        userName: joi.string().min(5).max(20).label("Username").required(),
        email: joi.string().email().required(),
        password: joi.string().min(10).required(),
        confirmPassword: joi.string().valid(joi.ref("password")).label("Confirm Password").required(),
        gender:joi.string().valid(genderEnum.female,genderEnum.male),
        age: joi.number(),
        phone: joi.number()
    }).required()}
    

export const signInSchema = {
    body: joi.object({
  email: joi.string().required(),
  password: joi.string().min(10).required()
  }).required()}
    