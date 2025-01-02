<template>
  <el-table :data="products" style="width: 100%">
    <el-table-column prop="ProductName" label="商品名" />
    <el-table-column prop="Price" label="价格" />
    <el-table-column prop="Description" label="详情" />
  </el-table>
</template>

<script setup>
import { ref,onMounted } from 'vue';
// 创建一个响应式引用来存储商品数据
const products = ref([]);
onMounted(() => {
  // 从localStorage获取数据
  const storedProduct = localStorage.getItem('product');
  // 确保存储的数据存在，并且是有效的JSON字符串
  if (storedProduct) {
    try {
      // 尝试解析JSON字符串
      const parsedProducts = JSON.parse(storedProduct);
      // 确保解析后的数据是数组
      if (Array.isArray(parsedProducts)) {
        products.value = parsedProducts;
      } else {
        console.error('存储的产品数据不是数组');
      }
    } catch (error) {
      console.error('解析localStorage中的产品数据失败', error);
    }
  }
});
</script>

<style scoped>
.product-detail {
  max-width: 600px;
  margin: 20px auto;
  text-align: center;
}

.product-name {
  margin-top: 20px;
}

.product-description {
  margin-top: 10px;
}
</style>