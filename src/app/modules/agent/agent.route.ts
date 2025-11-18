import express from "express";
import { cashIn, cashOut, getAgentOverview, getAgentTransactions, getCommissionHistory } from "./agent.controller";
import { authorizeRoles, verifyToken } from "../../middlewares/authMiddleware";

const router = express.Router();

router.post("/cash-in", verifyToken, authorizeRoles("agent"), cashIn);
router.post("/cash-out", verifyToken, authorizeRoles("agent"), cashOut);
router.get("/commissions", verifyToken, authorizeRoles("agent"), getCommissionHistory);
router.get("/overview", verifyToken, authorizeRoles("agent"), getAgentOverview);
router.get("/transactions", verifyToken, authorizeRoles("agent"), getAgentTransactions);

export const agentroutes =  router;
