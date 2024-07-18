import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title : {
        type : String,
        required : [true, "please provide job title"],
        minlength : [3, "Job title must contain atleast 3 characters"],
        maxlength : [50, "Job title must contain atmost 50 characters"]
    },
    description : {
        type : String,
        required : [true, "please provide job description"],
        minlength : [3, "Job title must contain atleast 3 characters"],
        maxlength : [350, "Job title must contain atmost 350 characters"]
    },
    catagory : {
        type : String,
        required : [true, "Job catagory is required"],
    },
    country : {
        type : String,
        required : [true, "Job country is required"],
    },
    city : {
        type : String,
        required : [true, "Job city is required"],
    },
    location : {
        type : String,
        required : [true, "Please provide exact location"]
    },
    fixedSalary : {
        type : Number,
        minlength : [4, "Fixed Salary must contain atleast 4 digits"],
        maxlength : [9, "Fixed Salary cannot exceed 9 digits"]
    },
    salaryFrom : {
        type : Number,
        minlength : [4, "Salary from must contain atleast 4 digits"],
        maxlength : [9, "Salary from cannot exceed 9 digits"]
    },
    salaryTo : {
        type : Number,
        minlength : [4, "Salary to must contain atleast 4 digits"],
        maxlength : [9, "Salary to cannot exceed 9 digits"]
    },
    expired : {
        type : Boolean,
        default : false
    },
    jobPostedOn : {
        type : Date,
        default : Date.now()
    },
    postedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
        required : true
    }
});

export const Job = mongoose.model("job", jobSchema);