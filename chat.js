const cookieParser = require("cookie-parser");
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var uri = "mongodb+srv://vrajesh:vrajesh@cluster0.gwhxuv9.mongodb.net/Users";
var port = process.env.PORT || 9090;
var mongo = mongoose.connection;
mongoose.set("strictQuery",true);
mongoose.connect(uri).then(function(){
    console.log("database connected successfully")
}).catch(function(err){
    console.log("error")
});
app.set("view engine","hbs");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.get("/",(req,res)=>{
    res.render("chat");
});
app.get("/active_account",(req,res)=>{
    res.render("active")
});
app.get("/log_in",(req,res)=>{
    res.render("log")
});
app.post("/sub_active",(req,res)=>{
    var fame = req.body.fname;
    var name = req.body.uname;
    var word = req.body.pword;
    var api = {
        "First Name":fame,
        "Username":name,
        "Password":word
    };
    mongo.collection("data").insertOne(api,function(err){
        if(err){
            res.render("chat")
        }
        else{
            res.render("log");
        }
    })
});
app.set("strictQuery",true);
setInterval(function(){
 app.post("/log_in",(req,res)=>{
    var fame = req.body.uname;
    var pword = req.body.pword;
    mongo.collection("data").findOne({"Username":fame,"Password":pword},(err,data)=>{
        if(err){
            res.render("log");
        }
        else{
            if(data==null){
                res.render("log")
            }
            else{
                res.render("chat_log",{
                    message:data.message,
                    res:data.reply
                });
                res.cookie("User",data.Username);
            }
        }
    })
});
   
},3000)
app.post("/message",(req,res)=>{
    var msg = req.body.txt;
    mongo.collection("data").updateOne({Username:req.cookies.User},{$set:{"message":msg,"reply":""}},function(err,data){
        if(err){
            res.render("chat_log")
        }
        else{
            res.render("chat_log",{
                message:msg
            });
        }
    });
});
app.listen(port,(err)=>{
    if(err){
        console.log("error")
    }
    else{
        console.log("server is running at "+port)
    }
});
