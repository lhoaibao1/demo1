import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Transaction } from "@/models/Transaction";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const q = searchParams.get("q");

    const filter: Record<string, unknown> = {};
    if (status && status !== "all") filter.status = status;
    if (type && type !== "all") filter.type = type;
    if (q) {
      filter.$or = [
        { code: { $regex: q, $options: "i" } },
        { accountNo: { $regex: q, $options: "i" } },
        { customerName: { $regex: q, $options: "i" } },
      ];
    }

    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    const stats = await Transaction.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    return NextResponse.json({ transactions, stats });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const count = await Transaction.countDocuments();
    const code = `GD${new Date().toISOString().slice(2, 10).replace(/-/g, "")}${String(count + 1).padStart(4, "0")}`;

    const tx = await Transaction.create({
      code,
      accountNo: body.accountNo,
      customerName: body.customerName,
      type: body.type,
      amount: Number(body.amount),
      createdBy: body.createdBy || "NV001",
      status: "pending",
      content: body.content || "",
    });

    return NextResponse.json(tx, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}
