import multer from "multer";
import path from "path";
import fs from "fs";

// Khai báo tên thư mục dùng để lưu các file upload
const uploadsDir = "uploads";

// Kiểm tra xem thư mục uploads đã tồn tại hay chưa
// Nếu chưa tồn tại thì tạo mới thư mục
// recursive: true giúp tạo cả các thư mục cha nếu cần
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Cấu hình storage cho multer (cách lưu file trên ổ đĩa)
const storage = multer.diskStorage({
  // Xác định thư mục lưu file upload
  destination: function (req, file, cb) {
    // Lưu file vào thư mục uploads/
    cb(null, "uploads/");
  },

  // Xác định tên file khi lưu
  filename: function (req, file, cb) {
    // Dùng timestamp (Date.now()) để tránh trùng tên file
    // path.extname(file.originalname) giữ nguyên phần mở rộng của file (vd: .jpg, .png)
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Khởi tạo middleware upload với cấu hình storage ở trên
// Middleware này sẽ được dùng trong route để xử lý upload file
const upload = multer({ storage });

// Export upload để sử dụng ở các file route/controller khác
export default upload;
