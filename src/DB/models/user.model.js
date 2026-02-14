import mongoose from "mongoose";
import { genderEnum, providerEnum } from "../../common/enum/user.enum.js";


const userSchema = new mongoose.Schema({
  
    firstName:{
    type:String,
    required:true,
    minLength:3,
    maxLength:6,
    trim:true
  },
  lastName: {
    type:String,
    minLength:3,
    maxLength:6,
    trim:true,
    required:true
},
  email: {
    type:String,
    minLength:3,
    required:true,
    unique:true,
    trim:true
  },
  password: {
    type:String,
    required:true,
    minLength:6
},
  age:{
      type:Number,
      required:true,
      min:20,
      max:60
    }
,
    gender:{
        type:String,
        enum:Object.values(genderEnum),
        default:genderEnum.male
    },
    phone:{type:String, required:true},
    profilePictrure: String,
    confirmed: Boolean,
    provider:{
      type:String,
      enum:Object.values(providerEnum),
      default:providerEnum.system
    }
},
{
  timeseries:true,
  strictQuery:true,
  toJSON:{virtuals:true}
})

userSchema.virtual("userName")
.get(function(){
  return this.firstName+ "" + this.lastName
})
.set(function(v){
  const [firstName,lastName]=v.split(" ")
  this.set({firstName,lastName})

})

const userModel= mongoose.models.user || mongoose.model("user",userSchema)

export default userModel