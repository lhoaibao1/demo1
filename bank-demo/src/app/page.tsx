"use client";

import { useState, useMemo } from "react";

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
  { id: "1", code: "GD2508160001", accountNo: "0123456789", customerName: "CÔNG TY TNHH ABC", type: "Chuyển khoản", amount: 1250000000, createdBy: "NV002", status: "pending", content: "Thanh toán hợp đồng mua bán", createdAt: "2026-08-16T14:22:15" },
  { id: "2", code: "GD2508160002", accountNo: "9876543210", customerName: "NGUYỄN THỊ B", type: "Rút tiền", amount: 85000000, createdBy: "NV005", status: "approved", createdAt: "2026-08-16T13:45:02" },
  { id: "3", code: "GD2508160003", accountNo: "1122334455", customerName: "TRẦN VĂN C", type: "Nạp tiền", amount: 320000000, createdBy: "NV002", status: "rejected", createdAt: "2026-08-16T11:18:44" },
  { id: "4", code: "GD2508160004", accountNo: "5566778899", customerName: "CÔNG TY XYZ", type: "Thanh toán L/C", amount: 2100000000, createdBy: "NV008", status: "processing", createdAt: "2026-08-16T09:50:31" },
  { id: "5", code: "GD2508160005", accountNo: "9988776655", customerName: "LÊ THỊ D", type: "Chuyển khoản", amount: 45500000, createdBy: "NV003", status: "approved", createdAt: "2026-08-15T17:30:19" },
  { id: "6", code: "GD2508160006", accountNo: "3344556677", customerName: "PHẠM VĂN E", type: "Chuyển khoản", amount: 780000000, createdBy: "NV002", status: "pending", createdAt: "2026-08-15T16:12:08" },
  { id: "7", code: "GD2508160007", accountNo: "6677889900", customerName: "HOÀNG VĂN F", type: "Chuyển khoản", amount: 156000000, createdBy: "NV007", status: "pending", createdAt: "2026-08-15T15:05:41" },
];

