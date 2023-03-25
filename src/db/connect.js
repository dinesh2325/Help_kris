const mongoose=require("mongoose");
mongoose.set('strictQuery', true);


mongoose.connect("mongodb://127.0.0.1:27017/userdata")
.then(()=>{
    console.log("mongodb connected");
})
.catch((error)=>{
    console.log(error);
    
})


