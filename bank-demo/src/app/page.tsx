"use client";

import { useEffect, useState, useCallback } from "react";

type Status = "pending" | "approved" | "rejected" | "processing";

interface Transaction {
  _id: string;
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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
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
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (typeFilter !== "all") params.set("type", typeFilter);
      if (search) params.set("q", search);
      const res = await fetch(`/api/transactions?${params}`);
      const data = await res.json();
      setTransactions(data.transactions || []);
    } catch {
      setMessage("Lỗi kết nối server / database");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, typeFilter, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount.replace(/\D/g, "")),
          createdBy: "NV001",
        }),
      });
      if (res.ok) {
        setShowModal(false);
        setForm({ accountNo: "", customerName: "", type: "Chuyển khoản", amount: "", content: "" });
        setMessage("Tạo giao dịch thành công");
        fetchData();
      } else {
        setMessage("Tạo thất bại");
      }
    } catch {
      setMessage("Lỗi mạng");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  }

  async function updateStatus(id: string, status: Status) {
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setMessage(status === "approved" ? "Đã duyệt" : "Đã từ chối");
        fetchData();
      }
    } catch {
      setMessage("Lỗi cập nhật");
    }
    setTimeout(() => setMessage(""), 2500);
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
              onClick={fetchData}
              className="h-8 px-4 bg-[#0c2d48] text-white text-sm rounded hover:bg-[#145374]"
            >
              Tìm kiếm
            </button>
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
              {loading ? "Đang tải..." : `Có ${transactions.length} giao dịch`}
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
                  {transactions.map((tx) => (
                    <tr key={tx._id} className="border-t border-slate-100 hover:bg-slate-50">
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
                              onClick={() => updateStatus(tx._id, "approved")}
                              className="text-xs px-2 py-1 bg-[#0c2d48] text-white rounded mr-1 hover:bg-[#145374]"
                            >
                              Duyệt
                            </button>
                            <button
                              onClick={() => updateStatus(tx._id, "rejected")}
                              className="text-xs px-2 py-1 border border-red-300 text-red-700 rounded hover:bg-red-50"
                            >
                              Từ chối
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                  {!loading && transactions.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-3 py-8 text-center text-slate-400">
                        Không có dữ liệu. Hãy chạy seed hoặc tạo giao dịch mới.
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
                  disabled={saving}
                  className="h-9 px-4 bg-[#0c2d48] text-white rounded text-sm hover:bg-[#145374] disabled:opacity-50"
                >
                  {saving ? "Đang lưu..." : "Lưu & Gửi duyệt"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
