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

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Input check
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    // 1️⃣ User find + Populate wallet
    const user = await User.findOne({ email }).populate("wallet");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 2️⃣ Password check
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 3️⃣ Generate tokens (same as registration)
    const accesstoken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: "7d" }
    );

    const refreshtoken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" }
    );

    // 4️⃣ Return FULL data (same format as registration)
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        tokens: {
          accesstoken,
          refreshtoken,
        },
        user,
        wallet: user.wallet,
      },
    });
  } catch (error: any) {
    console.error("❌ Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};


export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: req.body.name,
        phone: req.body.phone,
      },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Profile update failed",
    });
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

    // 🔑 Password hash correction
    const hashedPassword = await bcryptjs.hash(
      password,
      Number(envVars.BCRYPT_SALT_ROUND) || 10
    );

    const user = await User.create({
      name,
      email,
      password: hashedPassword, // এখানে hash করা password save হচ্ছে
      role: role || "user",
    });

    const wallet = await Wallet.create({
      user: user._id,
      balance: 50,
    });

    user.wallet = wallet._id as Types.ObjectId;
    await user.save();

    // JWT token create
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
