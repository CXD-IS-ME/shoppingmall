// src/api/ordersDetail.js

import request from '@/utils/request';

// 根据UserID获取订单详情
export const getOrdersDetailsService = (userId) => request.get(`/orderdetailsbyuser/${userId}`);