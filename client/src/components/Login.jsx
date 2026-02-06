// Import React để sử dụng JSX và hook
import React from "react";

// Lấy context dùng chung của app (state global)
import { useAppContext } from "../context/AppContext";

// Thư viện hiển thị thông báo (toast)
import toast from "react-hot-toast";

// Google OAuth
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  /**
   * Lấy các hàm và state từ AppContext
   * - setShowUserLogin: đóng/mở popup login
   * - setUser: lưu user vào state global
   * - navigate: điều hướng trang
   * - axios: instance axios đã config
   * - fetchUser: lấy lại thông tin user từ server
   */
  const { setShowUserLogin, setUser, navigate, axios, fetchUser } =
    useAppContext();

  // state xác định đang ở chế độ login hay register
  const [state, setState] = React.useState("login");

  // state lưu dữ liệu form
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  /**
   * Hàm xử lý submit form
   */
  const onSubmitHandler = async (event) => {
    try {
      // Ngăn reload trang khi submit form
      event.preventDefault();

      /**
       * Gửi request lên server
       * - state = "login" → POST /api/user/login
       * - state = "register" → POST /api/user/register
       */
      const { data } = await axios.post(`/api/user/${state}`, {
        name,
        email,
        password,
      });

      // Nếu server trả về thành công
      if (data.success) {
        // Lưu user vào context ngay
        setUser(data.user);

        // Gọi API lấy đầy đủ thông tin user
        await fetchUser();

        // Chuyển về trang chủ
        navigate("/");

        // Đóng popup login
        setShowUserLogin(false);
      } else {
        // Hiển thị lỗi từ server
        toast.error(data.message);
      }
    } catch (error) {
      // Hiển thị lỗi nếu request thất bại
      toast.error(error.message);
    }
  };

  /**
   * Hàm xử lý đăng nhập bằng Google
   * credential là ID token từ Google
   */
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Gửi ID token từ Google lên server để verify và tạo/đăng nhập user
      const { data } = await axios.post("/api/user/google-auth", {
        token: credentialResponse.credential,
      });

      if (data.success) {
        // Lưu user vào context
        setUser(data.user);

        // Gọi API lấy đầy đủ thông tin user
        await fetchUser();

        // Chuyển về trang chủ
        navigate("/");

        // Đóng popup login
        setShowUserLogin(false);

        toast.success("Đăng nhập thành công!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Đăng nhập Google thất bại");
    }
  };

  const handleGoogleError = () => {
    toast.error("Đăng nhập Google thất bại");
  };

  return (
    /**
     * Lớp nền mờ (overlay)
     * Click vào đây sẽ đóng popup
     */
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50"
    >
      {/* Form đăng nhập / đăng ký */}
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()} // Ngăn click lan ra overlay
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        {/* Tiêu đề */}
        <p className="text-2xl font-medium m-auto">
          <span className="text-primary">Tài khoản</span>{" "}
          {state === "login" ? "Đăng nhập" : "Đăng ký"}
        </p>

        {/* Input tên – chỉ hiển thị khi đăng ký */}
        {state === "register" && (
          <div className="w-full">
            <p>Tên</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="type here"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              type="text"
              required
            />
          </div>
        )}

        {/* Input email */}
        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="email"
            required
          />
        </div>

        {/* Input mật khẩu */}
        <div className="w-full">
          <p>Mật khẩu</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="password"
            required
          />
        </div>

        {/* Chuyển đổi giữa login và register */}
        {state === "register" ? (
          <p>
            Đã có tài khoản?{" "}
            <span
              onClick={() => setState("login")}
              className="text-primary cursor-pointer"
            >
              Đăng nhập
            </span>
          </p>
        ) : (
          <p>
            Tạo tài khoản?{" "}
            <span
              onClick={() => setState("register")}
              className="text-primary cursor-pointer"
            >
              Đăng ký
            </span>
          </p>
        )}

        {/* Nút submit */}
        <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
          {state === "register" ? "Create Account" : "Login"}
        </button>

        {/* Divider */}
        <div className="w-full flex items-center gap-2 my-2">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 text-sm">hoặc</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Nút đăng nhập Google */}
        <div className="w-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap={false}
            theme="outline"
            size="large"
            text="signin_with"
            shape="rectangular"
            locale="vi"
          />
        </div>
      </form>
    </div>
  );
};

export default Login;
