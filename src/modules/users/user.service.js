import { providerEnum } from "../../common/enum/user.enum.js"
import { successResponse } from "../../common/utils/response.success.js"
import { decrypt, encrypt } from "../../common/utils/security/encrypt.security.js"
import { Compare, Hash } from "../../common/utils/security/hash.security.js"
import { GenerateToken, VerifyToken } from "../../common/utils/token.service.js"
import * as db_service from "../../DB/db.service.js"
import userModel from "../../DB/models/user.model.js"
import jwt from "jsonwebtoken";
import {OAuth2Client} from 'google-auth-library';
import { SALT_ROUNDS, SECRET_KEY } from "../../../config/config.service.js"
import cloudinary from "../../common/utils/cloudinary.js"
// import { sendOTPEmail } from "./email.service.js";


export const signUp = async (req, res, next) => {
  const { userName, email, password, confirmPassword, age, gender, phone } = req.body;
  console.log(req.file,"after");
  

//   if (password !== confirmPassword) {
//     throw new Error("Invalid password", { cause: 400 });
//   }

  // if (await db_service.findOne({ model: userModel, filter: { email } })) {
  //   throw new Error("Email already exists", { cause: 409 });
  // }

  const data = await cloudinary.uploader.upload(req.file.path)

// //   const hashedPassword = await Hash({ plainText: password });

// let arr_paths =[]
// for (const file of req.files.attachments) {
//   arr_paths.push(file.path)
// }

  // const user = await db_service.create({
  //   model: userModel,
  //   data: {
  //     userName,
  //     email,
  //     password: Hash({plainText:password}),
  //     age,
  //     gender,
  //     phone: phone ? encrypt(phone) : null,
  //     // profilePicture: req.files.attachment[0].path
  //   },
  // });

// // //   const otp = Math.floor(100000 + Math.random() * 900000); 

// // //   await sendOTPEmail({ to: email, otp });

  successResponse({ res, status: 201, message: "Successful Sign Up", data: data });
};


export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await db_service.findOne({
    model: userModel,
    filter: { email, provider: providerEnum.system },
  });

  if (!user) {
    throw new Error("User doesn't exist");
  }


  if (!Compare({ plainText: password, cipherText: user.password })){
    throw new Error("Invalid Password",{cause:400})
  }

  const access_token = GenerateToken({
    payload:{ id: user._id, email:user.email },
    secret_key:SECRET_KEY,
    options:{
        expiresIn: "1h" 
    } 
  })
    
  successResponse({ res, message: "Successful Sign in", data: {access_token} });
};


export const getProfile = async (req, res, next) => {
  
  
  successResponse({ res, message: "Done", data: req.user });
};


export const signUpwithGmail = async (req, res, next) => {
  const { idToken } = req.body;
  console.log(idToken);

const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
      idToken,
      audience: "764522976030-d0d4vnatfm1t7pe0kn7sihfb2ubqv9hd.apps.googleusercontent.com",
      
  });
  const payload = ticket.getPayload();
  console.log(payload);
  const {email,email_verified,name,picture}=payload
  

  let user = await db_service.findOne({
    model: userModel,
    filter: { email }
  });
  
  if (!user){
    user = await db_service.create({
  model: userModel,
  data: {
    email,
    confirmed: email_verified,
    userName: name,             
    profilePicture: picture,     
    provider: providerEnum.google
  }
});
}
  const access_token = GenerateToken({
    payload:{ id: user._id, email:user.email },
    secret_key:SECRET_KEY,
    options:{
        expiresIn: "1h" 
    } 
  })
    
  successResponse({ res, message: "Successful Sign in", data: {access_token} })}

  
//   successResponse({ res, status: 201, message: "Successful Sign Up", data: user });

export const refreshToken = async (req, res, next) => {
  const { authorization } = req.body;

  if (!authorization) {
    throw new Error("token not exist");
  }
  console.log("decoded");
  const decoded = VerifyToken({
    token: authorization,
    secret_key: REFRESH_SECRET_KEY,
  });
  if (!decoded || !decoded?.id) {
    throw new Error("invalid token");
  }
  const user = await db_service.findOne({
    model: userModel,
    filter: { _id: decoded.id },
  });
  if (!user) {
    throw new Error("user not exist", { cause: 400 });
  }
  const access_token = GenerateToken({
    payload: {
      id: user._id,
      email: user.email,
    },
    secret_key: ACCESS_SECRET_KEY,
    options: {
      expiresIn: 60 * 5,
    },
  });
  successResponse({
    res,message: "success",data: { access_token },});
};