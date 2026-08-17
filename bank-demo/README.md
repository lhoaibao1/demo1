# 3RD Core Banking - Demo (No Database)

Demo giao diện hệ thống nội bộ ngân hàng. **Pure frontend**, không cần database.

## Tính năng demo

- Danh sách giao dịch + filter + tìm kiếm
- Tạo giao dịch mới
- Duyệt / Từ chối giao dịch
- Giao diện kiểu core banking

## Chạy local

```bash
npm install
npm run dev
```

Mở http://localhost:3000

## Build

```bash
npm run build
npm start
```

## Deploy lên Render (rất đơn giản)

1. Push code lên GitHub
2. Render → New → Web Service → chọn repo
3. Cấu hình:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Deploy → xong

Không cần thêm Environment Variable gì cả.
