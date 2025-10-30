import express from "express";
import { authorizeRoles, verifyToken } from "../../middlewares/authMiddleware";
import { getAllUsers, getAllWallets, updateAgentStatus, updateWalletStatus } from "./admin.controller";

const router = express.Router();

router.use(verifyToken, authorizeRoles("admin"));

router.get("/users", getAllUsers);

router.get("/wallets", getAllWallets);

router.patch("/wallets/:id/status", updateWalletStatus);

router.patch("/agents/:id/status", updateAgentStatus);

export const adminroute =  router;
