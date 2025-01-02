// orders.js
import request from '@/utils/request';

export const artGetListService = () => {
  return request.get('/orders');
};

export const artGetDetailService = (id) => {
  return request.get(`/orders/${id}`);
};

export const artUpdateOrderService = (id, data) => {
  return request.put(`/orders/${id}`, data);
};
// 定义获取产品详情的服务
export const artGetProductDetailsService = (id) => {
    return request.get(`/products/${id}`);
  };