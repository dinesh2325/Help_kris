const mongoose=require("mongoose")
//for object detail................
const LendingSchema=new mongoose.Schema({
  
    name:{
        type:String,
        required:true
    },
    price:Number,
    time:Date,
    sellername:String,
    sellerphone:String,
    sellerid:String,
    status:String,
    category:String,
    
})

//making collection based on schema
const LendItem=new mongoose.model("Collection2",LendingSchema)

module.exports=LendItem;
