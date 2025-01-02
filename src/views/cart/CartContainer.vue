<template>
  <div>
    <el-table :data="cartItems" style="width: 100%" height="250">
      <el-table-column prop="ProductName" label="商品名"></el-table-column>
      <el-table-column label="数量">
        <template #default="{ row }">
          <el-input-number v-model="row.quantity" :min="1" @change="updateProductQuantity(row.ProductID, $event)" />
        </template>
      </el-table-column>
      <el-table-column prop="Price" label="单价"></el-table-column>
      <el-table-column label="总价">
        <template #default="{ row }">
          ￥{{ (row.Price * row.quantity).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="danger" @click="removeFromCart(row.ProductID)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="cartItems.length">
      <h3>总价格为: ￥{{ totalPrice }}</h3>
      <el-button type="primary" @click="promptForAddress">结算</el-button>
    </div>
    <!-- 对话框、地址 -->
    <el-dialog v-model="address">
      <div class="box">
        <el-input v-model="input" style="width: 240px" placeholder="请输入地址" />
        <el-button type="primary" plain @click="address = false">返回</el-button>
        <el-button type="success" plain @click="submitAddress">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect, computed } from 'vue';
import { useCartStore } from '@/stores/cart';
import { ElMessage, ElMessageBox } from 'element-plus';
import { addordersService, addordersDetailsService, userUpdateInfoService, userGetInfoService } from '../../api/user';

const cartStore = useCartStore();
const cartItems = ref([{}]);
const params = ref([
  {
    UserID: '', // 用户ID
    OrderDate: '', // 订单日期
    TotalAmount: 0, // 总金额
    OrderID: '', // 订单ID
    ProductID: '', // 产品ID
    Quantity: '', // 产品数量
    OrderStatus: '' // 订单状态（已支付，未支付）
  }
]);
const address = ref(false);
const input = ref('');
const isOrderCreated = ref(false); // 新增一个标志位，用于判断是否已创建订单

// 初始化购物车数据
onMounted(() => {
  cartItems.value = [...cartStore.cartItems];
});

// 监听购物车变化并保存到 localStorage
watchEffect(() => {
  cartStore.saveCartToLocalStorage();
});

// 从购物车删除商品
const removeFromCart = (productId) => {
  cartItems.value = cartItems.value.filter(item => item.ProductID !== productId);
  cartStore.removeFromCart(productId);
  ElMessage.success('从购物车删除商品成功');
};

// 更新购物车中商品的数量
const updateProductQuantity = (productId, quantity) => {
  if (quantity > 0) {
    const index = cartItems.value.findIndex(item => item.ProductID === productId);
    if (index !== -1) {
      cartItems.value[index].quantity = quantity;
      cartStore.updateProductQuantity({ ProductID: productId, Quantity: quantity });
      ElMessage.success('更新商品数量成功');
    }
  }
};

const totalPrice = computed(() => cartStore.cartTotal);

function formatDateTime(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份是从0开始的
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const now = new Date();
const formattedNow = formatDateTime(now);

// 提示用户填写地址
const promptForAddress = async () => {
  const userInfoRes = await userGetInfoService(localStorage.getItem('res'));
  const userAddress = userInfoRes.data.data.data[0].Address;

  if (!userAddress) {
    // 用户地址为空，弹出对话框提示用户填写地址信息
    ElMessageBox({
      title: '地址信息缺失',
      message: '请填写您的收货地址信息！',
      showCancelButton: true,
      confirmButtonText: '去填写',
      cancelButtonText: '取消',
    })
    .then(() => {
      address.value = true; // 显示地址对话框
    })
    .catch(() => {
      // 用户点击“取消”按钮后，不执行任何操作
    });
  } else if (!isOrderCreated.value) {
    // 用户地址不为空，且订单未创建，继续执行结算流程
    createOrder();
  }
};

// 创建订单
const createOrder = async () => {
  params.value.UserID = localStorage.getItem('res');
  params.value.OrderDate = formattedNow;
  params.value.TotalAmount = totalPrice.value;

  try {
    const response = await addordersService(params.value);

    if (response.data.data.data.OrderID) {
      const orderID = response.data.data.data.OrderID;
      // 准备订单详情数据
      const orderDetailsData = cartItems.value.map(item => ({
        OrderID: orderID,
        ProductID: item.ProductID,
        Quantity: item.quantity,
        UserID: localStorage.getItem('res')
      }));

      await addordersDetailsService(orderDetailsData);
      ElMessage.success('结算成功');
      cartStore.clearCart();
      location.reload();
      localStorage.removeItem('cartItems');
      isOrderCreated.value = true; // 标记订单已创建
    } else {
      throw new Error('订单创建失败');
    }
  } catch (error) {
    ElMessage.error('结算失败');
  }
};

// 提交地址
const submitAddress = async () => {
  try {
    const res = await userGetInfoService(localStorage.getItem('res'));
    const userInfo = res.data.data.data[0];

    const updateInfo = {
      ...userInfo,
      Address: input.value,
      UserID: localStorage.getItem('res')
    };

    await userUpdateInfoService(updateInfo);
    ElMessage.success('用户信息更新成功');
    address.value = false; // 关闭对话框
    if (!isOrderCreated.value) {
      createOrder(); // 继续执行结算流程
    }
  } catch (error) {
    ElMessage.error('用户信息更新失败');
  }
};
</script>

<style scoped>
/* 这里可以添加一些样式来美化表格 */

</style>