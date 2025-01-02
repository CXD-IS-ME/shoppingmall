import request from '@/utils/request'

// 注册接口
export const userRegisterService = ({ Username, Password, repassword }) =>
  request.post('/user/save', { Username, Password, repassword })

// 登录接口
export const userLoginService = ({ Username, Password }) =>
  request.post('/user/login', { Username, Password })

// 获取用户基本信息
export const userGetInfoService = (id) => request.get(`/user/${id}`);

// 更新用户基本信息
export const userUpdateInfoService = (data) =>
  request.put('/user/update', data)

// 更新用户头像
export const userUpdateAvatarService = (data) =>
  request.post('/user/uploadAvatar', data)

// 更新用户密码
export const userUpdatePasswordService = ({ oldPassword, newPassword, UserID }) =>
  request.put('/user/changePassword/', { oldPassword, newPassword, UserID });
//根据用户ID，产品ID，创建订单
export const addordersService = ({UserID,OrderDate,TotalAmount}) => request.post('/orders/add',{UserID,OrderDate,TotalAmount})
export const getordersService = () => request.get('/orders')
export const getordersServiceDetsail = (id) => request.get(`/orders/${id}`)
export const delordersService = (id) => request.delete('/orders/',{params:{id}})
export const putordersService = (data) => request.post('/orders/add',data)
//订单详情增
export const addordersDetailsService = (data) => request.post('orderdetails/add',data)

