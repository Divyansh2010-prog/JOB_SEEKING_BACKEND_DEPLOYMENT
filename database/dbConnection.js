import mongoose from 'mongoose'
import validator from 'validator'

export const dbConnection = function(){
    mongoose.connect(process.env.MONGO_URL, {
        dbName: "MERN_STACK_JOB_SEEKING"
    }).then(function(){
        console.log("Connected to database!");
    }).catch(function(err){
        console.log(`Error occured while connecting to database : ${err}`);
    });
};