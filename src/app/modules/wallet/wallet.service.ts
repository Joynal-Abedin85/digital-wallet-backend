import { Wallet } from "./wallet.model";
import { User } from "../user/user.model";
import { Types } from "mongoose";

export const createWalletForUser = async (userId: Types.ObjectId) => {
  const wallet = await Wallet.create({ user: userId, balance: 50 });
  await User.findByIdAndUpdate(userId, { wallet: wallet._id });
  return wallet;
};

export const addMoney = async (userId: Types.ObjectId, amount: number) => {
  const wallet = await Wallet.findOne({ user: userId });

  if (!wallet || wallet.status === "blocked") {
    throw new Error("Wallet not accessible");
  }

  wallet.balance += amount;
  await wallet.save();

  return wallet;
};

export const withdrawMoney = async (userId: Types.ObjectId, amount: number) => {
  const wallet = await Wallet.findOne({ user: userId });

  if (!wallet || wallet.status === "blocked") {
    throw new Error("Wallet not accessible");
  }

  if (wallet.balance < amount) {
    throw new Error("Insufficient balance");
  }

  wallet.balance -= amount;
  await wallet.save();

  return wallet;
};

export const sendMoney = async (
  senderId: Types.ObjectId,
  receiverEmail: string,
  amount: number
) => {
  const session = await Wallet.startSession();
  session.startTransaction();

  try {
    const senderWallet = await Wallet.findOne({ user: senderId }).session(session);
    const receiverUser = await User.findOne({ email: receiverEmail }).populate("wallet");

    if (!senderWallet || senderWallet.status === "blocked") {
      throw new Error("Sender wallet blocked or not found");
    }

    if (!receiverUser || !receiverUser.wallet) {
      throw new Error("Receiver wallet not found");
    }

    const receiverWallet = await Wallet.findById(receiverUser.wallet._id).session(session);

    if (!receiverWallet || receiverWallet.status === "blocked") {
      throw new Error("Receiver wallet blocked or not found");
    }

    if (senderWallet.balance < amount) {
      throw new Error("Insufficient balance");
    }

    senderWallet.balance -= amount;
    receiverWallet.balance += amount;

    await senderWallet.save({ session });
    await receiverWallet.save({ session });

    await session.commitTransaction();
    session.endSession();

    return {
      senderNewBalance: senderWallet.balance,
      receiverNewBalance: receiverWallet.balance,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
