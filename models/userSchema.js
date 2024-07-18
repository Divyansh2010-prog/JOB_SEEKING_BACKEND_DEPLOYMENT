import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "please provide you name"],
        minLength : [3, "Name must contain atleast 3 characters"],
        maxLength : [30, "Name cannot exceed 30 characters"]
    },
    email: {
        type: String,
        required: [true, "please provide your email"],
        validate: [validator.isEmail, "Please provide a valid Email"]
    },
    phone: {
        type: Number,
        required : [true, "please provide your phone number."],
    },
    password: {
        type : String,
        required : [true, "please provide you Password"],
        minLength : [8, "Password must contain atleast 8 characters"],
        maxLength : [32, "Password cannot exceed 30 characters"],
        select : false
    },
    role: {
        type : String,
        required: [true, "please provide your Role"],
        enum: ["Job Seeker", "Employer"]
    },
    createdAt: {
        type : Date,
        default : Date.now
    }
});

// Hashing the password
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){ // change 54:33
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// Comparing password with hashed password (user hash me to password enter nhi karega)
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

// Creating a jwt token for authorization
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id : this._id}, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE
    });
}

export const User = mongoose.model("user", userSchema);