const statusConfig: Record<Status, { label: string; bg: string; text: string; border: string }> = {
  pending: { label: "Chờ duyệt", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  approved: { label: "Đã duyệt", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  rejected: { label: "Từ chối", bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  processing: { label: "Đang xử lý", bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200" },
};

function formatMoney(n: number) {
  return new Intl.NumberFormat("vi-VN").format(n) + " ₫";
}

function formatDate(d: string) {
  return new Date(d).toLocaleString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function HomePage() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialData);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [form, setForm] = useState({ accountNo: "", customerName: "", type: "Chuyển khoản", amount: "", content: "" });
  const [toast, setToast] = useState("");

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (statusFilter !== "all" && tx.status !== statusFilter) return false;
      if (typeFilter !== "all" && tx.type !== typeFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return tx.code.toLowerCase().includes(q) || tx.accountNo.includes(q) || tx.customerName.toLowerCase().includes(q);
      }
      return true;
    });
  }, [transactions, statusFilter, typeFilter, search]);

  const stats = useMemo(() => {
    const pending = transactions.filter((t) => t.status === "pending").length;
    const approved = transactions.filter((t) => t.status === "approved").length;
    const totalAmount = transactions.reduce((s, t) => s + t.amount, 0);
    return { pending, approved, total: transactions.length, totalAmount };
  }, [transactions]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const count = transactions.length + 1;
    const code = `GD${new Date().toISOString().slice(2, 10).replace(/-/g, "")}${String(count).padStart(4, "0")}`;
    const newTx: Transaction = {
      id: Date.now().toString(),
      code,
      accountNo: form.accountNo,
      customerName: form.customerName.toUpperCase(),
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
    showToast("✓ Tạo giao dịch thành công");
  }

  function updateStatus(id: string, status: Status) {
    setTransactions((prev) => prev.map((tx) => (tx.id === id ? { ...tx, status } : tx)));
    setSelectedTx(null);
    showToast(status === "approved" ? "✓ Đã duyệt giao dịch" : "✓ Đã từ chối giao dịch");
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800">
      <header className="bg-[#0b2545] text-white sticky top-0 z-40 shadow-md">
        <div className="h-11 flex items-center px-5">
          <div className="flex items-center gap-2.5 mr-8">
            <div className="w-7 h-7 rounded bg-gradient-to-br from-sky-400 to-amber-300 flex items-center justify-center font-bold text-[#0b2545] text-xs">3R</div>
            <span className="font-semibold tracking-wide text-sm">3RD CORE BANKING</span>
          </div>
          <nav className="hidden md:flex items-center gap-1 text-[13px]">
            {["Giao dịch", "Khách hàng", "Tín dụng", "Báo cáo", "Quản trị"].map((item, i) => (
              <a key={item} href="#" className={`px-3.5 py-1.5 rounded transition ${i === 0 ? "bg-white/15 font-medium" : "text-white/75 hover:text-white hover:bg-white/10"}`}>{item}</a>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-5 text-[12px] text-white/80">
            <span className="hidden sm:inline">Chi nhánh: 001 – Quận 1</span>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-sky-500/80 flex items-center justify-center text-[11px] font-semibold">NA</div>
              <div className="hidden sm:block leading-tight">
                <div className="text-white font-medium">Nguyễn Văn A</div>
                <div className="text-white/60 text-[11px]">Checker</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-56 bg-white border-r border-slate-200 min-h-[calc(100vh-44px)] sticky top-11 hidden md:block">
          <div className="p-4">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Giao dịch</p>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-sky-50 text-[#0b2545] font-medium text-sm border-l-[3px] border-[#0b2545]"><span>📋</span> Cần xử lý</div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-md text-slate-600 hover:bg-slate-50 cursor-pointer text-sm"><span>➕</span> Tạo mới</div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-md text-slate-600 hover:bg-slate-50 cursor-pointer text-sm"><span>📜</span> Lịch sử</div>
            </div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-5">Khách hàng</p>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 px-3 py-2 rounded-md text-slate-600 hover:bg-slate-50 cursor-pointer text-sm"><span>🔍</span> Tra cứu CIF</div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-md text-slate-600 hover:bg-slate-50 cursor-pointer text-sm"><span>👤</span> Mở tài khoản</div>
            </div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-5">Báo cáo</p>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 px-3 py-2 rounded-md text-slate-600 hover:bg-slate-50 cursor-pointer text-sm"><span>📊</span> Cuối ngày</div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-md text-slate-600 hover:bg-slate-50 cursor-pointer text-sm"><span>⚠️</span> Rủi ro</div>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-5 max-w-[1400px]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div>
              <h1 className="text-xl font-semibold text-[#0b2545]">Giao dịch cần xử lý</h1>
              <p className="text-sm text-slate-500 mt-0.5">Quản lý và phê duyệt các giao dịch trong ngày</p>
            </div>
            <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 bg-[#0b2545] hover:bg-[#14375e] text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition">
              <span className="text-lg leading-none">+</span> Tạo giao dịch
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="text-xs text-slate-500 mb-1">Tổng giao dịch</div>
              <div className="text-2xl font-bold text-[#0b2545]">{stats.total}</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="text-xs text-slate-500 mb-1">Chờ duyệt</div>
              <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="text-xs text-slate-500 mb-1">Đã duyệt</div>
              <div className="text-2xl font-bold text-emerald-600">{stats.approved}</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="text-xs text-slate-500 mb-1">Tổng giá trị</div>
              <div className="text-lg font-bold text-[#0b2545] leading-tight">{formatMoney(stats.totalAmount)}</div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4 shadow-sm">
            <div className="flex flex-wrap gap-3 items-end">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Trạng thái</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-9 border border-slate-200 rounded-lg px-3 text-sm bg-white min-w-[130px] focus:outline-none focus:ring-2 focus:ring-sky-200">
                  <option value="all">Tất cả</option>
                  <option value="pending">Chờ duyệt</option>
                  <option value="approved">Đã duyệt</option>
                  <option value="rejected">Từ chối</option>
                  <option value="processing">Đang xử lý</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Loại giao dịch</label>
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="h-9 border border-slate-200 rounded-lg px-3 text-sm bg-white min-w-[150px] focus:outline-none focus:ring-2 focus:ring-sky-200">
                  <option value="all">Tất cả</option>
                  <option value="Chuyển khoản">Chuyển khoản</option>
                  <option value="Nạp tiền">Nạp tiền</option>
                  <option value="Rút tiền">Rút tiền</option>
                  <option value="Thanh toán L/C">Thanh toán L/C</option>
                </select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Tìm kiếm</label>
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Mã GD, số TK, tên khách hàng..." className="h-9 w-full border border-slate-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200" />
              </div>
              <button onClick={() => { setStatusFilter("all"); setTypeFilter("all"); setSearch(""); }} className="h-9 px-4 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition">Đặt lại</button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">{filtered.length} giao dịch</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wide">
                    <th className="text-left px-4 py-3 font-semibold">Mã GD</th>
                    <th className="text-left px-4 py-3 font-semibold">Số TK</th>
                    <th className="text-left px-4 py-3 font-semibold">Khách hàng</th>
                    <th className="text-left px-4 py-3 font-semibold">Loại</th>
                    <th className="text-right px-4 py-3 font-semibold">Số tiền</th>
                    <th className="text-left px-4 py-3 font-semibold">Thời gian</th>
                    <th className="text-left px-4 py-3 font-semibold">Trạng thái</th>
                    <th className="text-left px-4 py-3 font-semibold">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((tx) => {
                    const st = statusConfig[tx.status];
                    return (
                      <tr key={tx.id} className="border-t border-slate-100 hover:bg-slate-50/80 transition">
                        <td className="px-4 py-3 font-medium text-[#0b2545]">{tx.code}</td>
                        <td className="px-4 py-3 text-slate-600">{tx.accountNo}</td>
                        <td className="px-4 py-3 max-w-[160px] truncate">{tx.customerName}</td>
                        <td className="px-4 py-3 text-slate-600">{tx.type}</td>
                        <td className="px-4 py-3 text-right font-medium tabular-nums">{formatMoney(tx.amount)}</td>
                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap text-[13px]">{formatDate(tx.createdAt)}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${st.bg} ${st.text} ${st.border}`}>{st.label}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button onClick={() => setSelectedTx(tx)} className="text-xs px-2.5 py-1 border border-slate-200 rounded-md hover:bg-slate-50 mr-1.5 transition">Chi tiết</button>
                          {tx.status === "pending" && (
                            <>
                              <button onClick={() => updateStatus(tx.id, "approved")} className="text-xs px-2.5 py-1 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 mr-1.5 transition">Duyệt</button>
                              <button onClick={() => updateStatus(tx.id, "rejected")} className="text-xs px-2.5 py-1 border border-red-200 text-red-600 rounded-md hover:bg-red-50 transition">Từ chối</button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr><td colSpan={8} className="px-4 py-12 text-center text-slate-400">Không tìm thấy giao dịch phù hợp</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {toast && (
        <div className="fixed bottom-5 right-5 bg-[#0b2545] text-white px-5 py-3 rounded-lg shadow-xl text-sm z-50">{toast}</div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-[#0b2545] text-lg">Tạo giao dịch mới</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition">✕</button>
            </div>
            <form onSubmit={handleCreate} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Loại giao dịch</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full h-10 border border-slate-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200">
                  <option>Chuyển khoản</option><option>Nạp tiền</option><option>Rút tiền</option><option>Thanh toán L/C</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Số tài khoản</label>
                <input required value={form.accountNo} onChange={(e) => setForm({ ...form, accountNo: e.target.value })} className="w-full h-10 border border-slate-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200" placeholder="0123456789" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tên khách hàng</label>
                <input required value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} className="w-full h-10 border border-slate-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200" placeholder="NGUYỄN VĂN A" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Số tiền (VND)</label>
                <input required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full h-10 border border-slate-200 rounded-lg px-3 text-sm text-right focus:outline-none focus:ring-2 focus:ring-sky-200" placeholder="1,000,000" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nội dung</label>
                <input value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full h-10 border border-slate-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200" placeholder="Nội dung giao dịch" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="h-10 px-5 border border-slate-200 rounded-lg text-sm hover:bg-slate-50 transition">Hủy</button>
                <button type="submit" className="h-10 px-5 bg-[#0b2545] text-white rounded-lg text-sm font-medium hover:bg-[#14375e] transition">Lưu & Gửi duyệt</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedTx && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-[#0b2545] text-lg">Chi tiết giao dịch</h2>
              <button onClick={() => setSelectedTx(null)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition">✕</button>
            </div>
            <div className="p-5 space-y-3 text-sm">
              {[
                ["Mã giao dịch", selectedTx.code],
                ["Số tài khoản", selectedTx.accountNo],
                ["Khách hàng", selectedTx.customerName],
                ["Loại", selectedTx.type],
                ["Số tiền", formatMoney(selectedTx.amount)],
                ["User tạo", selectedTx.createdBy],
                ["Thời gian", formatDate(selectedTx.createdAt)],
                ["Nội dung", selectedTx.content || "—"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-medium text-right max-w-[60%]">{value}</span>
                </div>
              ))}
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Trạng thái</span>
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusConfig[selectedTx.status].bg} ${statusConfig[selectedTx.status].text} ${statusConfig[selectedTx.status].border}`}>
                  {statusConfig[selectedTx.status].label}
                </span>
              </div>
            </div>
            {selectedTx.status === "pending" && (
              <div className="px-5 pb-5 flex gap-2 justify-end">
                <button onClick={() => updateStatus(selectedTx.id, "rejected")} className="h-10 px-5 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50 transition">Từ chối</button>
                <button onClick={() => updateStatus(selectedTx.id, "approved")} className="h-10 px-5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition">Duyệt giao dịch</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
