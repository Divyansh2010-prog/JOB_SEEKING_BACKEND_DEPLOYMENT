import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { ErrorHandler } from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { sendToken } from "../utils/jwtToken.js";

export const register = catchAsyncError(async function(req, res, next){
    const {name, email, phone, password, role} = req.body;

    if(!name || !email || !phone || !password || !role){
        return next(new ErrorHandler("please fill full registration form!"));
    }

    const isEmail = await User.findOne({email : email});
    if(isEmail){
        return next(new ErrorHandler("Email already exists!"));
    }

    const user = new User({
        name: name,
        email: email,
        phone: phone,
        password: password,
        role: role
    });

    await user.save();
    
    sendToken(user, 200, "User created and logged in successfully!", res);
});

export const login = catchAsyncError(async (req, res, next) => {
    const {email, password, role} = req.body;

    if(!email || !password || !role){
        return next(new ErrorHandler("Please provide Email, Password and role", 400));
    }

    const user = await User.findOne({email : email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid Email or Password", 400));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Password", 400));
    }

    if(role !== user.role){
        return next(new ErrorHandler("This user doesn't exist for this role", 400));
    }

    sendToken(user, 200, "User logged in successfully!", res);
});

export const logout = catchAsyncError(async (req, res, next) => {
    res.status(201).cookie("token", "", {
        httpOnly : true,
        expires : new Date(Date.now()),
        secure:true,
        sameSite:"None",
    }).json({
        success: true,
        message : "User logged out successfully!"
    });
});

export const getUser = catchAsyncError((req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success : true,
        user
    });
});