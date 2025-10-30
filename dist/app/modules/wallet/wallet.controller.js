"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.sendMoney = exports.withdrawMoney = exports.addMoney = exports.getMyWallet = void 0;
const walletService = __importStar(require("./wallet.service"));
const user_model_1 = require("../user/user.model");
const getMyWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount } = req.body;
        const user = yield user_model_1.User.findById(req.user.id).populate("wallet");
        if (!user || !user.wallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not accessible",
            });
        }
        const wallet = user.wallet;
        wallet.balance += amount;
        yield wallet.save();
        res.status(200).json({
            success: true,
            message: "Wallet fetched successfully",
            data: wallet,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getMyWallet = getMyWallet;
const addMoney = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount } = req.body;
        if (!amount || amount <= 0) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid amount" });
        }
        const wallet = yield walletService.addMoney(req.user.id, amount);
        res.status(200).json({
            success: true,
            message: "Money added successfully",
            data: wallet,
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.addMoney = addMoney;
const withdrawMoney = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount } = req.body;
        if (!amount || amount <= 0) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid amount" });
        }
        const wallet = yield walletService.withdrawMoney(req.user.id, amount);
        res.status(200).json({
            success: true,
            message: "Money withdrawn successfully",
            data: wallet,
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.withdrawMoney = withdrawMoney;
const sendMoney = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, receiverEmail } = req.body;
        if (!amount || amount <= 0 || !receiverEmail) {
            return res.status(400).json({
                success: false,
                message: "Amount and receiver email required",
            });
        }
        const result = yield walletService.sendMoney(req.user.id, receiverEmail, amount);
        res.status(200).json({
            success: true,
            message: "Money sent successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.sendMoney = sendMoney;
