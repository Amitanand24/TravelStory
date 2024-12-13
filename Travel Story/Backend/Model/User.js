const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const UserSchema=new Schema({
    fullname:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    creatOn:{type:Date, default:Date.now},
});

module.exports=mongoose.model("User",UserSchema);