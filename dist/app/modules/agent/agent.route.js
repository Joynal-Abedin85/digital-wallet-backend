"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentroutes = void 0;
const express_1 = __importDefault(require("express"));
const agent_controller_1 = require("./agent.controller");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post("/cash-in", authMiddleware_1.verifyToken, (0, authMiddleware_1.authorizeRoles)("agent"), agent_controller_1.cashIn);
router.post("/cash-out", authMiddleware_1.verifyToken, (0, authMiddleware_1.authorizeRoles)("agent"), agent_controller_1.cashOut);
router.get("/commissions", authMiddleware_1.verifyToken, (0, authMiddleware_1.authorizeRoles)("agent"), agent_controller_1.getCommissionHistory);
exports.agentroutes = router;
