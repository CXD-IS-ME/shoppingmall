<script setup>
import {
  Management,
  Box,
  UserFilled,
  User,
  Crop,
  EditPen,
  SwitchButton,
  CaretBottom
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'
import { useUserStore } from '@/stores'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { adminuserGetInfoService } from '../../api/admin'
const userStore = useUserStore()
const router = useRouter()

const name = ref({})
const getUser = async () => {
  const res = await adminuserGetInfoService() // 请求获取数据
  name.value = res.data.data.data
}
getUser()
const handleCommand = async (key) => {
  if (key === 'logout') {
    // 退出操作
    await ElMessageBox.confirm('你确认要进行退出么', '温馨提示', {
      type: 'warning',
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    })

    // 清除本地的数据 (token + user信息)
    userStore.removeToken()
    userStore.setUser({})
    router.push('/')
  } else {
    // 跳转操作
    router.push(`/admin/${key}`)
  }
}
// 从LocalStorage获取用户信息
const user = localStorage.getItem('res') ? JSON.parse(localStorage.getItem('res')) : null;
const baseURL = 'http://phptest.com:8080'
const url = localStorage.getItem('avatar') ? JSON.parse(localStorage.getItem('avatar')) : null;
</script>

<template>
  <!-- 
    el-menu 整个菜单组件
      :default-active="$route.path"  配置默认高亮的菜单项
      router  router选项开启，el-menu-item 的 index 就是点击跳转的路径

    el-menu-item 菜单项
      index="/article/channel" 配置的是访问的跳转路径，配合default-active的值，实现高亮
  -->
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="el-aside__logo"></div>
      <el-menu active-text-color="#ffd04b" background-color="#232323" :default-active="$route.path" text-color="#fff"
        router>
        <el-menu-item index="/article/channel">
          <el-icon>
            <Management />
          </el-icon>
          <span>产品分类</span>
        </el-menu-item>
        <el-menu-item index="/article/manage">
          <el-icon>
            <Box />
          </el-icon>
          <span>产品管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/orders">
          <el-icon>
            <Management />
          </el-icon>
          <span>订单</span>
        </el-menu-item>
        <el-sub-menu index="/admin/">
          <!-- 多级菜单的标题 - 具名插槽 title -->
          <template #title>
            <el-icon>
              <UserFilled />
            </el-icon>
            <span>个人中心</span>
          </template>

          <!-- 展开的内容 - 默认插槽 -->
          <el-menu-item index="/admin/profile">
            <el-icon>
              <User />
            </el-icon>
            <span>修改资料</span>
          </el-menu-item>
          <el-menu-item index="/admin/avatar">
            <el-icon>
              <Crop />
            </el-icon>
            <span>更换头像</span>
          </el-menu-item>
          <el-menu-item index="/admin/password">
            <el-icon>
              <EditPen />
            </el-icon>
            <span>重置密码</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div>
          欢迎：<strong>{{
            user
          }}</strong>
        </div>
        <el-dropdown placement="bottom-end" @command="handleCommand">
          <!-- 展示给用户，默认看到的 -->
          <span class="el-dropdown__box">
            <el-avatar :src="baseURL+url || avatar" />
            <el-icon>
              <CaretBottom />
            </el-icon>
          </span>

          <!-- 折叠的下拉部分 -->
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile" :icon="User">修改资料</el-dropdown-item>
              <el-dropdown-item command="avatar" :icon="Crop">更换头像</el-dropdown-item>
              <el-dropdown-item command="password" :icon="EditPen">重置密码</el-dropdown-item>
              <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>心选商城 ©2024 ZZL</el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;

  .el-aside {
    background-color: #232323;

    &__logo {
      height: 120px;
      background: url('@/assets/logo.png') no-repeat center / 120px auto;
    }

    .el-menu {
      border-right: none;
    }
  }

  .el-header {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .el-dropdown__box {
      display: flex;
      align-items: center;

      .el-icon {
        color: #999;
        margin-left: 10px;
      }

      &:active,
      &:focus {
        outline: none;
      }
    }
  }

  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
}
</style>
