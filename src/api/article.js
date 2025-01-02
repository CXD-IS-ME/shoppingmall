import request from '@/utils/request'
// 分类：获取产品分类
export const artGetChannelsService = () => request.get('/categories')
// 分类：添加产品分类
export const artAddChannelService = (data) => request.post('/categories/add', data)
// 分类：编辑产品分类
export const artEditChannelService = (data) =>
  request.put('/categories/'+data.CategoryID, data)
// 分类：删除产品分类
export const artDelChannelService = (id) =>
  request.delete(`/categories/${id}`);

// 产品：获取产品列表
export const artGetListService = (params) => {
  const { pagenum, pagesize, CategoryID,state } = params;
  return request.get('/products', {
    params: { pagenum: Number(pagenum), pagesize: Number(pagesize), CategoryID,state }
  });
}

// 产品：添加产品
// 注意：data需要是一个formData格式的对象
export const artPublishService = (data) => request.post('/products/add', data)

// 产品：获取产品详情
export const artGetDetailService = (id) => {
  return request.get(`/products/${id}`); // 确保 URL 正确
};

// 产品：编辑产品接口
export const artEditService = (data) => request.put('/products/'+data.ProductID,data)


// 产品：删除产品接口
export const artDelService = (id) =>
  request.delete(`/products/delete/${id}` )
