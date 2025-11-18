"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.approveAgent = exports.blockUnblockUser = exports.registerUser = exports.updateProfile = exports.loginUser = exports.getMyProfile = exports.getAllUsers = void 0;
const user_model_1 = require("./user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
const usertoken_1 = require("../../utility/usertoken");
const wallet_model_1 = require("../wallet/wallet.model");
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.User.find().select("-password");
        res.status(200).json({ success: true, data: users });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch users", error });
    }
});
exports.getAllUsers = getAllUsers;
const getMyProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(req.user.id).select("-password");
        if (!user)
            return res.status(404).json({ success: false, message: "User not found" });
        res.status(200).json({ success: true, data: user });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch profile", error });
    }
});
exports.getMyProfile = getMyProfile;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const user = yield user_model_1.User.findOne({ email }).populate("wallet");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        // 2️⃣ Password check
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }
        // 3️⃣ Generate tokens (same as registration)
        const accesstoken = jsonwebtoken_1.default.sign({
            userId: user._id,
            email: user.email,
            role: user.role,
        }, process.env.JWT_ACCESS_SECRET, { expiresIn: "7d" });
        const refreshtoken = jsonwebtoken_1.default.sign({
            userId: user._id,
            email: user.email,
            role: user.role,
        }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
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
    }
    catch (error) {
        console.error("❌ Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Login failed",
            error: error.message,
        });
    }
});
exports.loginUser = loginUser;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const updatedUser = yield user_model_1.User.findByIdAndUpdate(userId, {
            name: req.body.name,
            phone: req.body.phone,
        }, { new: true }).select("-password");
        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedUser,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Profile update failed",
        });
    }
});
exports.updateProfile = updateProfile;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = yield user_model_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }
        // 🔑 Password hash correction
        const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND) || 10);
        const user = yield user_model_1.User.create({
            name,
            email,
            password: hashedPassword, // এখানে hash করা password save হচ্ছে
            role: role || "user",
        });
        const wallet = yield wallet_model_1.Wallet.create({
            user: user._id,
            balance: 50,
        });
        user.wallet = wallet._id;
        yield user.save();
        // JWT token create
        const tokens = (0, usertoken_1.createusertoken)(user);
        res.status(201).json({
            success: true,
            message: "User registered successfully with wallet",
            data: {
                user,
                wallet,
                tokens,
            },
        });
    }
    catch (error) {
        console.error("Register Error:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to register user",
            error: error.message,
        });
    }
});
exports.registerUser = registerUser;
const blockUnblockUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.body;
        if (typeof status !== "boolean") {
            return res
                .status(400)
                .json({ success: false, message: "Status must be a boolean value" });
        }
        const user = yield user_model_1.User.findByIdAndUpdate(req.params.id, { isActive: status }, { new: true });
        if (!user)
            return res.status(404).json({ success: false, message: "User not found" });
        res.status(200).json({
            success: true,
            message: `User ${status ? "unblocked" : "blocked"} successfully`,
            data: user,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to update user", error });
    }
});
exports.blockUnblockUser = blockUnblockUser;
const approveAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
        if (!user)
            return res.status(404).json({ success: false, message: "Agent not found" });
        res.status(200).json({
            success: true,
            message: "Agent approved successfully",
            data: user,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to approve agent", error });
    }
});
exports.approveAgent = approveAgent;
