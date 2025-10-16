export const asyncHandler = (func) => (req,res,next) => {
    Promise.resolve(func(req,res,next)).catch((e)=>next(e)); 
}

class ErrorHandler extends Error{
    constructor(message="Something went wrong",statusCode,errors=[],stack=""){
        super(message);
        this.message = message;
        this.statusCode = statusCode
        this.errors = errors;
        this.data = null;
        this.success = false
        if(stack){
            this.stack = stack
        }
        else{
            Error.captureStackTrace(this,this.constructor);
        }
    }
}

export const errorHandler = ErrorHandler;