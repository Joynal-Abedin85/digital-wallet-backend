import {Server} from "http"
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";

let server: Server

const startserver = async () => {
    try {
        await mongoose.connect(envVars.DB_URL)

        console.log("connect to db")

        server = app.listen(5000, () => {
            console.log("server is lestening to port 5000")
        })
    } catch (error) {
        console.log(error)
        
    }
}

startserver()


process.on("unhandledRejection", () => {
  console.log("unhandled rejection detected... server shutting down...");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

