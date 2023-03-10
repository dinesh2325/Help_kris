const express=require("express")
const app=express()
const path=require("path")                                     //for fetching path detail
const session=require("express-session");



app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))  //session middleware


require("./db/connect")                                        //mongodb connection
const collection =require("./model/logindetail")               //user login detail

const LendItem =require("./model/lending")            //lendingstore 


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
app.get("/",function(req,res){
    res.render("home");
})



app.get("/signup",function(req,res){
    res.render("signup");
})


app.post("/signup",async(req,res)=>{
        const data={
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            phone:req.body.phone
            
        }
        await collection.insertMany([data])
        
        res.render("login");
 
    })
    


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
// landing page
app.get("/profile/:id/lend",async(req,res)=>{
    try{
        const userData=await collection.findById({_id:req.params.id})
        res.render("lend",{user:userData});
    }
    catch(err){
        res.render(err);
    }
   
})





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
        res.render("home")
  
})

app.get("/:id/userstore",async(req,res)=>{
   
     try{
        const check=await LendItem.find({sellerid:req.params.id});
        res.render("userstore",{record:check});
     }
  catch{
    console.log("not")
  }
})


app.get("/store",async(req,res)=>{
    try{
        const check=await LendItem.find({});
        res.render("store",{record:check});
     }
  catch{
    console.log("not")
  }
    
})















//............server setup.............
app.listen(port,(req,res)=>{
    console.log("server is up")
})

