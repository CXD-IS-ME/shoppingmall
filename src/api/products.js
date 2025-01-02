import request from '@/utils/request'

// 产品接口
export const productGetInfoService = () =>request.get('/products')
export const userproductGetInfoService = () =>request.get('/productUser')
