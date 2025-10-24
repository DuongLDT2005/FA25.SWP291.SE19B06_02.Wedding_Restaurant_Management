# Test CRUD Operations cho BookingDAO

## 🎯 Mục Đích

File test này chỉ tập trung vào **CRUD operations cơ bản** của BookingDAO để dễ debug và hiểu logic.

## 📁 Files

- **test_data_simple.sql** - Tạo dữ liệu test tối thiểu (1 customer, 1 hall, 1 menu)
- **BookingDAO.crud.test.js** - Test CRUD operations
- **cleanup_test_simple.sql** - Xóa dữ liệu test

## 🚀 Cách Chạy

### Bước 1: Tạo Dữ Liệu Test trong MySQL

**Cách 1: Copy paste trực tiếp**

```bash
# Bước 1: Vào MySQL
mysql -u root -p

# Bước 2: Copy toàn bộ nội dung file test_data_simple.sql
# Bước 3: Paste vào MySQL và Enter
```

**Cách 2: Dùng command line**

```bash
mysql -u root -p < database/test_data_simple.sql
```

**Cách 3: MySQL Workbench**

- Mở file `database/test_data_simple.sql`
- Execute (⚡)

Script sẽ tạo:

- ✅ 1 Customer (testcustomer@test.com)
- ✅ 1 RestaurantPartner (testpartner@test.com)
- ✅ 1 Restaurant
- ✅ 1 Hall
- ✅ 1 Menu
- ✅ Sử dụng EventType có sẵn (ID=1: Tiệc cưới)

### Bước 2: Chạy Test

```bash
cd server
npm test BookingDAO.crud.test.js
```

### Bước 3: Xem Kết Quả

Test sẽ chạy theo thứ tự:

1. **CREATE** - Tạo booking mới
2. **READ** - Đọc booking từ database
3. **UPDATE** - Cập nhật booking
4. **DELETE** - Xóa booking
5. **STATISTICS** - Thống kê

### Bước 4: Cleanup (Tùy chọn)

```bash
mysql -u root -p WeddingRestaurantManagement < database/cleanup_test_simple.sql
```

## 📊 Test Cases (24 tests)

### CREATE (3 tests)

- ✅ Tạo booking mới thành công
- ✅ Tạo booking với tableCount mặc định = 1
- ✅ Tạo booking với menuID = null

### READ (8 tests)

- ✅ Lấy booking theo ID
- ✅ Trả về null khi ID không tồn tại
- ✅ Lấy tất cả bookings
- ✅ Lấy bookings theo customerID
- ✅ Trả về mảng rỗng khi customer không có booking
- ✅ Lấy bookings theo hallID
- ✅ Lấy bookings theo status
- ✅ Lấy bookings theo date range

### UPDATE (5 tests)

- ✅ Cập nhật booking thành công
- ✅ Ném lỗi khi update booking không tồn tại
- ✅ Cập nhật status thành công
- ✅ Ném lỗi khi update status của booking không tồn tại
- ✅ Cập nhật isChecked thành công

### DELETE (2 tests)

- ✅ Xóa booking thành công
- ✅ Trả về false khi xóa booking không tồn tại

### STATISTICS (3 tests)

- ✅ Đếm số booking theo status
- ✅ Lấy thống kê tổng quan
- ✅ Tính tổng doanh thu

## 🔍 Ví Dụ Output

```
 PASS  src/dao/__tests__/BookingDAO.crud.test.js
  BookingDAO - CRUD Operations
    CREATE - createBooking()
      ✓ Tạo booking mới thành công (45ms)
      ✓ Tạo booking với tableCount mặc định = 1 (23ms)
      ✓ Tạo booking với menuID = null (21ms)
    READ - getBooking*()
      ✓ Lấy booking theo ID (15ms)
      ✓ Trả về null khi ID không tồn tại (12ms)
      ✓ Lấy tất cả bookings (18ms)
      ...
    UPDATE - updateBooking()
      ✓ Cập nhật booking thành công (25ms)
      ...
    DELETE - deleteBooking()
      ✓ Xóa booking thành công (20ms)
      ...
    STATISTICS - count & stats
      ✓ Đếm số booking theo status (10ms)
      ...

Test Suites: 1 passed, 1 total
Tests:       24 passed, 24 total
Time:        2.456s
```

## ⚠️ Lưu Ý

1. **Phải chạy test_data_simple.sql trước** - Test sẽ fail nếu không có dữ liệu
2. **Test tự động cleanup** - Booking được tạo sẽ tự động xóa trong afterAll
3. **EventType ID=1** - Sử dụng "Tiệc cưới" có sẵn từ script.sql
4. **menuID có thể null** - Menu là optional trong booking

## 🐛 Troubleshooting

### ❌ "Không có dữ liệu test"

→ Chạy: `mysql < database/test_data_simple.sql`

### ❌ "Cannot find module"

→ Đảm bảo đang ở thư mục `server/` khi chạy `npm test`

### ❌ "Connection refused"

→ Kiểm tra MySQL server có đang chạy không

### ❌ "Foreign key constraint fails"

→ Kiểm tra Customer, Hall, EventType có tồn tại trong database không

## 📈 Next Steps

Sau khi test CRUD pass, có thể test thêm:

- Status transitions (acceptBooking, confirmBooking, etc.)
- Hall availability checking
- Restaurant partner queries
- Complex scenarios
