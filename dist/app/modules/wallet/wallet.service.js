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
exports.sendMoney = exports.withdrawMoney = exports.addMoney = exports.createWalletForUser = void 0;
const wallet_model_1 = require("./wallet.model");
const user_model_1 = require("../user/user.model");
const createWalletForUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.create({ user: userId, balance: 50 });
    yield user_model_1.User.findByIdAndUpdate(userId, { wallet: wallet._id });
    return wallet;
});
exports.createWalletForUser = createWalletForUser;
const addMoney = (userId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findOne({ user: userId });
    if (!wallet || wallet.status === "blocked") {
        throw new Error("Wallet not accessible");
    }
    wallet.balance += amount;
    yield wallet.save();
    return wallet;
});
exports.addMoney = addMoney;
const withdrawMoney = (userId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findOne({ user: userId });
    if (!wallet || wallet.status === "blocked") {
        throw new Error("Wallet not accessible");
    }
    if (wallet.balance < amount) {
        throw new Error("Insufficient balance");
    }
    wallet.balance -= amount;
    yield wallet.save();
    return wallet;
});
exports.withdrawMoney = withdrawMoney;
const sendMoney = (senderId, receiverEmail, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield wallet_model_1.Wallet.startSession();
    session.startTransaction();
    try {
        const senderWallet = yield wallet_model_1.Wallet.findOne({ user: senderId }).session(session);
        const receiverUser = yield user_model_1.User.findOne({ email: receiverEmail }).populate("wallet");
        if (!senderWallet || senderWallet.status === "blocked") {
            throw new Error("Sender wallet blocked or not found");
        }
        if (!receiverUser || !receiverUser.wallet) {
            throw new Error("Receiver wallet not found");
        }
        const receiverWallet = yield wallet_model_1.Wallet.findById(receiverUser.wallet._id).session(session);
        if (!receiverWallet || receiverWallet.status === "blocked") {
            throw new Error("Receiver wallet blocked or not found");
        }
        if (senderWallet.balance < amount) {
            throw new Error("Insufficient balance");
        }
        senderWallet.balance -= amount;
        receiverWallet.balance += amount;
        yield senderWallet.save({ session });
        yield receiverWallet.save({ session });
        yield session.commitTransaction();
        session.endSession();
        return {
            senderNewBalance: senderWallet.balance,
            receiverNewBalance: receiverWallet.balance,
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.sendMoney = sendMoney;
