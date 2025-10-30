"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const mongoose_1 = require("mongoose");
const walletSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    balance: { type: Number, default: 50 },
    status: { type: String, enum: ["active", "blocked"], default: "active" },
}, { timestamps: true });
exports.Wallet = (0, mongoose_1.model)("Wallet", walletSchema);
