const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



const employeeSchema = new mongoose.Schema({
    FirstName: {
        type : String,
        required: true
    },
    LastName: {
        type : String,
        required: true
    },
    MobileNumber:{
        type : Number,
        required: true,
        unique: true
    },
    Email: {
        type : String,
        required: true,
        unique: true
    },
    Password: {
        type : String,
        required: true
    },
    ReEnterPassword:{
        type : String,
        required: true
    },
    Gender: {
        type : String,
        required: true
    },
    tokens:[{
        token:{
        type : String,
        required: true
        }
    }]
})

employeeSchema.methods.generateAuthToken = async function(){
    try{
        const token = jwt.sign({_id:this._id.toString()},process.env.SECERT_KEY);
        this.tokens = this.tokens.concat({token:token})
        await this.save();        
        return token;

    }catch(error){
        res.send("the error part" + error);
        console.log("the error part" + error);
    }
}

employeeSchema.pre("save", async function(next) {

    if(this.isModified("Password")){
    this.Password = await bcrypt.hash(this.Password, 10 );
    this.ReEnterPassword = await bcrypt.hash(this.ReEnterPassword, 10 );
}
    
    next();
})


const Register = new mongoose.model("Register", employeeSchema);

module.exports = Register;
