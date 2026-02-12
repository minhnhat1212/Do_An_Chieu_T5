/**
 * Route quản lý người dùng (users)
 * Cung cấp các endpoint cho user đăng ký, đăng nhập, đăng xuất, cập nhật profile
 */
import express from 'express';
import { isAuth, login, logout, register, updateProfile, googleAuth } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';
import upload from '../configs/multerUser.js';

const userRouter = express.Router()

// Route đăng ký tài khoản mới - không yêu cầu authentication
userRouter.post('/register', register)

// Route đăng nhập - không yêu cầu authentication
userRouter.post('/login', login)

// Route đăng nhập/đăng ký bằng Google - không yêu cầu authentication
userRouter.post('/google-auth', googleAuth)

// Route kiểm tra trạng thái đăng nhập của user - yêu cầu authentication
userRouter.get('/is-auth', authUser, isAuth)

// Route đăng xuất - xóa session/token, yêu cầu authentication
userRouter.get('/logout', authUser, logout)

// Route cập nhật thông tin profile - cho phép upload avatar (upload.single('avatar'))
// Yêu cầu đăng nhập và authentication
userRouter.put('/update-profile', authUser, upload.single('avatar'), updateProfile)

export default userRouter;
