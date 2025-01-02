<template>
  <div>
    <el-table :data="orderDetails" style="width: 100%" v-loading="loading">
      <el-table-column prop="products.ProductName" label="产品名称"></el-table-column>
      <el-table-column prop="products.Description" label="产品描述"></el-table-column>
      <el-table-column prop="products.Price" label="产品价格"></el-table-column>
      <el-table-column prop="Quantity" label="数量"></el-table-column>
      <el-table-column prop="orders.OrderDate" label="订单日期"></el-table-column>
      <el-table-column prop="orders.TotalAmount" label="订单总金额"></el-table-column>
      <el-table-column prop="orders.OrderStatus" label="订单状态"></el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { getOrdersDetailsService } from '../../api/odersDetail';

const orderDetails = ref([]);
const loading = ref(false);
const UserID = ref(localStorage.getItem('res')); // 从本地存储中获取 UserID

const getData = async () => {
  const res = await getOrdersDetailsService(UserID.value);
  if (res.data.code === 200 && res.data.data) {
    orderDetails.value = res.data.data.data; // 确保这里正确地访问数组
  } else {
    ElMessage.error(res.data.msg || '获取订单详情失败');
  }
  loading.value = false;
};
onMounted(getData)
</script>

<style scoped>
img {
  border-radius: 4px;
}
.el-table {
  margin-top: 20px; /* 表格顶部间距 */
  border-radius: 10px; /* 表格圆角 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 表格阴影 */
}

.el-table th {
  background-color: #f4f4f9; /* 表头背景色 */
  color: #333; /* 表头字体颜色 */
  text-align: left; /* 表头文本居左 */
  font-weight: 500; /* 表头字体加粗 */
}

.el-table td {
  color: #666; /* 单元格字体颜色 */
}

.el-table-column {
  text-align: center; /* 单元格文本居中 */
}
.v-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 视口高度 */
}

.el-loading-spinner {
  border-color: #409eff !important; /* 加载动画颜色 */
}
@media (max-width: 768px) {
  .el-table {
    width: 100%; /* 表格宽度 */
    overflow-x: auto; /* 超出部分滚动 */
  }
}
div {
  padding: 20px; /* 页面内边距 */
}
</style>