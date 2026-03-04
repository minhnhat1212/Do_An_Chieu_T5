import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import axios from 'axios'
import toast from 'react-hot-toast'

const SellerLogin = () => {

    // Lấy các giá trị từ AppContext
    // isSeller → trạng thái người dùng có đang đăng nhập seller hay không
    // setIsSeller → dùng để cập nhật trạng thái đăng nhập seller
    // navigate → hàm điều hướng trang
    const { isSeller, setIsSeller, navigate } = useAppContext()

    // State lưu giá trị email và password
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    // Hàm xử lý khi submit form đăng nhập
    const onSubmitHandler = async (event) => {
        event.preventDefault(); // Ngăn trang reload khi submit form
        
        try {
            // Gửi request POST lên server để đăng nhập
            const { data } = await axios.post('/api/seller/login', { email, password })

            // Nếu server trả về success = true → đăng nhập thành công
            if (data.success) {
                setIsSeller(true)          // lưu trạng thái đăng nhập vào context
                navigate('/seller')        // chuyển sang dashboard seller
            } 
            else {
                toast.error(data.message)  // Hiển thị lỗi nếu đăng nhập sai
            }
        } catch (error) {
            // Hiển thị lỗi nếu server không phản hồi hoặc xảy ra exception
            toast.error(error.message)
        }
    }


    // Nếu seller đã đăng nhập → tự động chuyển sang trang seller
    useEffect(() => {
        if (isSeller) {
            navigate("/seller")
        }
    }, [isSeller])


    // Nếu đã đăng nhập thì không hiển thị form login nữa
    return !isSeller && (
        <form 
            onSubmit={onSubmitHandler} 
            className='min-h-screen flex items-center text-sm text-gray-600'
        >
            <div className='flex flex-col gap-5 m-auto items-start 
                p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl 
                border border-gray-200'
            >
                <p className='text-2xl font-medium m-auto'>
                    <span className='text-primary'>Seller</span> Login
                </p>

                {/* Input Email */}
                <div className='w-full'>
                    <p>Email</p>
                    <input 
                        onChange={(e) => setEmail(e.target.value)} 
                        value={email}
                        type='email' 
                        placeholder='enter your email'
                        className='border border-gray-200 rounded w-full p-2 mt-1 outline-primary' 
                        required
                    />
                </div>

                {/* Input Password */}
                <div className='w-full'>
                    <p>Password</p>
                    <input 
                        onChange={(e) => setPassword(e.target.value)} 
                        value={password}
                        type='password' 
                        placeholder='enter your password'
                        className='border border-gray-200 rounded w-full p-2 mt-1 outline-primary'
                        required
                    />
                </div>

                {/* Nút đăng nhập */}
                <button 
                    className='bg-primary text-white w-full py-2 rounded-md cursor-pointer'
                >
                    Login
                </button>
                
            </div>
        </form>
    )
}

export default SellerLogin
