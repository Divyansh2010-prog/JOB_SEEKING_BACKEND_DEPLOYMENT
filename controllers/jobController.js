import { Job } from "../models/jobSchema.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { ErrorHandler } from "../middlewares/error.js";

export const getAllJobs = catchAsyncError(async (req, res, next) => {
    const jobs = await Job.find({expired : false});
    res.status(200).json({
        success : true,
        jobs
    });
});

export const postJob = catchAsyncError(async (req, res, next) => {
    const {role} = req.user;
    if(role === "Job Seeker"){
        return next(new ErrorHandler("Job Seeker is not allowed to access these resources", 400));
    }
    const {title, description, catagory, country, city, location, fixedSalary, salaryFrom, salaryTo} = req.body;

    if(!title || !description || !catagory || !country || !city || !location){
        return next(new ErrorHandler("Please provide full job details", 400));
    }

    if((!salaryFrom || !salaryTo) && !fixedSalary){
        return next(new ErrorHandler("Please provide fixed salary or ranged salary!"));
    }
    if(salaryFrom && salaryTo && fixedSalary){
        return next(new ErrorHandler("Cannot enter fixed salary and ranged salary together!"));
    }

    const postedBy = req.user._id;
    
    const job = new Job({
        title,
        description,
        catagory,
        country,
        city,
        location,
        fixedSalary,
        salaryFrom,
        salaryTo,
        postedBy
    });

    await job.save();

    res.status(200).json({
        success : true,
        message : "Job posted successfully!",
        job
    });
});

export const getmyJobs = catchAsyncError(async (req, res, next) => {
    const {role} = req.user;
    if(role === "Job Seeker"){
        return next(new ErrorHandler("Job Seeker is not allowed to access these resources", 400));
    }

    const myjobs = await Job.find({postedBy : req.user._id, expired : false});

    res.status(200).json({
        success : true,
        myjobs
    });
});

export const updateJob = catchAsyncError(async (req, res, next) => {
    const {role} = req.user;
    if(role === "Job Seeker"){
        return next(new ErrorHandler("Job Seeker is not allowed to access these resources", 400));
    }

    const {id} = req.params;
    let job = await Job.findById(id);

    if(!job){
        return next(new ErrorHandler("Oops, Job not found!", 404));
    }

    if(job.expired){
        await job.deleteOne();
        return next(new ErrorHandler("This job had already expired", 404));
    }

    //console.log(job.postedBy + " " + req.user._id);
    // fault -> in below if condition, value of job.postedBy and req.user._id are same, but then also control is entering in this if condition
    if(job.postedBy.toString() !== req.user._id.toString()){
        return next(new ErrorHandler("You cannot update other's jobs", 400));
    }

    job = await Job.findByIdAndUpdate(id, req.body, {
        new : true,
        runValidators : true,
        useFindAndModify : false
    });

    if(job.expired){
        await job.deleteOne();
    }

    res.status(200).json({
        success : true,
        job,
        message : "Job Updated Successfully!"
    });
});

export const deleteJob = catchAsyncError(async (req, res, next) => {
    const {role} = req.user;
    if(role === "Job Seeker"){
        return next(new ErrorHandler("Job Seeker is not allowed to access these resources", 400));
    }

    const {id} = req.params;
    let job = await Job.findById(id);

    if(!job){
        return next(new ErrorHandler("Oops, Job not found!", 404));
    }

    await job.deleteOne();
    req.status(200).json({
        success : true,
        message : "Job Deleted Successfully!"
    });
});

export const getSinglejob=catchAsyncError(async(req,res,next)=>{
    const {id}=req.params; //id of the job 
    try {
      const job=await Job.findById(id);
      if(!job){
        return next(new ErrorHandler("Job not found",404));
      }
      res.status(200).json({
        success:true,
        job
      })
    } catch (error) {
      return next(new ErrorHandler("INVALID ID/CastError",400));
    }
});