<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { userUpdateInfoService,userGetInfoService } from '@/api/user'
import { useRouter } from 'vue-router';
const router = useRouter();
const formRef = ref()
const user1 = localStorage.getItem('res') ? JSON.parse(localStorage.getItem('res')) : null;
// 是在使用仓库中数据的初始值 (无需响应式) 解构无问题
const {
  user: { Email, UserID, nickname, Username },
  getUser
} = useUserStore()
const form = ref({
  UserID:user1,
  Username,
  nickname,
  Email
})

const rules = ref({
  nickname: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    {
      pattern: /^\S{2,10}/,
      message: '昵称长度在2-10个非空字符',
      trigger: 'blur'
    }
  ],
  Email: [
    { required: true, message: '请输入用户邮箱', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入正确的邮箱格式',
      trigger: ['blur', 'change']
    }
  ]
})
const submitForm = async () => {
  // 等待校验结果
  await formRef.value.validate()
  // 提交修改
  await userUpdateInfoService(form.value)
  // 通知 user 模块，进行数据的更新
  getUser()
  // 提示用户
  ElMessage.success('修改成功')
}
const goUserLayout =()=>{
  router.push('/user/layout')  // 跳转到 user/layout 路由
}
</script>
<template>
  <page-container title="基本资料">
    <!-- 表单部分 -->
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="登录名称">
      
        <el-input v-model="form.Username" disabled></el-input>
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="form.nickname"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" prop="Email">
        <el-input v-model="form.Email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交修改</el-button>
        <el-button type="primary" @click="goUserLayout">返回</el-button>
      </el-form-item>
    </el-form>
  </page-container>
</template>
