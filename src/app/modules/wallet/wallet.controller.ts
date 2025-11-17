import { Request, Response } from "express";
import * as walletService from "./wallet.service";
import { User } from "../user/user.model";
import { Transaction } from "./wallet.model";

export const getMyWallet = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id).populate("wallet");

    if (!user || !user.wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Wallet fetched successfully",
      data: user.wallet,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const addMoney = async (req: any, res: Response) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid amount" });
    }

    const wallet = await walletService.addMoney(req.user.id, amount);

     // ✅ Transaction log
    await Transaction.create({
      user: req.user.id,
      type: "deposit",
      amount,
    });

    res.status(200).json({
      success: true,
      message: "Money added successfully",
      data: wallet,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const withdrawMoney = async (req: any, res: Response) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid amount" });
    }

    const wallet = await walletService.withdrawMoney(req.user.id, amount);

    // ✅ Transaction log
    await Transaction.create({
      user: req.user.id,
      type: "withdraw",
      amount,
    });

    res.status(200).json({
      success: true,
      message: "Money withdrawn successfully",
      data: wallet,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const sendMoney = async (req: any, res: Response) => {
  try {
    const { amount, receiverEmail } = req.body;

    if (!amount || amount <= 0 || !receiverEmail) {
      return res.status(400).json({
        success: false,
        message: "Amount and receiver email required",
      });
    }

    const receiverUser = await User.findOne({ email: receiverEmail });

    if (!receiverUser) {
      return res.status(404).json({
        success: false,
        message: "Receiver not found",
      });
    }

    const result = await walletService.sendMoney(
      req.user.id,
      receiverEmail,
      amount
    );


    // ✅ Transaction log for sender
    await Transaction.create({
      user: req.user.id,
      type: "send",
      amount,
      receiver: receiverEmail,
    });

    // ✅ Transaction log for receiver (optional)
    await Transaction.create({
      user: receiverUser._id,
      type: "deposit",
      amount,
      receiver: req.user.email, // sender email
    });


    res.status(200).json({
      success: true,
      message: "Money sent successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};


export const getMyTransactions = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const transactions = await Transaction.find({ user: userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to load transactions",
    });
  }
};

