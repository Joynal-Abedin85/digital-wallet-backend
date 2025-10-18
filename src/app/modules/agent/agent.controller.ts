// src/controllers/agent.controller.ts
import { Request, Response } from "express";
import mongoose from "mongoose";
import { Wallet } from "../wallet/wallet.model";
import { Commission } from "./agent.model";

export const cashIn = async (req: any, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, amount } = req.body;
    const agentId = req.user.id;

    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid input" });
    }

    const userWallet = await Wallet.findOne({ user: userId }).session(session);
    if (!userWallet || userWallet.status !== "active") {
      return res.status(404).json({ success: false, message: "User wallet not accessible" });
    }

    // Wallet update
    userWallet.balance += amount;
    await userWallet.save({ session });

    // কমিশন ক্যালকুলেট (e.g. 1%)
    const commissionAmount = amount * 0.01;
    await Commission.create([{ agent: agentId, amount: commissionAmount, type: "cash-in" }], { session });

    await session.commitTransaction();
    res.status(200).json({ success: true, message: "Cash-in successful", commission: commissionAmount });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ success: false, message: "Cash-in failed", error });
  } finally {
    session.endSession();
  }
};

export const cashOut = async (req: any, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, amount } = req.body;
    const agentId = req.user.id;

    if (!userId || !amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid input" });
    }

    const userWallet = await Wallet.findOne({ user: userId }).session(session);
    if (!userWallet || userWallet.balance < amount) {
      return res.status(400).json({ success: false, message: "Insufficient balance" });
    }

    // Wallet update
    userWallet.balance -= amount;
    await userWallet.save({ session });

    // কমিশন ক্যালকুলেট (e.g. 1%)
    const commissionAmount = amount * 0.01;
    await Commission.create([{ agent: agentId, amount: commissionAmount, type: "cash-out" }], { session });

    await session.commitTransaction();
    res.status(200).json({ success: true, message: "Cash-out successful", commission: commissionAmount });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ success: false, message: "Cash-out failed", error });
  } finally {
    session.endSession();
  }
};

export const getCommissionHistory = async (req: any, res: Response) => {
  try {
    const agentId = req.user.id;
    const commissions = await Commission.find({ agent: agentId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, commissions });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching commissions", error });
  }
};
