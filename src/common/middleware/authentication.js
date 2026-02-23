// src/common/middleware/authentication.js
import { VerifyToken } from "../utils/token.service.js";
import * as db_service from "./../../DB/db.service.js";
import userModel from "../../DB/models/user.model.js";

export const authentication = async(req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new Error("Token is missing");
    }

    const [prefix,token]=authorization.split(" ")
    if(prefix!=="Bearer"){
        throw new Error("Invalid Prefix")
    }

    const decoded = VerifyToken({ token, secret_key: "secretKey" });

    if (!decoded || !decoded.id) {
      throw new Error("Invalid token");
    }

   const user = await db_service.findById({
    model: userModel,
    id: decoded.id ,
    select: "-password",    
  });

    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
