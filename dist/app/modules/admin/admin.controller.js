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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAgents = exports.updateAdminProfile = exports.getAllTransactions = exports.getAdminOverview = exports.updateAgentStatus = exports.updateWalletStatus = exports.getAllWallets = exports.getAllUsers = void 0;
const user_model_1 = require("../user/user.model");
const wallet_model_1 = require("../wallet/wallet.model");
const agent_model_1 = require("../agent/agent.model");
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.User.find().select("-password");
        res.status(200).json({ success: true, users });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch users", error });
    }
});
exports.getAllUsers = getAllUsers;
const getAllWallets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wallets = yield wallet_model_1.Wallet.find().populate("user", "name email role");
        res.status(200).json({ success: true, wallets });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch wallets", error });
    }
});
exports.getAllWallets = getAllWallets;
const updateWalletStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!["active", "blocked"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status value" });
        }
        const wallet = yield wallet_model_1.Wallet.findByIdAndUpdate(id, { status }, { new: true });
        if (!wallet) {
            return res.status(404).json({ success: false, message: "Wallet not found" });
        }
        res.status(200).json({ success: true, message: `Wallet ${status} successfully`, wallet });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to update wallet status", error });
    }
});
exports.updateWalletStatus = updateWalletStatus;
const updateAgentStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!["approved", "suspended"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status value" });
        }
        const agent = yield user_model_1.User.findByIdAndUpdate(id, { status }, { new: true });
        if (!agent) {
            return res.status(404).json({ success: false, message: "Agent not found" });
        }
        res.status(200).json({ success: true, message: `Agent ${status} successfully`, agent });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to update agent status", error });
    }
});
exports.updateAgentStatus = updateAgentStatus;
const getAdminOverview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const totalUsers = yield user_model_1.User.countDocuments({ role: "user" });
        const totalAgents = yield user_model_1.User.countDocuments({ role: "agent" });
        const totalTransactions = yield agent_model_1.Commission.countDocuments();
        const transactionVolumeAgg = yield agent_model_1.Commission.aggregate([
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);
        const totalVolume = ((_a = transactionVolumeAgg[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
        res.status(200).json({
            success: true,
            overview: {
                totalUsers,
                totalAgents,
                totalTransactions,
                totalVolume,
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error fetching overview", error });
    }
});
exports.getAdminOverview = getAdminOverview;
const getAllTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10, type, userId, agentId } = req.query;
        const filter = {};
        if (type)
            filter.type = type;
        if (userId)
            filter.user = userId;
        if (agentId)
            filter.agent = agentId;
        const transactions = yield agent_model_1.Commission.find(filter)
            .sort({ createdAt: -1 })
            .skip((+page - 1) * +limit)
            .limit(+limit);
        const usertran = yield wallet_model_1.Transaction.find();
        const total = yield agent_model_1.Commission.countDocuments(filter);
        res.status(200).json({ success: true, transactions, total, usertran });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch transactions", error });
    }
});
exports.getAllTransactions = getAllTransactions;
const updateAdminProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // optional chaining safety
        if (!adminId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const { name, email, password } = req.body;
        const updateData = {};
        if (name)
            updateData.name = name;
        if (email)
            updateData.email = email;
        if (password)
            updateData.password = password; // hash if necessary
        const updatedAdmin = yield user_model_1.User.findByIdAndUpdate(adminId, updateData, { new: true }).select("-password");
        res.status(200).json({ success: true, admin: updatedAdmin });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to update profile", error });
    }
});
exports.updateAdminProfile = updateAdminProfile;
const getAllAgents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const agents = yield user_model_1.User.find({ role: "agent" }).select("-password");
        res.status(200).json({ success: true, agents });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch agents", error });
    }
});
exports.getAllAgents = getAllAgents;
