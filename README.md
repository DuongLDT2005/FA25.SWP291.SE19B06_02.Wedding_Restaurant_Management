# 📌 Project Rules – Wedding Restaurant Booking

## 🏗️ Project Structure
- server/: Backend Node.js (Express, MySQL)
- client/: Frontend React
- .env: file cấu hình môi trường (không commit)

## ⚙️ Coding Rules
- Code dùng tiếng Anh
- CamelCase cho biến/hàm → userName, getUserData
- PascalCase cho React Component → LoginPage, Navbar
- UPPER_CASE cho hằng số → JWT_SECRET
- Backend: tách rõ routes, controllers, models (không query DB trong routes)
- Frontend: tách components (dùng chung) và pages (theo màn hình), API gọi qua api/axios.js
- API phải trả về JSON chuẩn, có xử lý lỗi

## 🔀 Git Workflow
- Branch theo tên mỗi người
- Commit message rõ ràng, vd:
  - feat: add login API
  - fix: resolve CORS issue
  - docs: update README
- Không push trực tiếp lên main, push lên branch của riêng mình, mọi thay đổi phải tạo pull request

## ✅ Checklist trước khi merge
- Code dễ đọc, đặt tên đúng chuẩn
- API có xử lý lỗi
- Không commit .env và node_modules/

## 📖 Setup
### Backend
cd server
npm install
npm run dev

### Frontend
cd client
npm install
npm start
