import express from "express";
import { getMyWallet, addMoney, withdrawMoney, sendMoney, getMyTransactions } from "./wallet.controller";
import { verifyToken } from "../../middlewares/authMiddleware";

const router = express.Router();

router.use(verifyToken);

router.get("/me", getMyWallet);
router.post("/deposit", addMoney);
router.post("/withdraw", withdrawMoney);
router.post("/send", sendMoney);
router.get("/transection", getMyTransactions);


export const WalletRoutes = router;
