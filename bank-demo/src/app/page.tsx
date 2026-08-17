"use client";

import { useState } from "react";

type Status = "pending" | "approved" | "rejected" | "processing";

interface Transaction {
  id: string;
  code: string;
  accountNo: string;
  customerName: string;
  type: string;
  amount: number;
  createdBy: string;
  status: Status;
  content?: string;
  createdAt: string;
}

const initialData: Transaction[] = [
  {
    id: "1",
    code: "GD2508160001",
    accountNo: "0123456789",
    customerName: "CÔNG TY TNHH ABC",
    type: "Chuyển khoản",
    amount: 1250000000,
    createdBy: "NV002",
    status: "pending",
    content: "Thanh toán hợp đồng",
    createdAt: "2026-08-16T14:22:15",
  },
  {
    id: "2",
    code: "GD2508160002",
    accountNo: "9876543210",
    customerName: "NGUYỄN THỊ B",
    type: "Rút tiền",
    amount: 85000000,
    createdBy: "NV005",
    status: "approved",
    createdAt: "2026-08-16T13:45:02",
  },
  {
    id: "3",
    code: "GD2508160003",
    accountNo: "1122334455",
    customerName: "TRẦN VĂN C",
    type: "Nạp tiền",
    amount: 320000000,
    createdBy: "NV002",
    status: "rejected",
    createdAt: "2026-08-16T11:18:44",
  },
  {
    id: "4",
    code: "GD2508160004",
    accountNo: "5566778899",
    customerName: "CÔNG TY XYZ",
    type: "Thanh toán L/C",
    amount: 2100000000,
    createdBy: "NV008",
    status: "processing",
    createdAt: "2026-08-16T09:50:31",
  },
  {
    id: "5",
    code: "GD2508160005",
    accountNo: "9988776655",
    customerName: "LÊ THỊ D",
    type: "Chuyển khoản",
    amount: 45500000,
    createdBy: "NV003",
    status: "approved",
    createdAt: "2026-08-15T17:30:19",
  },
  {
    id: "6",
    code: "GD2508160006",
    accountNo: "3344556677",
    customerName: "PHẠM VĂN E",
    type: "Chuyển khoản",
    amount: 780000000,
    createdBy: "NV002",
    status: "pending",
    createdAt: "2026-08-15T16:12:08",
  },
  {
    id: "7",
    code: "GD2508160007",
    accountNo: "6677889900",
    customerName: "HOÀNG VĂN F",
    type: "Chuyển khoản",
    amount: 156000000,
    createdBy: "NV007",
    status: "pending",
    createdAt: "2026-08-15T15:05:41",
  },
];

const statusMap: Record<Status, { label: string; className: string }> = {
  pending: { label: "Chờ duyệt", className: "bg-amber-100 text-amber-800 border-amber-300" },
  approved: { label: "Đã duyệt", className: "bg-green-100 text-green-800 border-green-300" },
  rejected: { label: "Từ chối", className: "bg-red-100 text-red-800 border-red-300" },
  processing: { label: "Đang xử lý", className: "bg-blue-100 text-blue-800 border-blue-300" },
};

function formatMoney(n: number) {
  return new Intl.NumberFormat("vi-VN").format(n);
}

