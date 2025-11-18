import { Schema, model } from "mongoose";
import { IWallet } from "./wallet.interface";

const walletSchema = new Schema<IWallet>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    balance: { type: Number, default: 50 }, 
    status: { type: String, enum: ["active", "blocked"], default: "active" },
  },
  { timestamps: true }
);

export const Wallet = model<IWallet>("Wallet", walletSchema);


import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["deposit", "withdraw", "send"], required: true },
  amount: { type: Number, required: true },
  receiver: { type: String }, // only for send
  createdAt: { type: Date, default: Date.now }
});

export const Transaction = mongoose.model("Transaction", transactionSchema);

