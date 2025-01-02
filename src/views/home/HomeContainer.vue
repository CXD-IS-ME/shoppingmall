<template>
  <!-- Carousel -->
  <el-carousel :interval="4000" arrow="always">
    <el-carousel-item v-for="item in carouselItems" :key="item.id">
      <el-image :src="item.url" />
    </el-carousel-item>
  </el-carousel>


  <div class="product-list">
    <div v-for="product in products" :key="product.ProductID" class="product-item">
      <router-link :to="goDetail" @click="productDetail([product])" style=" text-decoration: none;color: black;">
        <div class="product-image">
          <el-image :src="baseURL+product.Image" :alt="product.ProductName" fit="cover" />
        </div>
        <div class="product-info">
          <h3>{{ product.ProductName }}</h3>
          <p>{{ product.Description }}</p>
          <div class="product-actions">
            <span class="product-price">¥{{ product.Price }}</span>
            <el-button type="primary" class="add-to-cart-btn"
              @click.native.prevent="addToCart(product)">加入购物车</el-button>
          </div>
        </div>
      </router-link>
    </div>
  </div>

</template>
<script>
import { ref } from 'vue';
import {
  ElCarousel,
  ElCarouselItem,
  ElButton,
} from 'element-plus';
import { useCartStore } from '@/stores/cart';
import { useRouter } from 'vue-router';
import { userproductGetInfoService } from '../../api/products';
const router = useRouter();
export default {
  name: 'Home',
  components: {
    ElImage,
    ElButton
  },
  setup() {
    const baseURL = 'http://phptest.com:8080'
    //轮播图
    const carouselItems = ref([
      { id: 1, title: '轮播图1', url: 'https://img95.699pic.com/photo/60015/8957.jpg_wh860.jpg' },
      { id: 2, title: '轮播图2', url: 'https://n.sinaimg.cn/sinacn10111/225/w1680h945/20191021/ce1c-ihfpfwa0297915.jpg' },
      { id: 3, title: '轮播图3', url: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg' }
    ]);

    const products = ref([{
      ProductID: '',
      ProductName: '',
      Image: '',
      Description: '',
      Price: 0,
    }])
    const getData = async () => {
      // 获取商品数据
      const response = await userproductGetInfoService();
      products.value = response.data.data.data;
    }
    getData()

    const selectedProducts = ref([]);
    const cartStore = useCartStore();
    const addToCart = (product) => {
      cartStore.addToCart(product);
      selectedProducts.value.push(product);
      ElMessage({
        message: '添加成功',
        type: 'success',
      })
    }
    const productDetail = ([product]) => {
      localStorage.setItem('product', JSON.stringify([product]));
    }
    return {
      productDetail,
      carouselItems,
      products,
      addToCart,
      goDetail,
baseURL,
    };
  },
}
const goDetail = ref('/detail');
</script>
<style scoped>
/* 轮播图 */
.el-carousel {
  margin-bottom: 20px;
}

.el-carousel__item {
  text-align: center;
  overflow: hidden; /* 确保图片不会超出容器 */
}

.el-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px; /* 圆角边框 */
}
/* 商品列表 */
.product-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.product-item {
  width: calc(25% - 20px); /* 减去间隔 */
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
}

.product-item:hover {
  transform: translateY(-5px); /* 鼠标悬停时上移 */
}

.product-image {
  width: 100%;
  height: 200px;
  position: relative;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease-in-out;
}

.product-info {
  padding: 15px;
  text-align: center;
}

.product-info h3 {
  font-size: 16px;
  margin-bottom: 5px;
}

.product-info p {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
  height: 48px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  font-size: 18px;
  font-weight: bold;
  color: #f56c6c;
}

.add-to-cart-btn {
  padding: 8px 15px;
  background-color: #409EFF;
  border-color: #409EFF;
  color: white;
  border-radius: 5px;
}

.add-to-cart-btn:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
}



.quantity-control {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.product-description {
  font-size: 16px;
  margin-bottom: 10px;
  height: 48px;
  /* 控制介绍文字的高度，超出部分隐藏 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
@media (max-width: 768px) {
  .product-item {
    width: calc(50% - 20px); /* 移动端宽度调整 */
  }
}

@media (max-width: 480px) {
  .product-item {
    width: 100%; /* 小屏幕设备上占满整个屏幕 */
  }
}
</style>