function formatDate(d: string) {
  return new Date(d).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HomePage() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialData);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    accountNo: "",
    customerName: "",
    type: "Chuyển khoản",
    amount: "",
    content: "",
  });
  const [message, setMessage] = useState("");

  const filtered = transactions.filter((tx) => {
    if (statusFilter !== "all" && tx.status !== statusFilter) return false;
    if (typeFilter !== "all" && tx.type !== typeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        tx.code.toLowerCase().includes(q) ||
        tx.accountNo.includes(q) ||
        tx.customerName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  function showMsg(text: string) {
    setMessage(text);
    setTimeout(() => setMessage(""), 2500);
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const count = transactions.length + 1;
    const code = `GD${new Date().toISOString().slice(2, 10).replace(/-/g, "")}${String(count).padStart(4, "0")}`;

    const newTx: Transaction = {
      id: Date.now().toString(),
      code,
      accountNo: form.accountNo,
      customerName: form.customerName,
      type: form.type,
      amount: Number(form.amount.replace(/\D/g, "")),
      createdBy: "NV001",
      status: "pending",
      content: form.content,
      createdAt: new Date().toISOString(),
    };

    setTransactions([newTx, ...transactions]);
    setShowModal(false);
    setForm({ accountNo: "", customerName: "", type: "Chuyển khoản", amount: "", content: "" });
    showMsg("Tạo giao dịch thành công");
  }

  function updateStatus(id: string, status: Status) {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === id ? { ...tx, status } : tx))
    );
    showMsg(status === "approved" ? "Đã duyệt giao dịch" : "Đã từ chối giao dịch");
  }

  const pendingCount = transactions.filter((t) => t.status === "pending").length;

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f4f8]">
      <header className="bg-[#0c2d48] text-white h-9 flex items-center px-4 text-xs shrink-0">
        <div className="font-bold text-sm tracking-wide mr-6">3RD CORE BANKING</div>
        <nav className="flex gap-1">
          {["Giao dịch", "Khách hàng", "Tín dụng", "Báo cáo", "Quản trị"].map((item, i) => (
            <a
              key={item}
              href="#"
              className={`px-3 h-9 leading-9 hover:bg-white/10 ${i === 0 ? "bg-white/15 font-medium" : ""}`}
            >
              {item}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex gap-5 text-white/80">
          <span>Chi nhánh: 001 - Quận 1</span>
          <span>NV001 - Nguyễn Văn A (Checker)</span>
          <span>{new Date().toLocaleString("vi-VN")}</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-52 bg-white border-r border-[#c5d0dc] shrink-0 overflow-y-auto">
          <div className="p-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Giao dịch</div>
          <div className="px-3 py-2 bg-[#e0ecf5] border-l-[3px] border-[#0c2d48] text-[#0c2d48] font-semibold text-sm">
            Danh sách cần xử lý
          </div>
          <div className="px-3 py-2 hover:bg-slate-50 cursor-pointer text-sm">Tạo giao dịch mới</div>
          <div className="px-3 py-2 hover:bg-slate-50 cursor-pointer text-sm">Lịch sử giao dịch</div>
          <div className="p-3 mt-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Khách hàng</div>
          <div className="px-3 py-2 hover:bg-slate-50 cursor-pointer text-sm">Tra cứu CIF</div>
          <div className="px-3 py-2 hover:bg-slate-50 cursor-pointer text-sm">Mở tài khoản</div>
          <div className="p-3 mt-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Báo cáo</div>
          <div className="px-3 py-2 hover:bg-slate-50 cursor-pointer text-sm">Báo cáo cuối ngày</div>
          <div className="px-3 py-2 hover:bg-slate-50 cursor-pointer text-sm">Báo cáo rủi ro</div>
        </aside>

        <main className="flex-1 overflow-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-semibold text-[#0c2d48]">
              Danh sách giao dịch cần xử lý
              {pendingCount > 0 && (
                <span className="ml-2 text-sm font-normal text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                  {pendingCount} chờ duyệt
                </span>
              )}
            </h1>
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#0c2d48] hover:bg-[#145374] text-white text-sm px-4 py-1.5 rounded"
            >
              + Tạo giao dịch
            </button>
          </div>

          <div className="bg-white border border-[#c5d0dc] rounded p-3 mb-4 flex flex-wrap gap-3 items-end">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Trạng thái</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-8 border border-[#c5d0dc] rounded px-2 text-sm min-w-[120px]"
              >
                <option value="all">Tất cả</option>
                <option value="pending">Chờ duyệt</option>
                <option value="approved">Đã duyệt</option>
                <option value="rejected">Từ chối</option>
                <option value="processing">Đang xử lý</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Loại GD</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="h-8 border border-[#c5d0dc] rounded px-2 text-sm min-w-[140px]"
              >
                <option value="all">Tất cả</option>
                <option value="Chuyển khoản">Chuyển khoản</option>
                <option value="Nạp tiền">Nạp tiền</option>
                <option value="Rút tiền">Rút tiền</option>
                <option value="Thanh toán L/C">Thanh toán L/C</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Tìm kiếm</label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Mã GD, STK, tên KH..."
                className="h-8 border border-[#c5d0dc] rounded px-2 text-sm w-52"
              />
            </div>
            <button
              onClick={() => {
                setStatusFilter("all");
                setTypeFilter("all");
                setSearch("");
              }}
              className="h-8 px-3 border border-[#c5d0dc] text-sm rounded hover:bg-slate-50"
            >
              Làm mới
            </button>
          </div>

          <div className="bg-white border border-[#c5d0dc] rounded overflow-hidden">
            <div className="px-3 py-2 border-b border-[#c5d0dc] text-sm font-medium text-slate-600">
              Có {filtered.length} giao dịch
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#f5f8fb] text-slate-500 text-[11px] uppercase tracking-wide">
                    <th className="text-left px-3 py-2.5 font-semibold">Mã GD</th>
                    <th className="text-left px-3 py-2.5 font-semibold">Số TK</th>
                    <th className="text-left px-3 py-2.5 font-semibold">Khách hàng</th>
                    <th className="text-left px-3 py-2.5 font-semibold">Loại</th>
                    <th className="text-right px-3 py-2.5 font-semibold">Số tiền</th>
                    <th className="text-left px-3 py-2.5 font-semibold">Thời gian</th>
                    <th className="text-left px-3 py-2.5 font-semibold">User</th>
                    <th className="text-left px-3 py-2.5 font-semibold">Trạng thái</th>
                    <th className="text-left px-3 py-2.5 font-semibold">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((tx) => (
                    <tr key={tx.id} className="border-t border-slate-100 hover:bg-slate-50">
                      <td className="px-3 py-2 font-medium text-[#0c2d48]">{tx.code}</td>
                      <td className="px-3 py-2">{tx.accountNo}</td>
                      <td className="px-3 py-2 max-w-[180px] truncate">{tx.customerName}</td>
                      <td className="px-3 py-2">{tx.type}</td>
                      <td className="px-3 py-2 text-right font-medium tabular-nums">
                        {formatMoney(tx.amount)}
                      </td>
                      <td className="px-3 py-2 text-slate-500 whitespace-nowrap">
                        {formatDate(tx.createdAt)}
                      </td>
                      <td className="px-3 py-2">{tx.createdBy}</td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-block px-2 py-0.5 text-[11px] font-semibold border rounded ${statusMap[tx.status].className}`}
                        >
                          {statusMap[tx.status].label}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <button className="text-xs px-2 py-1 border border-slate-300 rounded mr-1 hover:bg-slate-50">
                          Xem
                        </button>
                        {tx.status === "pending" && (
                          <>
                            <button
                              onClick={() => updateStatus(tx.id, "approved")}
                              className="text-xs px-2 py-1 bg-[#0c2d48] text-white rounded mr-1 hover:bg-[#145374]"
                            >
                              Duyệt
                            </button>
                            <button
                              onClick={() => updateStatus(tx.id, "rejected")}
                              className="text-xs px-2 py-1 border border-red-300 text-red-700 rounded hover:bg-red-50"
                            >
                              Từ chối
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-3 py-8 text-center text-slate-400">
                        Không có dữ liệu phù hợp
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {message && (
        <div className="fixed bottom-4 right-4 bg-[#0c2d48] text-white px-4 py-2 rounded shadow-lg text-sm z-50">
          {message}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <h2 className="font-semibold text-[#0c2d48]">Tạo giao dịch mới</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-xl">
                ×
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Loại giao dịch</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full h-9 border border-slate-300 rounded px-2 text-sm"
                >
                  <option>Chuyển khoản</option>
                  <option>Nạp tiền</option>
                  <option>Rút tiền</option>
                  <option>Thanh toán L/C</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Số tài khoản</label>
                <input
                  required
                  value={form.accountNo}
                  onChange={(e) => setForm({ ...form, accountNo: e.target.value })}
                  className="w-full h-9 border border-slate-300 rounded px-2 text-sm"
                  placeholder="0123456789"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Tên khách hàng</label>
                <input
                  required
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  className="w-full h-9 border border-slate-300 rounded px-2 text-sm"
                  placeholder="NGUYỄN VĂN A"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Số tiền (VND)</label>
                <input
                  required
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full h-9 border border-slate-300 rounded px-2 text-sm text-right"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nội dung</label>
                <input
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full h-9 border border-slate-300 rounded px-2 text-sm"
                  placeholder="Nội dung giao dịch"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="h-9 px-4 border border-slate-300 rounded text-sm hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="h-9 px-4 bg-[#0c2d48] text-white rounded text-sm hover:bg-[#145374]"
                >
                  Lưu & Gửi duyệt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
