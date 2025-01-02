import request from '@/utils/request'

// 注册接口
export const adminuserRegisterService = ({ Username, Password, repassword }) =>
  request.post('/admin/register', { Username, Password, repassword })

// 登录接口
export const adminuserLoginService = ({ Username, Password }) =>
  request.post('/admin/login', { Username, Password })

// 更新用户密码
export const adminuserUpdatePasswordService = ({ oldPassword, newPassword, UserID }) =>
  request.put('/admin/changePassword/', { oldPassword, newPassword, UserID });
// 获取用户基本信息
export const adminuserGetInfoService = () => request.get('/admin')
// 更新用户基本信息
export const adminuserUpdateInfoService = (data) =>
  request.put('/admin/update', data)