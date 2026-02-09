import mongoose from "mongoose";
// Import mongoose để làm việc với MongoDB (ORM cho Node.js)

/**
 * Hàm kết nối tới MongoDB
 * - Hỗ trợ cả MongoDB local và MongoDB Atlas
 * - Tự động kiểm tra & chuẩn hóa URI
 */
const connectDB = async () => {
  try {
    // Lấy MongoDB URI từ biến môi trường
    // Nếu không có thì mặc định dùng MongoDB local
    let mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017";

    // Đảm bảo URI có đúng scheme (mongodb:// hoặc mongodb+srv://)
    // Tránh lỗi khi chỉ truyền host:port
    if (
      !mongoUri.startsWith("mongodb://") &&
      !mongoUri.startsWith("mongodb+srv://")
    ) {
      mongoUri = `mongodb://${mongoUri}`;
    }

    // Lắng nghe sự kiện kết nối thành công
    mongoose.connection.on("connected", () => {
      console.log("✅ Database Connected to:", mongoUri);
    });

    // Lắng nghe lỗi kết nối MongoDB
    mongoose.connection.on("error", (err) => {
      console.error("❌ Database connection error:", err);
    });

    // Thực hiện kết nối MongoDB
    // mongoose sẽ tự quản lý connection pool
    await mongoose.connect(mongoUri);
  } catch (error) {
    // Bắt lỗi nếu không thể kết nối database
    console.error("❌ Database connection error:", error.message);

    // Gợi ý khi chạy local
    console.log("⚠️  Make sure MongoDB is running on localhost:27017");

    // Dừng server nếu database không kết nối được
    process.exit(1);
  }
};

// Export để gọi trong file khởi động server (index.js / server.js)
export default connectDB;
