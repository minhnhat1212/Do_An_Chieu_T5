import { v2 as cloudinary } from "cloudinary";
// import cloudinary v2 SDK để sử dụng các API upload, delete, config ảnh/video

/**
 * Hàm khởi tạo kết nối Cloudinary
 * - Được gọi 1 lần khi server start
 * - Thiết lập thông tin xác thực từ biến môi trường (.env)
 */
const connectCloudinary = async () => {
  cloudinary.config({
    // Tên cloud (mỗi tài khoản Cloudinary có 1 cloud_name riêng)
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,

    // API key dùng để xác thực request
    api_key: process.env.CLOUDINARY_API_KEY,

    // API secret (BẮT BUỘC giữ kín, không push lên GitHub)
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // Sau khi config xong, có thể dùng cloudinary.uploader.upload(...)
};

// Export hàm để gọi trong file khởi động server (vd: server.js / index.js)
export default connectCloudinary;
