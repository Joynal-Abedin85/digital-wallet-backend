import express, { Application, Request, Response } from "express";
import cors from "cors";
import { UserRoutes } from "./app/modules/user/user.route";

const app: Application = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Root route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to the Digital Wallet System API 🚀",
  });
});

// ✅ Module Routes
app.use("/api/v1/users", UserRoutes);  // <-- User routes connect

// ✅ (Later you’ll add others like)
// app.use("/api/v1/auth", AuthRoutes);
// app.use("/api/v1/wallets", WalletRoutes);
// app.use("/api/v1/transactions", TransactionRoutes);

export default app;
