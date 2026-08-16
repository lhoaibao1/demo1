# 3RD Core Banking - Internal System Demo

Demo hệ thống nội bộ ngân hàng (Next.js + MongoDB + Tailwind).

## Tính năng

- Danh sách giao dịch với filter (trạng thái, loại, tìm kiếm)
- Tạo giao dịch mới (modal)
- Duyệt / Từ chối giao dịch
- Lưu trữ NoSQL bằng MongoDB
- Giao diện kiểu core banking (navy, mật độ cao, chuyên nghiệp)

## Yêu cầu

- Node.js 18+
- MongoDB (local hoặc Atlas free)

## Cài đặt & chạy

```bash
# 1. Clone repo (sau khi bạn push lên Git)
git clone <your-repo-url>
cd bank-demo

# 2. Cài dependency
npm install

# 3. Cấu hình database
cp .env.local.example .env.local
# Sửa MONGODB_URI nếu dùng Atlas

# 4. Chạy MongoDB local (nếu dùng local)
# macOS: brew services start mongodb-community
# Windows: chạy MongoDB service
# Docker: docker run -d -p 27017:27017 --name mongo mongo:latest

# 5. Seed dữ liệu mẫu
npm run seed

# 6. Chạy dev
npm run dev
```

Mở http://localhost:3000

## Build production

```bash
npm run build
npm start
```

## Cấu trúc chính

- `src/app/page.tsx` – Giao diện chính
- `src/app/api/transactions/` – API CRUD
- `src/models/Transaction.ts` – Schema MongoDB
- `src/lib/db.ts` – Kết nối MongoDB
- `src/scripts/seed.ts` – Dữ liệu mẫu

## Push lên Git

```bash
git init
git add .
git commit -m "feat: 3RD Core Banking demo"
git branch -M main
git remote add origin <your-repo>
git push -u origin main
```

**Lưu ý:** Không commit file `.env.local` (đã có trong .gitignore).
