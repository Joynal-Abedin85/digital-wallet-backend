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
exports.getAgentTransactions = exports.getAgentOverview = exports.getCommissionHistory = exports.cashOut = exports.cashIn = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const wallet_model_1 = require("../wallet/wallet.model");
const agent_model_1 = require("./agent.model");
// import { Transaction } from "./transectionmodel";
const cashIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { userId, amount } = req.body;
        const agentId = req.user.id;
        if (!userId || !amount || amount <= 0) {
            return res.status(400).json({ success: false, message: "Invalid input" });
        }
        const userWallet = yield wallet_model_1.Wallet.findOne({ user: userId }).session(session);
        if (!userWallet || userWallet.status !== "active") {
            return res.status(404).json({ success: false, message: "User wallet not accessible" });
        }
        userWallet.balance += amount;
        yield userWallet.save({ session });
        const commissionAmount = amount * 0.01;
        yield agent_model_1.Commission.create([{ agent: agentId, amount: commissionAmount, type: "cash-in" }], { session });
        yield agent_model_1.Commission.create([
            {
                user: userId,
                agent: agentId,
                amount,
                type: "cash-in",
            },
        ], { session });
        yield session.commitTransaction();
        res.status(200).json({ success: true, message: "Cash-in successful", commission: commissionAmount });
    }
    catch (error) {
        yield session.abortTransaction();
        res.status(500).json({ success: false, message: "Cash-in failed", error });
    }
    finally {
        session.endSession();
    }
});
exports.cashIn = cashIn;
const cashOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { userId, amount } = req.body;
        const agentId = req.user.id;
        if (!userId || !amount || amount <= 0) {
            return res.status(400).json({ success: false, message: "Invalid input" });
        }
        const userWallet = yield wallet_model_1.Wallet.findOne({ user: userId }).session(session);
        if (!userWallet || userWallet.balance < amount) {
            return res.status(400).json({ success: false, message: "Insufficient balance" });
        }
        userWallet.balance -= amount;
        yield userWallet.save({ session });
        const commissionAmount = amount * 0.01;
        yield agent_model_1.Commission.create([{ agent: agentId, amount: commissionAmount, type: "cash-out" }], { session });
        yield agent_model_1.Commission.create([
            {
                user: userId,
                agent: agentId,
                amount,
                type: "cash-out",
            },
        ], { session });
        yield session.commitTransaction();
        res.status(200).json({ success: true, message: "Cash-out successful", commission: commissionAmount });
    }
    catch (error) {
        yield session.abortTransaction();
        res.status(500).json({ success: false, message: "Cash-out failed", error });
    }
    finally {
        session.endSession();
    }
});
exports.cashOut = cashOut;
const getCommissionHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const agentId = req.user.id;
        const commissions = yield agent_model_1.Commission.find({ agent: agentId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, commissions });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error fetching commissions", error });
    }
});
exports.getCommissionHistory = getCommissionHistory;
// agent.controller.ts
const getAgentOverview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const agentId = req.user.id;
        // Commission Summary
        const commissions = yield agent_model_1.Commission.find({ agent: agentId });
        const totalCommission = commissions.reduce((sum, c) => sum + c.amount, 0);
        // Cash-in/Cash-out Summary from Transactions
        const cashInTotal = yield agent_model_1.Commission.aggregate([
            { $match: { agent: agentId, type: "cash-in" } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);
        const cashOutTotal = yield agent_model_1.Commission.aggregate([
            { $match: { agent: agentId, type: "cash-out" } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);
        // Recent Commissions
        const recent = yield agent_model_1.Commission.find({ agent: agentId })
            .sort({ createdAt: -1 })
            .limit(10);
        res.status(200).json({
            success: true,
            overview: {
                totalCashIn: ((_a = cashInTotal[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
                totalCashOut: ((_b = cashOutTotal[0]) === null || _b === void 0 ? void 0 : _b.total) || 0,
                totalCommission,
                recentTransactions: recent,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error loading overview",
            error,
        });
    }
});
exports.getAgentOverview = getAgentOverview;
const getAgentTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const agentId = req.user.id;
        const transactions = yield agent_model_1.Commission.find({ agent: agentId });
        return res.status(200).json({
            success: true,
            transactions,
        });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});
exports.getAgentTransactions = getAgentTransactions;
