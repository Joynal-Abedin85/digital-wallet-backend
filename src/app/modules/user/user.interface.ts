import { Document, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "agent" | "admin";
  status: "active" | "blocked" | "pending";
  isApproved: boolean;
  wallet?: Types.ObjectId;
  emailVerified?: boolean; 
  isDeleted?: boolean;
  verificationToken?: string; 
  createdAt?: Date;
  updatedAt?: Date;

  comparePassword(enteredPassword: string): Promise<boolean>;
}
