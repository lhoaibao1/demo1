# 3RD Core Banking – Mô tả giao diện

## Tổng quan
Giao diện demo hệ thống nội bộ ngân hàng (back-office), phong cách **enterprise / core banking**.

Màu chủ đạo: Navy đậm (`#0b2545`) + trắng + xám nhạt.  
Ưu tiên: rõ ràng, mật độ thông tin cao, dễ thao tác.

---

## Cấu trúc màn hình

### 1. Top Bar (Header)
- Logo 3RD + tên hệ thống
- Menu ngang: Giao dịch | Khách hàng | Tín dụng | Báo cáo | Quản trị
- Thông tin chi nhánh + user đang đăng nhập (Checker)

### 2. Sidebar trái
- Nhóm **Giao dịch**: Cần xử lý (active), Tạo mới, Lịch sử
- Nhóm **Khách hàng**: Tra cứu CIF, Mở tài khoản
- Nhóm **Báo cáo**: Cuối ngày, Rủi ro

### 3. Vùng nội dung chính

#### KPI Cards (4 thẻ)
| Thẻ | Ý nghĩa |
|-----|---------|
| Tổng giao dịch | Số lượng giao dịch hiện có |
| Chờ duyệt | Số giao dịch status = pending |
| Đã duyệt | Số giao dịch đã approve |
| Tổng giá trị | Tổng số tiền của tất cả giao dịch |

#### Thanh bộ lọc
- Lọc theo **Trạng thái**
- Lọc theo **Loại giao dịch**
- Ô **Tìm kiếm** (mã GD / số TK / tên KH)
- Nút **Đặt lại**

#### Bảng danh sách giao dịch
Cột:
- Mã GD
- Số tài khoản
- Khách hàng
- Loại
- Số tiền (định dạng VNĐ)
- Thời gian
- Trạng thái (badge màu)
- Thao tác (Chi tiết / Duyệt / Từ chối)

### 4. Modal

**Tạo giao dịch mới**
- Loại giao dịch
- Số tài khoản
- Tên khách hàng
- Số tiền
- Nội dung
- Nút Hủy / Lưu & Gửi duyệt

**Chi tiết giao dịch**
- Hiển thị đầy đủ thông tin
- Nếu đang chờ duyệt → có nút Duyệt / Từ chối

### 5. Toast thông báo
Hiện góc dưới bên phải khi:
- Tạo thành công
- Duyệt / Từ chối thành công

---

## Trạng thái giao dịch & màu

| Status | Nhãn | Màu |
|--------|------|-----|
| pending | Chờ duyệt | Amber / Vàng |
| approved | Đã duyệt | Emerald / Xanh lá |
| rejected | Từ chối | Red / Đỏ |
| processing | Đang xử lý | Sky / Xanh dương |

---

## Chức năng đang hoạt động (demo)

- ✅ Xem danh sách + KPI realtime
- ✅ Lọc theo trạng thái / loại
- ✅ Tìm kiếm
- ✅ Tạo giao dịch mới
- ✅ Xem chi tiết
- ✅ Duyệt giao dịch
- ✅ Từ chối giao dịch
- ✅ Toast thông báo

> Dữ liệu lưu trên state React (frontend only), refresh trang sẽ về dữ liệu mẫu ban đầu.
