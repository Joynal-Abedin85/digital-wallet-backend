import express from "express";
import { getMyWallet, addMoney, withdrawMoney, sendMoney } from "./wallet.controller";
import { verifyToken } from "../../middlewares/authMiddleware";

const router = express.Router();

// 🔹 Protected routes (JWT required)
router.use(verifyToken);

router.get("/me", getMyWallet);
router.post("/add", addMoney);
router.post("/withdraw", withdrawMoney);
router.post("/send", sendMoney);

export const WalletRoutes = router;
