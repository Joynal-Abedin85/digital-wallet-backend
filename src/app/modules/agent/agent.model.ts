import mongoose, { Schema, Document } from "mongoose";

export interface ICommission extends Document {
  agent: mongoose.Types.ObjectId;
  amount: number;
  type: "cash-in" | "cash-out";
  createdAt: Date;
}

const commissionSchema = new Schema<ICommission>({
  agent: { type: Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["cash-in", "cash-out"], required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Commission = mongoose.model<ICommission>("Commission", commissionSchema);


