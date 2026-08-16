import mongoose from "mongoose";
import { Transaction } from "../models/Transaction";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/bankdemo";

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  await Transaction.deleteMany({});
  console.log("Cleared old data");

  const data = [
    {
      code: "GD2508160001",
      accountNo: "0123456789",
      customerName: "CÔNG TY TNHH ABC",
      type: "Chuyển khoản",
      amount: 1250000000,
      createdBy: "NV002",
      status: "pending",
      content: "Thanh toán hợp đồng",
    },
    {
      code: "GD2508160002",
      accountNo: "9876543210",
      customerName: "NGUYỄN THỊ B",
      type: "Rút tiền",
      amount: 85000000,
      createdBy: "NV005",
      status: "approved",
    },
    {
      code: "GD2508160003",
      accountNo: "1122334455",
      customerName: "TRẦN VĂN C",
      type: "Nạp tiền",
      amount: 320000000,
      createdBy: "NV002",
      status: "rejected",
    },
    {
      code: "GD2508160004",
      accountNo: "5566778899",
      customerName: "CÔNG TY XYZ",
      type: "Thanh toán L/C",
      amount: 2100000000,
      createdBy: "NV008",
      status: "processing",
    },
    {
      code: "GD2508160005",
      accountNo: "9988776655",
      customerName: "LÊ THỊ D",
      type: "Chuyển khoản",
      amount: 45500000,
      createdBy: "NV003",
      status: "approved",
    },
    {
      code: "GD2508160006",
      accountNo: "3344556677",
      customerName: "PHẠM VĂN E",
      type: "Chuyển khoản",
      amount: 780000000,
      createdBy: "NV002",
      status: "pending",
    },
    {
      code: "GD2508160007",
      accountNo: "6677889900",
      customerName: "HOÀNG VĂN F",
      type: "Chuyển khoản",
      amount: 156000000,
      createdBy: "NV007",
      status: "pending",
    },
  ];

  await Transaction.insertMany(data);
  console.log(`Seeded ${data.length} transactions`);
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
