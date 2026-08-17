"use client";

import { useState, useMemo } from "react";

type Status = "pending" | "processing" | "approved" | "rejected";

interface RequestItem {
  id: string;
  code: string;
  type: string;
  customerName: string;
  cif: string;
  title: string;
  createdBy: string;
  status: Status;
  priority: "normal" | "high" | "urgent";
  createdAt: string;
  note?: string;
}

const initialData: RequestItem[] = [
  { id: "1", code: "HS-20260816-001", type: "Cập nhật thông tin KH", customerName: "CÔNG TY TNHH ABC", cif: "CIF001234", title: "Thay đổi địa chỉ trụ sở", createdBy: "NV002", status: "pending", priority: "high", createdAt: "2026-08-16T14:22:15", note: "Khách hàng gửi giấy phép kinh doanh mới" },
  { id: "2", code: "HS-20260816-002", type: "Mở tài khoản", customerName: "NGUYỄN THỊ B", cif: "CIF005678", title: "Mở tài khoản thanh toán cá nhân", createdBy: "NV005", status: "approved", priority: "normal", createdAt: "2026-08-16T13:45:02" },
  { id: "3", code: "HS-20260816-003", type: "Đề nghị tín dụng", customerName: "TRẦN VĂN C", cif: "CIF009012", title: "Vay vốn lưu động 2 tỷ", createdBy: "NV002", status: "processing", priority: "urgent", createdAt: "2026-08-16T11:18:44", note: "Đang chờ bổ sung BCTC" },
  { id: "4", code: "HS-20260816-004", type: "Khiếu nại", customerName: "CÔNG TY XYZ", cif: "CIF003456", title: "Khiếu nại phí chuyển tiền", createdBy: "NV008", status: "pending", priority: "high", createdAt: "2026-08-16T09:50:31" },
  { id: "5", code: "HS-20260816-005", type: "Bổ sung hồ sơ", customerName: "LÊ THỊ D", cif: "CIF007890", title: "Bổ sung CMND/CCCD", createdBy: "NV003", status: "approved", priority: "normal", createdAt: "2026-08-15T17:30:19" },
  { id: "6", code: "HS-20260816-006", type: "Cập nhật thông tin KH", customerName: "PHẠM VĂN E", cif: "CIF002345", title: "Thay đổi số điện thoại", createdBy: "NV002", status: "pending", priority: "normal", createdAt: "2026-08-15T16:12:08" },
  { id: "7", code: "HS-20260816-007", type: "Đề nghị tín dụng", customerName: "HOÀNG VĂN F", cif: "CIF008901", title: "Vay mua xe 800 triệu", createdBy: "NV007", status: "rejected", priority: "normal", createdAt: "2026-08-15T15:05:41", note: "Không đủ điều kiện thu nhập" },
];

