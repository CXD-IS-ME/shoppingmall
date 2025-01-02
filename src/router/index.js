import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'
// createRouter 创建路由实例
// 配置 history 模式
// 1. history模式：createWebHistory     地址栏不带 #
// 2. hash模式：   createWebHashHistory 地址栏带 #
// console.log(import.meta.env.DEV)

// vite 中的环境变量 import.meta.env.BASE_URL  就是 vite.config.js 中的 base 配置项
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') }, // 登录页
   
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/home',
      children:[
            {
              path: '/home',
              component: () => import('@/views/home/HomeContainer.vue')
            },
            {
              path: '/detail',
              component: () => import('@/views/detail/DetailContainer.vue')
            },
            {
              path: '/cart',
              component: () => import('@/views/cart/CartContainer.vue')
            },
    
            {
              path: '/user/profile',
              component: () => import('@/views/user/UserProfile.vue')
            },
            {
              path: '/user/avatar',
              component: () => import('@/views/user/UserAvatar.vue')
            },
            {
              path: '/user/password',
              component: () => import('@/views/user/UserPassword.vue')
            },
            {
              path: '/user/layout',
              component: () => import('@/views/user/UserLayout.vue')
            },
            {
              path: '/orders/order',
              component: () => import('@/views/orders/Order.vue')
            },
            {
              path: '/orderDetail/orderDetails',
              component: () => import('@/views/orderDetail/orderDetails.vue')
            },
            {
              path: '/user/userdetails',
              component: () => import('@/views/user/UserDetails.vue')
            },
            {
              path: '/user/userAddress',
              component: () => import('@/views/user/UserAddress.vue')
            }
          ]
        },


        { path: '/admin/login', component: () => import('@/views/admin/AdminLogin.vue') }, // 商家端登录页
        { path: '/admin/layout', component: () => import('@/views/admin/AdminLayout.vue') },
        {
          path: '/admin/layout',
          component: () => import('@/views/admin/AdminLayout.vue'),
          redirect: '/admin/layout',
          children:[
            {
              path: '/article/manage',
              component: () => import('@/views/article/ArticleManage.vue')
            },
            {
              path: '/article/channel',
              component: () => import('@/views/article/ArticleChannel.vue')
            },
                {
                  path: '/admin/profile',
                  component: () => import('@/views/admin/UserProfile.vue')
                },
                {
                  path: '/admin/avatar',
                  component: () => import('@/views/admin/UserAvatar.vue')
                },
                {
                  path: '/admin/password',
                  component: () => import('@/views/admin/UserPassword.vue')
                },
                {
                  path: '/admin/orders',
                  component: () => import('@/views/admin/Orders.vue')
                }
              ]
            },
      ]
        },
        
      
      
    
  
)

// 登录访问拦截 => 默认是直接放行的
// 根据返回值决定，是放行还是拦截
// 返回值：
// 1. undefined / true  直接放行
// 2. false 拦回from的地址页面
// 3. 具体路径 或 路径对象  拦截到对应的地址
//    '/login'   { name: 'login' }
router.beforeEach((to) => {
  // 如果没有token, 且访问的是非登录页，拦截到登录，其他情况正常放行
  const useStore = useUserStore()
  if (!useStore.token && to.path !== '/login'&& to.path !== '/admin/login') return '/login'
})

export default router
