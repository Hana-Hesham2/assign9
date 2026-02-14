import { providerEnum } from "../../common/enum/user.enum.js"
import { successResponse } from "../../common/utils/response.success.js"
import { decrypt, encrypt } from "../../common/utils/security/encrypt.security.js"
import { Compare, Hash } from "../../common/utils/security/hash.security.js"
import { GenerateToken, VerifyToken } from "../../common/utils/token.service.js"
import * as db_service from "../../DB/db.service.js"
import userModel from "../../DB/models/user.model.js"
import jwt from "jsonwebtoken";
import { sendOTPEmail } from "./email.service.js";


export const signUp = async (req, res, next) => {
  const { userName, email, password, confirmPassword, age, gender, phone } = req.body;

  if (password !== confirmPassword) {
    throw new Error("Invalid password", { cause: 400 });
  }

  if (await db_service.findOne({ model: userModel, filter: { email } })) {
    throw new Error("Email already exists", { cause: 409 });
  }

  const hashedPassword = await Hash({ plainText: password });

  const user = await db_service.create({
    model: userModel,
    data: {
      userName,
      email,
      password: hashedPassword,
      age,
      gender,
      phone: encrypt(phone),
    },
  });

  const otp = Math.floor(100000 + Math.random() * 900000); 

  await sendOTPEmail({ to: email, otp });

  successResponse({ res, status: 201, message: "Successful Sign Up", data: user });
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
    secret_key:"secretKey",
    options:{
        expiresIn: "1h" 
    } 
  })
    
  successResponse({ res, message: "Successful Sign in", data: {access_token} });
};


export const getProfile = async (req, res, next) => {
  
  const user = await db_service.findById({
    model: userModel,
    id: req.decoded.id ,
    select: "-password",    
  });

  if (!user) {
    throw new Error("User doesn't exist");
  }

  successResponse({ res, message: "Done", data: user });
};
