const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Kết nối đến file database.db
const dbPath = path.resolve(__dirname, '../database.db');
const db = new sqlite3.Database(dbPath);

// Khởi tạo bảng đăng ký sân nếu chưa có
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fullName TEXT,
            phoneNumber TEXT,
            bookingDate TEXT,
            slotTime TEXT
        )
    `);
});

class BookingDAL {
    // Lưu thông tin đăng ký vào Database
    static saveBooking(bookingData, callback) {
        const sql = `INSERT INTO bookings (fullName, phoneNumber, bookingDate, slotTime) VALUES (?, ?, ?, ?)`;
        const params = [bookingData.fullName, bookingData.phoneNumber, bookingData.bookingDate, bookingData.slotTime];
        
        db.run(sql, params, function(err) {
            callback(err, this ? this.lastID : null);
        });
    }

    // Kiểm tra xem giờ đó, ngày đó đã có ai đặt chưa
    static checkDuplicate(date, slot, callback) {
        const sql = `SELECT * FROM bookings WHERE bookingDate = ? AND slotTime = ?`;
        db.get(sql, [date, slot], (err, row) => {
            callback(err, row);
        });
    }
}

module.exports = BookingDAL;