import cron from 'node-cron';
import BookingDAO from '../dao/BookingDAO.js';

/**
 * Thiết lập Cron Job để kiểm tra các booking đã hết hạn.
 * Chạy tác vụ này mỗi 1 giờ (vào phút 0 của mỗi giờ: 00:00, 01:00, 02:00, ...)
 */
export function setupExpirationChecker({ days = 2 } = {}) {
    // Cron string '0 * * * *': phút (0), giờ (*), ngày trong tháng (*), tháng (*), ngày trong tuần (*)
    cron.schedule('0 * * * *', async () => {
        const jobStartTime = new Date();
        const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        console.log(`--- CRON JOB: Bắt đầu kiểm tra hết hạn lúc ${jobStartTime.toLocaleTimeString()} | cutoff=${cutoff.toISOString()} ---`);

        try {
            // Dùng cơ chế batch để tận dụng index (status, createdAt) và tránh khoá bảng lâu.
            const modifiedCount = await BookingDAO.bulkExpireConfirmedOlderThanBatch(cutoff, { batchSize: 1000, setChecked: true });
            console.log(`Hoàn thành. Đã cập nhật ${modifiedCount} booking (CONFIRMED -> EXPIRED).`);
        } catch (error) {
            console.error('LỖI trong quá trình chạy Cron Job:', error);
        }
        
        console.log('--- CRON JOB: Kết thúc ---');
    });
    console.log('Cron Job kiểm tra hết hạn đã được thiết lập (chạy mỗi 1 giờ).');
}

// BẠN CẦN GỌI HÀM NÀY KHI SERVER KHỞI ĐỘNG
// setupExpirationChecker();