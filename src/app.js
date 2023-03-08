const express=require("express")
const app=express()
const path=require("path")                                     //for fetching path detail

require("./db/connect")                                        //mongodb connection

// const { urlencoded } = require("express")
// app.use(urlencoded({extended:false}))   

app.use(express.urlencoded({extended:false}))

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



//............server setup.............
app.listen(port,(req,res)=>{
    console.log("server is up")
})