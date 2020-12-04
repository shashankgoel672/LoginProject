require('dotenv').config();
const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");

require("./db/conn");
const Register = require("./models/registers");

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public" );
const template_path = path.join(__dirname, "../templates/views" );
const partials_path = path.join(__dirname, "../templates/partials" );

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

//console.log(process.env.SECERT_KEY);

app.get("/", (req, res) => {
    res.render("index") 
} );

app.get("/secret", auth , (req, res) => {
    //console.log(`This is Awesome ${req.cookies.jwt}`);
    res.render("secret") 
} );

app.get("/register", (req, res) =>{
    res.render("register");

})

app.get("/login", (req, res) =>{
    res.render("login");

})


app.post("/register", async(req, res) =>{
  try {

   const password = req.body.password;
   const cpassword = req.body.confirmpassword;

   if( password === cpassword){

        const registerEmployee = new Register({
            FirstName: req.body.firstname,
            LastName : req.body.lastname,
            MobileNumber : req.body.MNum,
            Email : req.body.email,
            Password  : req.body.password,
            ReEnterPassword : req.body.confirmpassword,
            Gender : req.body.gender
        })   
         
        console.log("the success part" + registerEmployee);
        
        const token = await registerEmployee.generateAuthToken();
        console.log("the token part" + token);
               
        const registered =  await  registerEmployee.save();
        console.log("the page part" + registered);
        res.status(201).render("index");  

   }else{
       res.send("PASSWORD NOT MATCHED")
   }

  } catch(error){
    res.status(400).send(error);
    console.log("the token part");
   
  }
})

app.post("/login", async(req, res) =>{
    try{

        const email = req.body.email;
        const password = req.body.password;

       const useremail = await Register.findOne({Email:email});

       const isMatch = await bcrypt.compare(password, useremail.Password);
        
       const token = await useremail.generateAuthToken();
       console.log("the token part" + token);
       
       
       if(isMatch){
           res.status(201).render("index");
        }else{
            res.send("Invalid Login Details");
        }
        } 
        catch(error){
            res.status(400).send("Invalid Login Details")
        }
    })

   app.listen(port, () => {
    console.log(`Server is running at port no ${port}`);
})
