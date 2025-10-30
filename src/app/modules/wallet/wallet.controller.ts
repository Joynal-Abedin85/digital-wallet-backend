import { Request, Response } from "express";
import * as walletService from "./wallet.service";
import { User } from "../user/user.model";

export const getMyWallet = async (req: any, res: Response) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.user.id).populate("wallet");

    if (!user || !user.wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not accessible",
      });
    }

    const wallet = user.wallet as any;
    wallet.balance += amount;
    await wallet.save();

    res.status(200).json({
      success: true,
      message: "Wallet fetched successfully",
      data: wallet,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
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

    const result = await walletService.sendMoney(
      req.user.id,
      receiverEmail,
      amount
    );

    res.status(200).json({
      success: true,
      message: "Money sent successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
