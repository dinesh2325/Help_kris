const express=require("express")
const app=express()
const path=require("path")                                     //for fetching path detail
const session=require("express-session");





app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))  //session middleware




require("./db/connect")                                        //mongodb connection
const collection =require("./model/logindetail")               //user login detail
const LendItem =require("./model/lending")            //lendingstore 
const BorrowItem =require("./model/borrow.js")      //borrowed items




app.use(express.json())                                     //puts the parsed data in req.body          
app.use(express.urlencoded({extended:true}))                     //as a bodyparser

const port=process.env.PORT || 3000
const ejs=require("ejs")                                       //for register partial method


const staticpath=path.join(__dirname,"../public")              //used to join
const templatepath=path.join(__dirname,"./templates/views")
const partialpath=path.join(__dirname,"./templates/partials")
      



app.use(express.static(staticpath))                //these code are written to connect javascript, bootstrap, jquery 
app.use('/css',express.static(path.join(__dirname,"../node_modules/bootstrap/dist/css")))
app.use('/js',express.static(path.join(__dirname,"../node_modules/bootstrap/dist/js")))
app.use('/jq',express.static(path.join(__dirname,"../node_modules/jquery/dist")))

app.set("view engine","ejs")
app.set("views",templatepath)





//.........routing ...............
//home
app.get("/",function(req,res){                     
    res.render("home");
})


//rendering signup page
app.get("/signup",function(req,res){
    res.render("signup",{success:''});
})


app.post("/signup",async(req,res)=>{
    
    const data={
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        phone:req.body.phone
    }
    
     const userExist = await collection.exists({ email:req.body.email });

     if (userExist){
        return res.render("signup",{success:'email is already in use'});            //user already exist or not 
     }
        


    await collection.insertMany([data])       
    res.render("login",{message:''});

      
   
    })
    

//login page get request
app.get("/login",function(req,res){
    res.render("login",{message:''});
})


app.get("/home",function(req,res){
    res.render("home");
})

app.post("/login",async(req,res)=>{
    try{
        const check=await collection.findOne({email:req.body.email})
        req.session.user_id=check._id;
      
        if(check.password===req.body.password)
        {
            try{
                // const userData=await collection.findById({_id:req.session.user_id})
                res.render("home2",{user:check});
            }
            catch(err){
               return  res.render("login",{message:'invalid user data'});
            }
        }
        else{
             return res.render("login",{message:'invalid user data'})
        }
    } 
    catch{
        res.render("login",{message:'invalid user data'});
    }
})



// app.get("/home2",(req,res)=>{
        
//         res.render("home2");

// })



//render profile page 
app.get("/profile/:id",async(req,res)=>{
    try{
        const userData=await collection.findById({_id:req.params.id})   // id home2.ejs wale page se utaya hai, and then use database wale id se comapre karke find kiya hai 
        res.render("profile",{user:userData});              
        
    }                                                  
    catch(err){
        res.render(err);
    }
})


//for updating user detail in profile page
app.post("/profile/:id/update", async(req,res)=>{
    // try{        

    const userData=await collection.findById({_id:req.params.id});
    var newname,newphone,newhostel,newregistration,newgender,newyear;
    if(req.body.name===""){
         newname=userData.name;
    }
    else newname=req.body.name;


    
    if(req.body.Phone===""){
        newphone=userData.phone;
    }
    else newphone=req.body.Phone;


    
    if(req.body.Hostel===""){
        newhostel=userData.Hostel;
    }
    else newhostel=req.body.Hostel;


    
    if(req.body.Registration===""){
        newregistration=userData.Registration;
    }
    else newregistration=req.body.Registration;
    



    if(req.body.Gender===""){
        var newgender=userData.Gender;
    }
    else newgender=req.body.Gender;

    if(req.body.Year===""){
        var newyear=userData.Year;
    }
    else newyear=req.body.Year;





                 
    const result=await collection.findOneAndUpdate({ "_id": req.params.id }, { "$set": { "name": newname, "phone":newphone, "Registration":newregistration, "Year":newyear,
           "Hostel":newhostel,
            "Gender":newgender}});

         
            res.redirect('back'); 
               
           
        
         
    //     }
    // catch(err){
    //     console.log("you did it");
    //     res.render();
    // }
})



// ..............................
// lending page (profile)
app.get("/profile/:id/lend",async(req,res)=>{
    try{
        const userData=await collection.findById({_id:req.params.id})
        res.render("lend",{user:userData});
    }
    catch(err){
        res.render(err);
    }
   
})




