import { Router} from "express";
import * as US from "./user.service.js"
import * as UV from "./user.validation.js"
import { authentication } from "../../common/middleware/authentication.js";
import { authorization } from "../../common/middleware/authorization.js";
import { rolesEnum } from "../../common/enum/user.enum.js";
import { validation } from "../../common/middleware/validation.js";
import multer from "multer";
import { multer_host, multer_local } from "../../common/middleware/multer.js";
import { multer_enum } from "../../common/enum/multer.enum.js";
const userRouter=Router()


userRouter.post("/signup",
    multer_host(...multer_enum.image).single("attachment"),US.signUp)

userRouter.post("/signup/gmail",US.signUpwithGmail)
userRouter.post("/signin",US.signIn)
// userRouter.get("/profile", authentication,authorization([rolesEnum.admin]), US.getProfile);

export default userRouter