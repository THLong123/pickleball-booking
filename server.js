const express = require('express');
const path = require('path');
const BookingBLL = require('./bll/bookingBLL');

const app = express();
const PORT = 3000;

// Cấu hình nhận dữ liệu dạng JSON từ Front-end gửi lên
app.use(express.json());

// Mở thư mục public làm tài nguyên tĩnh (Chứa file index.html)
app.use(express.static(path.join(__dirname, 'public')));

// API Đăng ký đặt sân
app.post('/api/book-court', (req, res) => {
    const bookingData = req.body;

    // Chuyển dữ liệu xuống tầng Business xử lý logic nghiệp vụ
    BookingBLL.registerBooking(bookingData, (error, successData) => {
        if (error) {
            // Nếu có lỗi logic hoặc lỗi DB, trả về mã 400 kèm thông báo
            return res.status(400).json({ error: error });
        }
        // Thành công, trả về dữ liệu sạch cho client
        return res.status(200).json({ message: successData.message, data: successData });
    });
});

// Chạy server
app.listen(PORT, () => {
    console.log(`Server đang chạy mượt mà tại: http://localhost:${PORT}`);
});