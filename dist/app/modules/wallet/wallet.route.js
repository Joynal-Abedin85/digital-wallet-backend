"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletRoutes = void 0;
const express_1 = __importDefault(require("express"));
const wallet_controller_1 = require("./wallet.controller");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.verifyToken);
router.get("/me", wallet_controller_1.getMyWallet);
router.post("/deposit", wallet_controller_1.addMoney);
router.post("/withdraw", wallet_controller_1.withdrawMoney);
router.post("/send", wallet_controller_1.sendMoney);
router.get("/transection", wallet_controller_1.getMyTransactions);
exports.WalletRoutes = router;
