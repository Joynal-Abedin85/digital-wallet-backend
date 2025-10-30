import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { IUser } from "./user.interface";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "agent", "admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "blocked", "pending"],
      default: function () {
        return this.role === "agent" ? "pending" : "active";
      },
    },
    isApproved: {
      type: Boolean,
      default: false, 
    },
    wallet: { type: Schema.Types.ObjectId, ref: "Wallet" },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false, 
    },
    verificationToken: {
      type: String,
    },
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword: string) {
  return bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model<IUser>("User", userSchema);
