// src/routes/agent.route.ts
import express from "express";
import { cashIn, cashOut, getCommissionHistory } from "./agent.controller";
import { authorizeRoles, verifyToken } from "../../middlewares/authMiddleware";

const router = express.Router();

router.post("/cash-in", verifyToken, authorizeRoles("agent"), cashIn);
router.post("/cash-out", verifyToken, authorizeRoles("agent"), cashOut);
router.get("/commissions", verifyToken, authorizeRoles("agent"), getCommissionHistory);

export const agentroutes =  router;
