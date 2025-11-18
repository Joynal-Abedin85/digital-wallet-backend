import { Request, Response } from "express";
import { User } from "../user/user.model";
import { Transaction, Wallet } from "../wallet/wallet.model";
import { Commission } from "../agent/agent.model";

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch users", error });
  }
};

export const getAllWallets = async (req: Request, res: Response) => {
  try {
    const wallets = await Wallet.find().populate("user", "name email role");
    res.status(200).json({ success: true, wallets });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch wallets", error });
  }
};

export const updateWalletStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; 

    if (!["active", "blocked"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const wallet = await Wallet.findByIdAndUpdate(id, { status }, { new: true });
    if (!wallet) {
      return res.status(404).json({ success: false, message: "Wallet not found" });
    }

    res.status(200).json({ success: true, message: `Wallet ${status} successfully`, wallet });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update wallet status", error });
  }
};

export const updateAgentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; 

    if (!["approved", "suspended"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const agent = await User.findByIdAndUpdate(id, { status }, { new: true });
    if (!agent) {
      return res.status(404).json({ success: false, message: "Agent not found" });
    }

    res.status(200).json({ success: true, message: `Agent ${status} successfully`, agent });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update agent status", error });
  }
};


export const getAdminOverview = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalAgents = await User.countDocuments({ role: "agent" });
    const totalTransactions = await Commission.countDocuments();
    const transactionVolumeAgg = await Commission.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalVolume = transactionVolumeAgg[0]?.total || 0;

    res.status(200).json({
      success: true,
      overview: {
        totalUsers,
        totalAgents,
        totalTransactions,
        totalVolume,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching overview", error });
  }
};

export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, type, userId, agentId } = req.query;

    const filter: any = {};
    if (type) filter.type = type;
    if (userId) filter.user = userId;
    if (agentId) filter.agent = agentId;

    const transactions = await Commission.find(filter)
      
      .sort({ createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit);

    const usertran = await Transaction.find()

    const total = await Commission.countDocuments(filter);

    res.status(200).json({ success: true, transactions, total , usertran});
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch transactions", error });
  }
};

export const updateAdminProfile = async (req: AuthRequest, res: Response) => {
  try {
    const adminId = req.user?.id ; // optional chaining safety
    if (!adminId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { name, email, password } = req.body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = password; // hash if necessary

    const updatedAdmin = await User.findByIdAndUpdate(adminId, updateData, { new: true }).select("-password");
    res.status(200).json({ success: true, admin: updatedAdmin });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update profile", error });
  }
};

export const getAllAgents = async (req: Request, res: Response) => {
  try {
    const agents = await User.find({ role: "agent" }).select("-password");
    res.status(200).json({ success: true, agents });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch agents", error });
  }
};
