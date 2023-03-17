const mongoose=require("mongoose")
//for object detail................
const BorrowingSchema=new mongoose.Schema({
  
    name:String,
    price:Number,
    time:Number,
    sellername:String,
    sellerphone:String,
    sellerid:String,
    buyerid:String
})

//making collection based on schema
const BorrowItem=new mongoose.model("Collection3",BorrowingSchema)

module.exports=BorrowItem;
