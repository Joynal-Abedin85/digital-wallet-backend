import express, { Application, Request, Response } from "express";
import cors from "cors";
import { UserRoutes } from "./app/modules/user/user.route";
import { WalletRoutes } from "./app/modules/wallet/wallet.route";
import { agentroutes } from "./app/modules/agent/agent.route";
import { adminroute } from "./app/modules/admin/admin.route";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to the Digital Wallet System API 🚀",
  });
});

app.use("/users", UserRoutes);  
app.use("/wallets", WalletRoutes);
app.use("/agent", agentroutes);
app.use("/admin", adminroute);

export default app;
