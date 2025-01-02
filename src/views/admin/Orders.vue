<template>
    <div class="orders-container">
      <el-table :data="orders" style="width: 100%">
        <el-table-column prop="OrderID" label="订单ID" width="180"></el-table-column>
        <el-table-column prop="OrderDate" label="订单日期" width="180"></el-table-column>
        <el-table-column prop="TotalAmount" label="总金额"></el-table-column>
        <el-table-column prop="OrderStatus" label="订单状态"></el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="text" size="small" @click="viewOrder(row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <el-dialog title="订单详情" v-model="dialogVisible" width="30%">
        <div v-if="selectedOrder">
          <p>订单ID：{{ selectedOrder.OrderID }}</p>
          <p>用户ID：{{ selectedOrder.UserID }}</p>
          <p>订单日期：{{ selectedOrder.OrderDate }}</p>
          <p>总金额：{{ selectedOrder.TotalAmount }}</p>
          <p>订单状态：
            <el-select v-model="selectedOrder.OrderStatus" placeholder="请选择状态" @change="updateOrderStatus">
              <el-option label="未发货" value="未发货"></el-option>
              <el-option label="已发货" value="已发货"></el-option>
            </el-select>
          </p>
          <p>用户信息：{{ selectedOrder.user.Username }}</p>
          <p>收货地址：{{ selectedOrder.user.Address }}</p>
          <p>订单详情：</p>
          <ul>
            <li v-for="detail in selectedOrder.orderDetails" :key="detail.OrderDetailID">
              产品名称：{{ detail.productName }}，数量：{{ detail.Quantity }}
            </li>
          </ul>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { artGetListService, artGetDetailService, artUpdateOrderService, artGetProductDetailsService } from '../../api/oders'; // 确保路径正确，并且添加了获取产品详情的服务
  
  const orders = ref([]);
  const dialogVisible = ref(false);
  const selectedOrder = ref({});
  
  // 获取订单列表
  const fetchOrders = async () => {
    try {
      const response = await artGetListService();
      orders.value = response.data.data.data; // 确保响应数据结构匹配
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };
  
  // 获取单个订单详情
  const viewOrder = async (order) => {
  try {
    const response = await artGetDetailService(order.OrderID);
    selectedOrder.value = response.data.data.data;

    // 根据ProductID获取产品名称
    for (let detail of selectedOrder.value.orderDetails) {
      const productResponse = await artGetProductDetailsService(detail.ProductID);
      // 检查productResponse是否包含所需的数据结构
      if (productResponse && productResponse.data && productResponse.data.data && productResponse.data.data.data && productResponse.data.data.data.ProductName) {
        // 由于ProductName在嵌套的data对象中，我们需要访问productResponse.data.data.ProductName
        detail.productName = productResponse.data.data.data.ProductName;
      } else {
        // 处理产品详情为空的情况
        detail.productName = '产品详情缺失';
      }
    }

    dialogVisible.value = true;
  } catch (error) {
    console.error('Failed to fetch order details:', error);
  }
};
viewOrder()
  // 更新订单状态
  const updateOrderStatus = async () => {
    if (!selectedOrder.value.OrderID) return; // 确保订单ID存在
    try {
      const response = await artUpdateOrderService(selectedOrder.value.OrderID, { OrderStatus: selectedOrder.value.OrderStatus });
      console.log('Order status updated:', response);
      await fetchOrders(); // 重新获取订单列表以更新状态
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };
  
  onMounted(fetchOrders);

  </script>
  
  <style scoped>
  .orders-container {
    padding: 20px;
  }
  </style>