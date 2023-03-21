const mongoose=require("mongoose")
const validator=require('validator')
const encrypt=require("mongoose-encryption")

//for login detail................
const RegisterSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
      
    },
    email:{
         type:String,
         required:true,
         unique:true,
         validator(value){
            if(!validator.isEmail(value))
            {
                throw new Error("invalid")
            }
         }
    },
    password:{
        type:String,
        required:true
    },
    phone:
    {
        type:String,
        required:true,
       
    }
});



//making collection based on schema
const collection=new mongoose.model("Collection1",RegisterSchema)

module.exports=collection;
