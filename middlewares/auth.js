import { catchAsyncError } from "./catchAsyncError.js";
import jwt from 'jsonwebtoken';
import { User } from "../models/userSchema.js"; 
import {ErrorHandler} from "./error.js"; // maybe error


export const isAuthorized = catchAsyncError(async function(req, res, next){
    const {token} = req.cookies;

    if(!token){
        return next(new ErrorHandler("user not logged in", 400)); // maybe error
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = await User.findById(decoded.id);

    next();
});

