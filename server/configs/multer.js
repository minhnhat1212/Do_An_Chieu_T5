import multer from "multer";
import path from "path";
import fs from "fs";

// Khai báo tên thư mục dùng để lưu file upload
const uploadsDir = "uploads";

// Kiểm tra xem thư mục uploads đã tồn tại hay chưa
// Nếu chưa tồn tại thì tạo mới (recursive để tạo cả thư mục cha nếu cần)
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Cấu hình nơi lưu trữ file cho multer
const storage = multer.diskStorage({
  // Xác định thư mục lưu file upload
  destination: function (req, file, cb) {
    // Lưu file vào thư mục uploads/
    cb(null, "uploads/");
  },

  // Xác định tên file khi lưu
  filename: function (req, file, cb) {
    // Đặt tên file theo timestamp hiện tại
    // Giữ nguyên phần mở rộng của file gốc (jpg, png, ...)
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Khởi tạo middleware upload của multer với cấu hình storage ở trên
export const upload = multer({ storage });
