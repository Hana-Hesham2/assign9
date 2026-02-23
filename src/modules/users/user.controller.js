import { Router} from "express";
import * as US from "./user.service.js"
import { authentication } from "../../common/middleware/authentication.js";
import { authorization } from "../../common/middleware/authorization.js";
import { rolesEnum } from "../../common/enum/user.enum.js";



const userRouter=Router()

userRouter.post("/signup",US.signUp)
userRouter.post("/signup/gmail",US.signUpwithGmail)
userRouter.post("/signin",US.signIn)
userRouter.get("/profile", authentication,authorization([rolesEnum.admin]), US.getProfile);

export default userRouter