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
exports.updateAgentStatus = exports.updateWalletStatus = exports.getAllWallets = exports.getAllUsers = void 0;
const user_model_1 = require("../user/user.model");
const wallet_model_1 = require("../wallet/wallet.model");
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
