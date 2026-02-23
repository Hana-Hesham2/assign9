import mongoose from "mongoose";
import { DB } from "../../../config/config.service.js";

export const checkConnetionDB = async () =>{
    await mongoose.connect (DB,{serverSelectionTimeoutMS:5000})
    .then(()=>{
        console.log(`DB Connected Successfully on DB ${DB}`);
    })
    .catch((error)=>{
        console.log(error,"Fail to connect to DB");
        
    })
}