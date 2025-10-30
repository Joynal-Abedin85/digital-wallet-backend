import { Document, Types } from "mongoose";

export interface IWallet extends Document {
  user: Types.ObjectId;    
  balance: number; 
  status: "active" | "blocked"; 
  createdAt?: Date;
  updatedAt?: Date;
}
