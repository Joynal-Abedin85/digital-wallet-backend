import { Request, Response } from "express";
import { User } from "./user.model";
import { createUserValidation } from "./user.validation";
import bcrypt from "bcrypt";
import { generatetoken } from "../../utility/jwt";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { envVars } from "../../config/env";
import { createusertoken } from "../../utility/usertoken";
import { Wallet } from "../wallet/wallet.model";
import { Types } from "mongoose";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch users", error });
  }
};

export const getMyProfile = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch profile", error });
  }
};




export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, Number(envVars.BCRYPT_SALT_ROUND) || 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    // 🏦 Create wallet automatically for this user
    const wallet = await Wallet.create({
      user: user._id,
      balance: 50, 
    });

    user.wallet = wallet?._id as Types.ObjectId;
    await user.save();

    // 🎟️ Generate token
    const tokens = createusertoken(user);

    res.status(201).json({
      success: true,
      message: "User registered successfully with wallet",
      data: {
        user,
        wallet,
        tokens,
      },
    });
  } catch (error: any) {
    console.error("Register Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to register user",
      error: error.message,
    });
  }
};

export const blockUnblockUser = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (typeof status !== "boolean") {
      return res
        .status(400)
        .json({ success: false, message: "Status must be a boolean value" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: status },
      { new: true }
    );

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({
      success: true,
      message: `User ${status ? "unblocked" : "blocked"} successfully`,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update user", error });
  }
};

export const approveAgent = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!user)
      return res.status(404).json({ success: false, message: "Agent not found" });

    res.status(200).json({
      success: true,
      message: "Agent approved successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to approve agent", error });
  }
};
