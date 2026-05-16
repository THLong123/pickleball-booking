const BookingDAL = require('../dal/bookingDAL');

class BookingBLL {
    static registerBooking(bookingData, callback) {
        // 1. Validate logic nhập liệu trống
        if (!bookingData.fullName || !bookingData.phoneNumber || !bookingData.bookingDate || !bookingData.slotTime) {
            return callback("Vui lòng điền đầy đủ thông tin bắt buộc!");
        }

        // 2. Kiểm tra định dạng số điện thoại đơn giản (phải từ 10 số)
        if (bookingData.phoneNumber.length < 10) {
            return callback("Số điện thoại không hợp lệ!");
        }

        // 3. Kiểm tra trùng lịch (Logic nghiệp vụ quan trọng)
        BookingDAL.checkDuplicate(bookingData.bookingDate, bookingData.slotTime, (err, duplicateSlot) => {
            if (err) return callback("Lỗi hệ thống khi kiểm tra lịch.");
            
            if (duplicateSlot) {
                return callback("Rất tiếc, khung giờ này vào ngày bạn chọn đã có người đặt rồi!");
            }

            // 4. Nếu mọi thứ hợp lệ -> Chuyển xuống DAL để lưu database
            BookingDAL.saveBooking(bookingData, (err, insertId) => {
                if (err) return callback("Lỗi không thể lưu thông tin đặt sân.");
                callback(null, { message: "Đặt sân thành công!", bookingId: insertId });
            });
        });
    }
}

module.exports = BookingBLL;