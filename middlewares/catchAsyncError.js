export const catchAsyncError = function(theFunction){
    return function(req, res, next){
        Promise.resolve(theFunction(req, res, next)).catch(next);// next() => next 1 : 02 : sec
    }
}