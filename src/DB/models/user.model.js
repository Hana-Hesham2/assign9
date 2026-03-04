import mongoose from "mongoose";
import { rolesEnum,genderEnum, providerEnum } from "../../common/enum/user.enum.js";


const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: function () {
      return this.provider !== providerEnum.google;
    },
    minLength: 3,
    maxLength: 20,
    trim: true
  },
  lastName: {
    type: String,
    required: function () {
      return this.provider !== providerEnum.google;
    },
    minLength: 3,
    maxLength: 20,
    trim: true
  },
  email: {
    type: String,
    minLength: 3,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: function () {
      return this.provider !== providerEnum.google;
    },
    minLength: 6,
    trim: true
  },
  age: {
    type: Number,
    function () {
      return this.provider !== providerEnum.google;
    },
    min: 20,
    max: 60
  },
  gender: {
    type: String,
    enum: Object.values(genderEnum),
    default: genderEnum.male
  },
  phone: {
    type: String,
    function () {
      return this.provider !== providerEnum.google;
    }
  },
  profilePicture: String,   
  confirmed: Boolean,
  provider: {
    type: String,
    enum: Object.values(providerEnum),
    default: providerEnum.system
  },
  role:{
    type: String,
    enum: Object.values(rolesEnum),
    default: rolesEnum.user
  }
}, {
  timestamps: true,
  strictQuery: true,
  toJSON: { virtuals: true }
});
userSchema.virtual("userName")
.set(function(v){
  const [firstName,lastName]=v.split(" ")
  this.set({firstName,lastName})
})


const userModel= mongoose.models.user || mongoose.model("user",userSchema)

export default userModel