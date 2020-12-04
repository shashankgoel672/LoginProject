const jwt = require("jsonwebtoken");
const Register = require("../models/registers");


const auth = async (res, req, next) => {
   try{

    const token = req.cookies.jwt;
    const verifyUser = jwt.verify(token, process.env.SECERT_KEY);
    console.log(verifyUser);

const user = Register.findOne({_id:verifyUser._id});
console.log(user);
    next();


   }catch(error){
       res.status(401).send(error);

   } 
}

module.exports = auth;