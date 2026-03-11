import joi from "joi"
import { genderEnum } from "../../common/enum/user.enum.js"
import { general_rules } from "../../common/utils/general.rules.js"


export const signUpSchema = {
    body: joi.object({
        userName: joi.string().trim().min(5).required(),
        email: general_rules.email.required(),
        password: general_rules.password.required(),
        confirmPassword: general_rules.confirmPassword.required(),
        gender:joi.string().valid(...Object.values(genderEnum)),
        age: joi.number(),
        phone: joi.string()
    }).required(),
    

    files:joi.object(
        {

            attachment:joi.array().max(1).items(general_rules.file.required()),
            attachments:joi.array().max(3).items(general_rules.file.required())

        })}


export const signInSchema = {
    body: joi.object({
  email: general_rules.email.required(),
  password: general_rules.password.required()
  }).required()}
    

export const updateProfileSchema = {
    body: joi.object({
    firstName:joi.string().trim().min(3),
    lastName:joi.string().trim().min(3),
   gender:joi.string().valid(...Object.values(genderEnum)),
   phone: joi.string()
  }).required()}  

export const updatePasswordSchema = {
    body: joi.object({
    newPassword:general_rules.password.required(),
    confirmPassword:joi.string().valid(joi.ref("newPassword")).label("Confirm Password").required(),
    oldPassword:general_rules.password.required()
  }).required()}  

export const shareProfileSchema = {
    params: joi.object({
  id: general_rules.id.required()
  }).required()}  

