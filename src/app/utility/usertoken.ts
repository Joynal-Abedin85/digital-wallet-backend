import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import {  IUser } from "../modules/user/user.interface";
import { generatetoken, verifytoken } from "./jwt";
import { User } from "../modules/user/user.model";
import httpStatus from "http-status-codes"
import AppError from "../error/apperror";
import { Types } from "mongoose";


export const createusertoken = (user: Partial<IUser>) => {

      if (!user._id || !user.email || !user.role) {
    throw new Error("User data incomplete");
  }

  // _id কে string এ convert করলাম
  const userId = (user._id as Types.ObjectId).toString();
     const jwtpayload: JwtPayload = {
    userId,
    email: user.email,
    role: user.role,
  };
    
        const accesstoken = generatetoken(jwtpayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)
    
        const refreshtoken = generatetoken(jwtpayload,envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRED)

        return {
            accesstoken,
            refreshtoken
        }
}

export const createaccesstokenwithrefresh = async (refreshtoken: string) => {
    const verifedrefreshtoken = verifytoken(refreshtoken,envVars.JWT_REFRESH_SECRET) as JwtPayload


    const isuserexist = await User.findOne({email : verifedrefreshtoken.email})
    
    if(!isuserexist){
        throw new AppError(httpStatus.BAD_REQUEST, "user does not  exist ")
    }

  

    if(isuserexist.isDeleted){
        throw new AppError(httpStatus.BAD_REQUEST, "user is deleted")
    }


    const jwtpayload = {
        userId: isuserexist._id,
        email : isuserexist.email,
        role: isuserexist.role,
    }

    const accesstoken = generatetoken(jwtpayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

    return accesstoken

   
}