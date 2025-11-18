"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = exports.Wallet = void 0;
const mongoose_1 = require("mongoose");
const walletSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    balance: { type: Number, default: 50 },
    status: { type: String, enum: ["active", "blocked"], default: "active" },
}, { timestamps: true });
exports.Wallet = (0, mongoose_1.model)("Wallet", walletSchema);
const mongoose_2 = __importDefault(require("mongoose"));
const transactionSchema = new mongoose_2.default.Schema({
    user: { type: mongoose_2.default.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["deposit", "withdraw", "send"], required: true },
    amount: { type: Number, required: true },
    receiver: { type: String }, // only for send
    createdAt: { type: Date, default: Date.now }
});
exports.Transaction = mongoose_2.default.model("Transaction", transactionSchema);
