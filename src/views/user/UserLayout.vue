<template>
    <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
      <el-radio-button :value="false">展开</el-radio-button>
      <el-radio-button :value="true">收起</el-radio-button>
    </el-radio-group>
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      @open="handleOpen"
      @close="handleClose"
      router="true"
    >
      <el-menu-item index="/user/avatar" >
        <el-icon><Avatar /></el-icon>
        <template #title>更换头像</template>
      </el-menu-item>
      <el-menu-item index="/user/password">
        <el-icon><setting /></el-icon>
        <template #title>重置密码</template>
      </el-menu-item>
      <el-menu-item index="/orderDetail/orderDetails">
        <el-icon><Notebook /></el-icon>
        <template #title>订单详情</template>
      </el-menu-item>
      <el-menu-item index="/user/userdetails">
        <el-icon><User /></el-icon>
        <template #title>个人详情</template>
      </el-menu-item>
    </el-menu>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue'
  import {
    Avatar,
    Menu as IconMenu,
    Setting,
    User,
    Notebook
  } from '@element-plus/icons-vue'
  
  const isCollapse = ref(true)
  const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
  }
  const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
  }
  </script>
  
  <style>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-menu-vertical-demo {
  background-color: #304156; /* 菜单背景色 */
  border-right: none; /* 移除边框 */
}

.el-menu-item {
  color: #bfcbd9; /* 菜单项字体颜色 */
  font-size: 14px; /* 字体大小 */
  transition: color 0.3s; /* 颜色变化动画 */
}

.el-menu-item:hover,
.el-menu-item.is-active {
  color: #ffffff; /* 鼠标悬浮和激活状态的字体颜色 */
  background-color: #42b983; /* 鼠标悬浮和激活状态的背景色 */
}

.el-menu-item:focus {
  outline: none; /* 移除焦点轮廓 */
}

.el-icon {
  margin-right: 10px; /* 图标右侧间距 */
  color: #bfcbd9; /* 图标颜色 */
}

.el-radio-button {
  margin-right: 10px; /* 单选按钮间距 */
}
/* 折叠菜单？ */
.el-menu--collapse .el-menu-item {
  text-align: center; /* 文字居中 */
  padding: 0 20px; /* 内边距 */
}

.el-menu--collapse .el-icon {
  margin-right: 0; /* 折叠时移除图标右侧间距 */
}
.el-radio-group {
  margin-left: 20px; /* 左侧间距 */
}

.el-radio-button__inner {
  background-color: #42b983; /* 单选按钮背景色 */
  color: #ffffff; /* 单选按钮字体颜色 */
  border-color: #42b983; /* 单选按钮边框色 */
}

.el-radio-button__inner:hover {
  background-color: #42b983; /* 鼠标悬浮背景色 */
  border-color: #42b983; /* 鼠标悬浮边框色 */
}

.el-radio-button__orig-radio:checked + .el-radio-button__inner {
  background-color: #42b983; /* 选中状态背景色 */
  border-color: #42b983; /* 选中状态边框色 */
}
  </style>
  