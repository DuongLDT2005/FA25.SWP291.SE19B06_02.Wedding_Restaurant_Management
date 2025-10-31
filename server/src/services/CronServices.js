import cron from 'node-cron';
import { insertDeposit,findBooking  } from '../dao/mongoDAO';

/**
 * Thiết lập Cron Job để kiểm tra các booking đã hết hạn.
 * Chạy tác vụ này mỗi 1 giờ (vào phút 0 của mỗi giờ: 00:00, 01:00, 02:00, ...)
 */
function setupExpirationChecker() {
    // Cron string '0 * * * *': phút (0), giờ (*), ngày trong tháng (*), tháng (*), ngày trong tuần (*)
    cron.schedule('0 1 * * *', async () => {
        const jobStartTime = new Date();
        console.log(`--- CRON JOB: Bắt đầu kiểm tra hết hạn lúc ${jobStartTime.toLocaleTimeString()} ---`);

        try {
            // 1. Truy vấn MongoDB để lấy danh sách các booking đã hết hạn
            const expiredBookings = await findBooking(jobStartTime);

            if (expiredBookings.length === 0) {
                console.log('Không tìm thấy booking nào cần hết hạn.');
                return;
            }

            // 2. Lấy ra danh sách IDs
            const expiredBookingIds = expiredBookings.map(b => b.bookingID);
            console.log(`Tìm thấy ${expiredBookingIds.length} booking đã quá hạn.`);

            // 3. Thực hiện cập nhật hàng loạt (Bulk Update)
            const modifiedCount = await BookingDAO.bulkUpdateToExpired(expiredBookingIds);

            console.log(`Hoàn thành. Đã cập nhật ${modifiedCount} booking sang trạng thái 'EXPIRED'.`);

        } catch (error) {
            console.error('LỖI trong quá trình chạy Cron Job:', error);
        }
        
        console.log('--- CRON JOB: Kết thúc ---');
    });
    console.log('Cron Job kiểm tra hết hạn đã được thiết lập (chạy mỗi 1 giờ).');
}

// BẠN CẦN GỌI HÀM NÀY KHI SERVER KHỞI ĐỘNG
// setupExpirationChecker();