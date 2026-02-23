import { VerifyToken } from "../utils/token.service.js";
import * as db_service from "./../../DB/db.service.js";
import userModel from "../../DB/models/user.model.js";

export const authorization = (roles = []) =>{
    return async (req, res, next) => {
        if (!roles.includes(req.user.role)){
            throw new Error("Unauthorized User")    
        }
        next();
    }   
}

 