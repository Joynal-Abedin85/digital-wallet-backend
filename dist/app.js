"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_route_1 = require("./app/modules/user/user.route");
const wallet_route_1 = require("./app/modules/wallet/wallet.route");
const agent_route_1 = require("./app/modules/agent/agent.route");
const admin_route_1 = require("./app/modules/admin/admin.route");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to the Digital Wallet System API 🚀",
    });
});
app.use("/users", user_route_1.UserRoutes);
app.use("/wallets", wallet_route_1.WalletRoutes);
app.use("/agent", agent_route_1.agentroutes);
app.use("/admin", admin_route_1.adminroute);
exports.default = app;
