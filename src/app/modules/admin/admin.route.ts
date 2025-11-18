import express from "express";
import { authorizeRoles, verifyToken } from "../../middlewares/authMiddleware";
import { getAdminOverview, getAllAgents, getAllTransactions, getAllUsers, getAllWallets, updateAdminProfile, updateAgentStatus, updateWalletStatus } from "./admin.controller";

const router = express.Router();

router.use(verifyToken, authorizeRoles("admin"));

router.get("/users", getAllUsers);

router.get("/wallets", getAllWallets);

router.patch("/wallets/:id/status", updateWalletStatus);

router.patch("/agents/:id/status", updateAgentStatus);

router.get("/transactions", getAllTransactions);
router.patch("/profile", updateAdminProfile);

router.get("/overview", getAdminOverview);
router.get("/agents", getAllAgents);

export const adminroute =  router;
