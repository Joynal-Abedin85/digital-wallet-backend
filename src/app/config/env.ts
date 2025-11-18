import  dotenv from "dotenv"

dotenv.config()

interface EnvConfig {
    PORT: string,
    DB_URL: string,
    NODE_ENV: "development" | "production",
    BCRYPT_SALT_ROUND : string
    JWT_ACCESS_EXPIRES: string
    JWT_ACCESS_SECRET:string
    JWT_REFRESH_SECRET: string
    JWT_REFRESH_EXPIRED: string
}


const loadEnvVariables = () : EnvConfig => {
    const requiredEnvVariables : string[] = ["PORT", "DB_URL", "NODE_ENV","JWT_REFRESH_EXPIRED","JWT_REFRESH_SECRET","BCRYPT_SALT_ROUND", "JWT_ACCESS_EXPIRES","JWT_ACCESS_SECRET", ]
    requiredEnvVariables.forEach(key => {
        if(!process.env[key]) {
            throw new Error(`missing required environment variables ${key}`)
        }
    })
    return  {
    PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL!,
    NODE_ENV:  process.env.NODE_ENV as "development" | "production",
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    JWT_REFRESH_EXPIRED: process.env.JWT_REFRESH_EXPIRED as string,
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
    JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
   }
}

export const envVars = loadEnvVariables()