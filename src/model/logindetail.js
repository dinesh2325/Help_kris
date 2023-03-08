const mongoose=require("mongoose")
const validator=require('validator')


//for login detail................
const RegisterSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:3
    },
    email:{
         type:String,
         required:true,
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
        minlength:10
    }
})

//making collection based on schema
const collection=new mongoose.model("Collection1",RegisterSchema)

module.exports=collection;
