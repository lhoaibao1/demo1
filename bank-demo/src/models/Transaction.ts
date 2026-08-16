import mongoose, { Schema, models } from "mongoose";

export type TransactionStatus = "pending" | "approved" | "rejected" | "processing";

export interface ITransaction {
  _id: string;
  code: string;
  accountNo: string;
  customerName: string;
  type: string;
  amount: number;
  createdBy: string;
  status: TransactionStatus;
  content?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    code: { type: String, required: true, unique: true },
    accountNo: { type: String, required: true },
    customerName: { type: String, required: true },
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    createdBy: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "processing"],
      default: "pending",
    },
    content: { type: String },
  },
  { timestamps: true }
);

export const Transaction =
  models.Transaction || mongoose.model<ITransaction>("Transaction", TransactionSchema);
