import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

export const generatetoken = (payload: JwtPayload, secret: string, expiresIn: string) => {
    const token = jwt.sign(payload, secret, {
        expiresIn
    } as SignOptions)

    return token 
}

export const verifytoken = (token : string, secret: string)=> {
    const verifiedtoken = jwt.verify(token, secret)

    return verifiedtoken
}