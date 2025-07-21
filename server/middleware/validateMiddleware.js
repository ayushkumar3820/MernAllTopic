import {z} from "zod";

export const Validate=(schema)=(err,req,res,next)=>{
    try{
        schema.parse(req.body);
    }
    catch(error){
        next(error);
    }

}