//lending a items (form for lending)
app.post("/profile/:id/lend",async(req,res)=>{
  
    const search =await collection.findById({_id:req.body.userid});
    if(search){
        const data={
            name:req.body.name,
            price:req.body.price,
            time:req.body.time,
            sellername:search.name,
            sellerphone:search.phone,
            sellerid:search._id,
            status:"Available",
            category:req.body.cat,
        }
        
        await LendItem.insertMany([data])
        res.render("home2",{user:search});       }
    else{
        console.log("not found");
    }
  

})


//user lendings
app.get("/:id/userstore",async(req,res)=>{
   
     try{
        const check=await LendItem.find({sellerid:req.params.id});
        res.render("userstore",{record:check});
     }
  catch{
    console.log("not")
  }
})


//store for all items
app.get("/profile/:id/store",async(req,res)=>{
    try{
             const check=await LendItem.find({});
    
            const buyerdata=await collection.findById({_id:req.params.id}); 
            res.render("store",{record:check,user:buyerdata});
     }
  catch{
    console.log("not")
  }
    
})


//item detail for buying item 
app.get("/:objectid/:buyerid/buy",async(req,res)=>{
    try{
        const check=await LendItem.findById({_id:req.params.objectid});
    
        const buyerdata=await collection.findById({_id:req.params.buyerid}); 
        res.render("borrowpage",{record:check,user:buyerdata});
    }
    catch(err)
    {
        console.log("not found")
    }
})




//buying items from lend store
app.get("/:userid/:objectid/purchased",async(req,res)=>{
   try{
    const userdata=await collection.findById({_id:req.params.userid})
    if(userdata)
    {
        try{
            const objectdata=await LendItem.findById({_id:req.params.objectid})

            const data={
                name:objectdata.name,
                price:objectdata.price,
                time:objectdata.time,
                sellername:objectdata.sellername,
                sellerphone:objectdata.sellerphone,
                sellerid:objectdata.sellerid,
                status:"not available",
                buyerid:userdata._id,
               

            }
            await BorrowItem.insertMany([data])

        }
        catch(err){
                console.log(err)
        }


      
    }
   }     
   catch(err){
    console.log(err)
   } 

   const filter = {_id:req.params.objectid };
   const update = { status:"Not Available" };
   const doc = await LendItem.findOneAndUpdate(filter, update, {
    new: true
  });

//    async function run() {
//     await LendItem.deleteOne({ _id:req.params.objectid});
//   }
  
//   run();
  const userdata=await collection.findById({_id:req.params.userid})
  res.render("home2",{user:userdata})
})



//displaying borrowed itme profile
app.get("/profile/:id/borrowstore",async(req,res)=>{
    try{
        
        const check=await BorrowItem.find({buyerid:req.params.id});
        if(check)
        {
            const buyerdata=await collection.findById({_id:req.params.id}); 
            res.render("borrowstore",{record:check,user:buyerdata});
        }
       else{
        res.send("no borrowings")
       }
     }
  catch{
    console.log("not")
  }
    
})



//for returning item to lender
app.get("/:id/:name/borrowstore/return",async(req,res)=>{
    
    const object=await BorrowItem.findOne({ name:req.params.name, buyerid:req.params.id });
    if(object)
    {
        try{
            const filter = {name:req.params.name };
            const update = { status:"Available" };
            const doc = await LendItem.findOneAndUpdate(filter, update, {
            new: true
           });
            
        }
        catch(err){
                console.log(err);
        }

        
        async function run() {
            // Delete the document by its 
            await BorrowItem.deleteOne({name:req.params.name});
          }     
          run();

       

          res.redirect('back');                                                                            //used to refresh the page
    }
})

//displaying category
app.get("/category/:userid/:categoryname",async(req,res)=>{
    try{
           const data=await LendItem.find({category:req.params.categoryname})  
           const buyerdata=await collection.findById({_id:req.params.userid}); 
           res.render("category",{record:data,user:buyerdata,cat:req.params.categoryname});
    }
    catch(err){
        console.log(err);
    }
    
})


//for chat option
const http=require('http').createServer(app)
app.get("/localhost:5000",(req,res)=>{
    res.sendFile(__dirname+'/index.html');
})

//socket
const io=require('socket.io')(http)
io.on('connection',(socket)=>{
    console.log("socket connected..........")
    socket.on('message',(msg)=>{
        socket.broadcast.emit('message',msg)
    })
})


http.listen(5000,()=>{
    console.log("server is up")
})



//............server setup.............
app.listen(3000,(req,res)=>{
    console.log("server is up")
})

