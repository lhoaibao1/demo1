# 3RD Core Banking – Hệ thống xử lý hồ sơ thông tin

## Mục tiêu
Demo giao diện **hệ thống nội bộ ngân hàng** dùng để xử lý thông tin / hồ sơ (không phải chuyển tiền).

Phù hợp với các nghiệp vụ:
- Cập nhật thông tin khách hàng
- Mở tài khoản
- Đề nghị tín dụng
- Khiếu nại
- Bổ sung hồ sơ
- Workflow Maker → Checker

---

## Cấu trúc giao diện

### 1. Top Bar
- Logo 3RD + tên hệ thống
- Menu: Hồ sơ | Khách hàng | Tín dụng | Báo cáo | Quản trị
- Thông tin chi nhánh + user (Checker)

### 2. Sidebar
- **Hồ sơ**: Cần xử lý, Tạo hồ sơ mới, Lịch sử xử lý
- **Khách hàng**: Tra cứu CIF, Hồ sơ khách hàng
- **Báo cáo**: Báo cáo xử lý, Thời gian xử lý

### 3. Nội dung chính

#### KPI
- Tổng hồ sơ
- Chờ xử lý
- Đang xử lý
- Đã duyệt

#### Bộ lọc
- Trạng thái
- Loại hồ sơ
- Tìm kiếm (mã HS / CIF / tên KH / tiêu đề)

#### Bảng danh sách
| Cột | Mô tả |
|-----|--------|
| Mã hồ sơ | HS-YYYYMMDD-xxx |
| Loại | Loại yêu cầu |
| Khách hàng / CIF | Tên + mã CIF |
| Tiêu đề | Mô tả ngắn |
| Ưu tiên | Thường / Cao / Khẩn |
| Thời gian | Ngày tạo |
| Trạng thái | Badge màu |
| Thao tác | Chi tiết / Nhận XL / Duyệt / Từ chối |

### 4. Modal
- **Tạo hồ sơ mới**: loại, CIF, tên KH, tiêu đề, ưu tiên, ghi chú
- **Chi tiết hồ sơ**: xem đầy đủ + thao tác duyệt / từ chối / nhận xử lý

---

## Trạng thái hồ sơ

| Status | Nhãn | Màu |
|--------|------|-----|
| pending | Chờ xử lý | Amber |
| processing | Đang xử lý | Sky |
| approved | Đã duyệt | Emerald |
| rejected | Từ chối | Red |

## Mức ưu tiên
- Thường
- Cao
- Khẩn

---

## Chức năng demo đang chạy
- ✅ Xem danh sách + KPI realtime
- ✅ Lọc trạng thái / loại hồ sơ
- ✅ Tìm kiếm
- ✅ Tạo hồ sơ mới
- ✅ Xem chi tiết
- ✅ Nhận xử lý
- ✅ Duyệt / Từ chối
- ✅ Toast thông báo

Dữ liệu lưu trên state (frontend only).
