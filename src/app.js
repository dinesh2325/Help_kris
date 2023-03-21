const express=require("express")
const app=express()
const path=require("path")                                     //for fetching path detail
const session=require("express-session");



app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))  //session middleware




require("./db/connect")                                        //mongodb connection
const collection =require("./model/logindetail")               //user login detail
const LendItem =require("./model/lending")            //lendingstore 
const BorrowItem =require("./model/borrow.js")      //borrowed items




app.use(express.json())                                        //as a bodyparser
app.use(express.urlencoded({extended:true}))                  

const port=process.env.PORT || 3000
const ejs=require("ejs")                                       //for register partial method


const staticpath=path.join(__dirname,"../public")
const templatepath=path.join(__dirname,"./templates/views")
const partialpath=path.join(__dirname,"./templates/partials")
      



app.use(express.static(staticpath))
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
    res.render("signup");
})


app.post("/signup",async(req,res)=>{
        const userexist=await collection.findOne({email:req.body.email});
        const data={
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            phone:req.body.phone
            
        }
        await collection.insertMany([data])
        
        res.render("home");
 
    })
    

//login page get request
app.get("/login",function(req,res){
    res.render("login");
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
                const userData=await collection.findById({_id:req.session.user_id})
                res.render("home2",{user:userData});
            }
            catch(err){
                res.render(err);
            }
        }
        else{
            res.send("invalid")
        }
    } 
    catch{
        res.render("wrong detail");
    }
})



app.get("/home2",(req,res)=>{
        
        res.render("home2");

})

//render profile page
app.get("/profile/:id",async(req,res)=>{
    try{
        const userData=await collection.findById({_id:req.params.id})
        res.render("profile",{user:userData});
    }
    catch(err){
        res.render(err);
    }
})

// ..............................
// lending page
app.get("/profile/:id/lend",async(req,res)=>{
    try{
        const userData=await collection.findById({_id:req.params.id})
        res.render("lend",{user:userData});
    }
    catch(err){
        res.render(err);
    }
   
})




//lending a items
app.post("/profile/:id/lend",async(req,res)=>{
    
        const data={
            name:req.body.name,
            price:req.body.price,
            time:req.body.time,
            sellername:req.body.username,
            sellerphone:req.body.userphone,
            sellerid:req.body.userid
        }
        await LendItem.insertMany([data])
        var redirectTo = req.session.redirectTo || '/';
        delete req.session.redirectTo;
        // is authenticated ?
        res.redirect(redirectTo);

     
  
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



app.get("/:objectid/:buyerid/buy",async(req,res)=>{
    try{
        const check=await LendItem.findById({_id:req.params.objectid});
    
        const borrowdata=await BorrowItem.findById({_id:req.params.buyerid}); 
        res.render("borrowpage",{record:check,user:buyerdata});
    }
    catch(err)
    {
        console.log("not found")
    }
})


//buying items user
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
                buyerid:userdata._id

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
   async function run() {
    await LendItem.deleteOne({ _id:req.params.objectid});
  }
  
  run();
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
           
            const data={
                name:object.name,
                price:object.price,
                time:object.time,
                sellername:object.sellername,
                sellerphone:object.sellerphone,
                sellerid:object.sellerid,
              
            }
            await LendItem.insertMany([data]);
            
        }
        catch(err){
                console.log(err);
        }
        async function run() {
            // Delete the document by its _id
            await BorrowItem.deleteOne({name:req.params.name});
          }     
          run();
          res.redirect('back');                                                                            //used to refresh the page
    }
})


app.get("/search",()=>{
    res.render("search");
})




//for chat option
const http=require('http').createServer(app)
app.get("/localhost:5000/chat",(req,res)=>{
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

