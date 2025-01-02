<template>
  <el-container>
    <!-- Header -->
    <el-header>
      <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect" :router="true">
        <el-menu-item index="/home">首页</el-menu-item>
        <el-menu-item index="/detail" disabled="true">商品详情</el-menu-item>
        <el-menu-item index="/cart">购物车</el-menu-item>
        <el-menu-item index="/user/layout">个人中心</el-menu-item>
        
          <el-avatar :src="baseURL+url || avatar" />
        
      </el-menu>

    </el-header>

    <!-- Main -->
    <el-main>
      <router-view></router-view>
    </el-main>

    <!-- Footer -->
    <el-footer>
      @ZZL_2025版权所有
    </el-footer>
  </el-container>
</template>

<script setup>
import { ref, computed ,watch } from 'vue';
import { useRoute } from 'vue-router';
import {userGetInfoService} from '../../api/user'
 const baseURL = 'http://phptest.com:8080'
 const User = ref([{
  avatar:''
 }])
 const userID = ref(localStorage.getItem('res'))
 const getUserInfo = async()=>{
const res = await userGetInfoService(userID.value);
User.value = res.data.data.data
 }
 getUserInfo()
const route = useRoute();
const activeIndex = ref(route.path);

watch(() => route.path, (newPath) => {
  activeIndex.value = newPath;
});
const cart = ref(new Map()); // 使用 Map 存储商品 ID 和对应的购物车项

// 处理菜单选择
const handleSelect = (key, keyPath) => {
  activeIndex.value = key;
};
const url = localStorage.getItem('pic') ? JSON.parse(localStorage.getItem('pic')) : null;
</script>

<style scoped>
.el-avatar {
  position: fixed;
  right: 20px;
  top: 20px; /* 调整位置 */
  background-color: rgba(255, 255, 255, 0.1); /* 半透明背景 */
  border-radius: 50%; /* 圆形 */
  z-index: 1001; /* 确保头像在菜单之上 */
}
.el-header {
  background-color: #fff; /* 白色背景 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加阴影 */
  z-index: 1000; /* 确保头部始终在顶部 */
  padding: 0 20px; /* 增加一些内边距 */
}
.el-main {
  padding: 20px; /* 内边距 */
  background-color: #f9f9f9; /* 浅灰色背景 */
  min-height: calc(100vh - 64px - 20px); /* 减去头部和底部的高度 */
}
.el-menu {
  border: none; /* 移除边框 */
}

.el-menu-item {
  color: #333; /* 文字颜色 */
  font-size: 16px; /* 字体大小 */
}

.el-menu-item.is-active {
  color: #409EFF; /* 激活状态的颜色 */
  border-bottom: 2px solid #409EFF; /* 底部边框 */
}

.el-menu-item:hover {
  background-color: #f5f7fa; /* 鼠标悬停时的背景色 */
}

.el-container {
  display: flex;
  flex-direction: column;
  height: 100vh; /* 100%视口高度 */
}

.el-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%; /* 圆形 */
  border: 2px solid #fff; /* 白色边框 */
}

.product-list {
  margin-top: 20px;
}

.product-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.quantity-control {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.el-footer {
  background-color: #f4f4f4; /* 浅灰色背景 */
  color: #333; /* 文字颜色 */
  text-align: center; /* 文字居中 */
  padding: 10px 0; /* 内边距 */
  font-size: 14px; /* 字体大小 */
}
.el-menu{
  background-color: #f4f4f9; /* 浅灰色背景 */
}
</style>
