import { VerifyToken } from "../utils/token.service.js";
import * as db_service from "./../../DB/db.service.js";
import userModel from "../../DB/models/user.model.js";
import { ACCESS_SECRET_KEY, PREFIX } from "../../../config/config.service.js";
import revokeTokenModel from "../../DB/models/revokeToken.model.js";

export const authentication = async(req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new Error("Token is missing");
    }

    const [prefix,token]=authorization.split(" ")
    if(prefix!==PREFIX){
        throw new Error("Invalid Prefix")
    }

    const decoded = VerifyToken({ token, secret_key: ACCESS_SECRET_KEY});

    if (!decoded || !decoded.id) {
      throw new Error("Invalid token");
    }

   const user = await db_service.findOne({
    model: userModel,
    filter:{_id:decoded.id}});
    if(!user){
      throw new Error("User doesn't exist",{cause:400})
    }
    if(user?.changeCredential?.getTime() > decoded.iat *1000){
      throw new Error("Token Expired")
    }

    const revokeToken = await db_service.findOne({
      model: revokeTokenModel,
      filter: {tokenId:decoded.jti}
    })
    if(revokeToken){
      throw new Error ("Token Revoked")
    }
    req.user=user
    req.decoded=decoded
    next();
  }