const statusConfig: Record<Status, { label: string; bg: string; text: string; border: string }> = {
  pending: { label: "Chờ xử lý", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  processing: { label: "Đang xử lý", bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200" },
  approved: { label: "Đã duyệt", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  rejected: { label: "Từ chối", bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
};

const priorityConfig = {
  normal: { label: "Thường", className: "text-slate-500" },
  high: { label: "Cao", className: "text-amber-600 font-medium" },
  urgent: { label: "Khẩn", className: "text-red-600 font-semibold" },
};

function formatDate(d: string) {
  return new Date(d).toLocaleString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function HomePage() {
  const [items, setItems] = useState<RequestItem[]>(initialData);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<RequestItem | null>(null);
  const [form, setForm] = useState({
    type: "Cập nhật thông tin KH",
    customerName: "",
    cif: "",
    title: "",
    priority: "normal" as "normal" | "high" | "urgent",
    note: "",
  });
  const [toast, setToast] = useState("");

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (typeFilter !== "all" && item.type !== typeFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          item.code.toLowerCase().includes(q) ||
          item.cif.toLowerCase().includes(q) ||
          item.customerName.toLowerCase().includes(q) ||
          item.title.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [items, statusFilter, typeFilter, search]);

  const stats = useMemo(() => {
    return {
      total: items.length,
      pending: items.filter((i) => i.status === "pending").length,
      processing: items.filter((i) => i.status === "processing").length,
      approved: items.filter((i) => i.status === "approved").length,
    };
  }, [items]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const count = items.length + 1;
    const code = `HS-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(count).padStart(3, "0")}`;
    const newItem: RequestItem = {
      id: Date.now().toString(),
      code,
      type: form.type,
      customerName: form.customerName.toUpperCase(),
      cif: form.cif.toUpperCase(),
      title: form.title,
      createdBy: "NV001",
      status: "pending",
      priority: form.priority,
      createdAt: new Date().toISOString(),
      note: form.note,
    };
    setItems([newItem, ...items]);
    setShowModal(false);
    setForm({ type: "Cập nhật thông tin KH", customerName: "", cif: "", title: "", priority: "normal", note: "" });
    showToast("✓ Tạo hồ sơ thành công");
  }

  function updateStatus(id: string, status: Status) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    setSelected(null);
    const msg = status === "approved" ? "✓ Đã duyệt hồ sơ" : status === "rejected" ? "✓ Đã từ chối hồ sơ" : "✓ Cập nhật trạng thái";
    showToast(msg);
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800">
      {/* Top bar */}
      <header className="bg-[#0b2545] text-white sticky top-0 z-40 shadow">
        <div className="h-11 flex items-center px-5">
          <div className="flex items-center gap-2.5 mr-8">
            <div className="w-7 h-7 rounded bg-gradient-to-br from-sky-400 to-amber-300 flex items-center justify-center font-bold text-[#0b2545] text-xs">3R</div>
            <span className="font-semibold tracking-wide text-sm">3RD CORE BANKING</span>
          </div>
          <nav className="hidden md:flex items-center gap-1 text-[13px]">
            {["Hồ sơ", "Khách hàng", "Tín dụng", "Báo cáo", "Quản trị"].map((item, i) => (
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
        {/* Sidebar */}
        <aside className="w-56 bg-white border-r border-slate-200 min-h-[calc(100vh-44px)] sticky top-11 hidden md:block">
          <div className="p-4">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Hồ sơ</p>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-sky-50 text-[#0b2545] font-medium text-sm border-l-[3px] border-[#0b2545]">📋 Cần xử lý</div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-md text-slate-600 hover:bg-slate-50 cursor-pointer text-sm">➕ Tạo hồ sơ mới</div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-md text-slate-600 hover:bg-slate-50 cursor-pointer text-sm">📜 Lịch sử xử lý</div>
            </div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-5">Khách hàng</p>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 px-3 py-2 rounded-md text-slate-600 hover:bg-slate-50 cursor-pointer text-sm">🔍 Tra cứu CIF</div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-md text-slate-600 hover:bg-slate-50 cursor-pointer text-sm">👤 Hồ sơ khách hàng</div>
            </div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-5">Báo cáo</p>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 px-3 py-2 rounded-md text-slate-600 hover:bg-slate-50 cursor-pointer text-sm">📊 Báo cáo xử lý</div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-md text-slate-600 hover:bg-slate-50 cursor-pointer text-sm">⏱️ Thời gian xử lý</div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-5 max-w-[1400px]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div>
              <h1 className="text-xl font-semibold text-[#0b2545]">Hồ sơ cần xử lý</h1>
              <p className="text-sm text-slate-500 mt-0.5">Quản lý và phê duyệt các yêu cầu / hồ sơ thông tin</p>
            </div>
            <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 bg-[#0b2545] hover:bg-[#14375e] text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition">
              + Tạo hồ sơ
            </button>
          </div>

          {/* KPI */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="text-xs text-slate-500 mb-1">Tổng hồ sơ</div>
              <div className="text-2xl font-bold text-[#0b2545]">{stats.total}</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="text-xs text-slate-500 mb-1">Chờ xử lý</div>
              <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="text-xs text-slate-500 mb-1">Đang xử lý</div>
              <div className="text-2xl font-bold text-sky-600">{stats.processing}</div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="text-xs text-slate-500 mb-1">Đã duyệt</div>
              <div className="text-2xl font-bold text-emerald-600">{stats.approved}</div>
            </div>
          </div>

          {/* Filter */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4 shadow-sm">
            <div className="flex flex-wrap gap-3 items-end">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Trạng thái</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-9 border border-slate-200 rounded-lg px-3 text-sm bg-white min-w-[130px] focus:outline-none focus:ring-2 focus:ring-sky-200">
                  <option value="all">Tất cả</option>
                  <option value="pending">Chờ xử lý</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="approved">Đã duyệt</option>
                  <option value="rejected">Từ chối</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Loại hồ sơ</label>
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="h-9 border border-slate-200 rounded-lg px-3 text-sm bg-white min-w-[180px] focus:outline-none focus:ring-2 focus:ring-sky-200">
                  <option value="all">Tất cả</option>
                  <option value="Cập nhật thông tin KH">Cập nhật thông tin KH</option>
                  <option value="Mở tài khoản">Mở tài khoản</option>
                  <option value="Đề nghị tín dụng">Đề nghị tín dụng</option>
                  <option value="Khiếu nại">Khiếu nại</option>
                  <option value="Bổ sung hồ sơ">Bổ sung hồ sơ</option>
                </select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Tìm kiếm</label>
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Mã hồ sơ, CIF, tên KH, tiêu đề..." className="h-9 w-full border border-slate-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200" />
              </div>
              <button onClick={() => { setStatusFilter("all"); setTypeFilter("all"); setSearch(""); }} className="h-9 px-4 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition">Đặt lại</button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <span className="text-sm font-medium text-slate-600">{filtered.length} hồ sơ</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wide">
                    <th className="text-left px-4 py-3 font-semibold">Mã hồ sơ</th>
                    <th className="text-left px-4 py-3 font-semibold">Loại</th>
                    <th className="text-left px-4 py-3 font-semibold">Khách hàng / CIF</th>
                    <th className="text-left px-4 py-3 font-semibold">Tiêu đề</th>
                    <th className="text-left px-4 py-3 font-semibold">Ưu tiên</th>
                    <th className="text-left px-4 py-3 font-semibold">Thời gian</th>
                    <th className="text-left px-4 py-3 font-semibold">Trạng thái</th>
                    <th className="text-left px-4 py-3 font-semibold">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => {
                    const st = statusConfig[item.status];
                    const pr = priorityConfig[item.priority];
                    return (
                      <tr key={item.id} className="border-t border-slate-100 hover:bg-slate-50/80 transition">
                        <td className="px-4 py-3 font-medium text-[#0b2545]">{item.code}</td>
                        <td className="px-4 py-3 text-slate-600">{item.type}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium truncate max-w-[160px]">{item.customerName}</div>
                          <div className="text-xs text-slate-400">{item.cif}</div>
                        </td>
                        <td className="px-4 py-3 max-w-[200px] truncate">{item.title}</td>
                        <td className={`px-4 py-3 ${pr.className}`}>{pr.label}</td>
                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap text-[13px]">{formatDate(item.createdAt)}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${st.bg} ${st.text} ${st.border}`}>{st.label}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button onClick={() => setSelected(item)} className="text-xs px-2.5 py-1 border border-slate-200 rounded-md hover:bg-slate-50 mr-1.5 transition">Chi tiết</button>
                          {item.status === "pending" && (
                            <>
                              <button onClick={() => updateStatus(item.id, "processing")} className="text-xs px-2.5 py-1 bg-sky-600 text-white rounded-md hover:bg-sky-700 mr-1.5 transition">Nhận XL</button>
                              <button onClick={() => updateStatus(item.id, "approved")} className="text-xs px-2.5 py-1 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 mr-1.5 transition">Duyệt</button>
                              <button onClick={() => updateStatus(item.id, "rejected")} className="text-xs px-2.5 py-1 border border-red-200 text-red-600 rounded-md hover:bg-red-50 transition">Từ chối</button>
                            </>
                          )}
                          {item.status === "processing" && (
                            <>
                              <button onClick={() => updateStatus(item.id, "approved")} className="text-xs px-2.5 py-1 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 mr-1.5 transition">Duyệt</button>
                              <button onClick={() => updateStatus(item.id, "rejected")} className="text-xs px-2.5 py-1 border border-red-200 text-red-600 rounded-md hover:bg-red-50 transition">Từ chối</button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr><td colSpan={8} className="px-4 py-12 text-center text-slate-400">Không tìm thấy hồ sơ phù hợp</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {toast && <div className="fixed bottom-5 right-5 bg-[#0b2545] text-white px-5 py-3 rounded-lg shadow-xl text-sm z-50">{toast}</div>}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-[#0b2545] text-lg">Tạo hồ sơ mới</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleCreate} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Loại hồ sơ</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full h-10 border border-slate-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200">
                  <option>Cập nhật thông tin KH</option>
                  <option>Mở tài khoản</option>
                  <option>Đề nghị tín dụng</option>
                  <option>Khiếu nại</option>
                  <option>Bổ sung hồ sơ</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">CIF</label>
                <input required value={form.cif} onChange={(e) => setForm({ ...form, cif: e.target.value })} className="w-full h-10 border border-slate-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200" placeholder="CIF001234" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tên khách hàng</label>
                <input required value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} className="w-full h-10 border border-slate-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200" placeholder="NGUYỄN VĂN A" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tiêu đề</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full h-10 border border-slate-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200" placeholder="Mô tả ngắn yêu cầu" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Mức ưu tiên</label>
                <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as any })} className="w-full h-10 border border-slate-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200">
                  <option value="normal">Thường</option>
                  <option value="high">Cao</option>
                  <option value="urgent">Khẩn</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Ghi chú</label>
                <input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className="w-full h-10 border border-slate-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200" placeholder="Ghi chú thêm (nếu có)" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="h-10 px-5 border border-slate-200 rounded-lg text-sm hover:bg-slate-50">Hủy</button>
                <button type="submit" className="h-10 px-5 bg-[#0b2545] text-white rounded-lg text-sm font-medium hover:bg-[#14375e]">Tạo hồ sơ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-[#0b2545] text-lg">Chi tiết hồ sơ</h2>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="p-5 space-y-3 text-sm">
              {[
                ["Mã hồ sơ", selected.code],
                ["Loại", selected.type],
                ["CIF", selected.cif],
                ["Khách hàng", selected.customerName],
                ["Tiêu đề", selected.title],
                ["Ưu tiên", priorityConfig[selected.priority].label],
                ["Người tạo", selected.createdBy],
                ["Thời gian", formatDate(selected.createdAt)],
                ["Ghi chú", selected.note || "—"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-medium text-right max-w-[60%]">{value}</span>
                </div>
              ))}
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Trạng thái</span>
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusConfig[selected.status].bg} ${statusConfig[selected.status].text} ${statusConfig[selected.status].border}`}>
                  {statusConfig[selected.status].label}
                </span>
              </div>
            </div>
            {(selected.status === "pending" || selected.status === "processing") && (
              <div className="px-5 pb-5 flex gap-2 justify-end flex-wrap">
                {selected.status === "pending" && (
                  <button onClick={() => updateStatus(selected.id, "processing")} className="h-10 px-4 bg-sky-600 text-white rounded-lg text-sm hover:bg-sky-700">Nhận xử lý</button>
                )}
                <button onClick={() => updateStatus(selected.id, "rejected")} className="h-10 px-4 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50">Từ chối</button>
                <button onClick={() => updateStatus(selected.id, "approved")} className="h-10 px-4 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">Duyệt</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
