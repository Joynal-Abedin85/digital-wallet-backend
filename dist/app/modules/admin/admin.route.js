"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminroute = void 0;
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const admin_controller_1 = require("./admin.controller");
const router = express_1.default.Router();
router.use(authMiddleware_1.verifyToken, (0, authMiddleware_1.authorizeRoles)("admin"));
router.get("/users", admin_controller_1.getAllUsers);
router.get("/wallets", admin_controller_1.getAllWallets);
router.patch("/wallets/:id/status", admin_controller_1.updateWalletStatus);
router.patch("/agents/:id/status", admin_controller_1.updateAgentStatus);
exports.adminroute = router;
