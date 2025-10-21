import { Request, Response } from "express";
import { User } from "../user/user.model";
import { Wallet } from "../wallet/wallet.model";

// 🔹 সব ইউজার দেখা
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch users", error });
  }
};

// 🔹 সব ওয়ালেট দেখা
export const getAllWallets = async (req: Request, res: Response) => {
  try {
    const wallets = await Wallet.find().populate("user", "name email role");
    res.status(200).json({ success: true, wallets });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch wallets", error });
  }
};

// 🔹 ওয়ালেট ব্লক / আনব্লক করা
export const updateWalletStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "active" | "blocked"

    if (!["active", "blocked"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const wallet = await Wallet.findByIdAndUpdate(id, { status }, { new: true });
    if (!wallet) {
      return res.status(404).json({ success: false, message: "Wallet not found" });
    }

    res.status(200).json({ success: true, message: `Wallet ${status} successfully`, wallet });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update wallet status", error });
  }
};

// 🔹 এজেন্ট অ্যাপ্রুভ / সাসপেন্ড করা
export const updateAgentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "approved" | "suspended"

    if (!["approved", "suspended"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const agent = await User.findByIdAndUpdate(id, { status }, { new: true });
    if (!agent) {
      return res.status(404).json({ success: false, message: "Agent not found" });
    }

    res.status(200).json({ success: true, message: `Agent ${status} successfully`, agent });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update agent status", error });
  }
};
