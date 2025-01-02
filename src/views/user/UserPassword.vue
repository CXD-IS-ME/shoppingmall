<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>修改密码</span>
    </div>
    <el-form ref="passwordForm" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input type="password" v-model="form.oldPassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input type="password" v-model="form.newPassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="confirmPassword">
        <el-input type="password" v-model="form.confirmPassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { ElMessage, ElLoading } from 'element-plus';
import { userUpdatePasswordService } from '../../api/user';
import { useRouter } from 'vue-router'
import {useUserStore}from '@/stores';
const useStore = useUserStore();
const router = useRouter()
// 从LocalStorage获取用户信息
const user = localStorage.getItem('res') ? JSON.parse(localStorage.getItem('res')) : null;
const form = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
  UserID: user // 从用户信息中获取UserID
});

const passwordForm = ref(null);
const loading = ref(false);

const rules = {
  oldPassword: [
    { required: true, message: '请输入旧密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: (rule, value, callback) => {
      if (value !== form.newPassword) {
        callback(new Error('两次输入密码不一致'));
      } else {
        callback();
      }
    }, trigger: 'blur' }
  ]
};

const submitForm = () => {
  passwordForm.value.validate((valid) => {
    if (valid) {
      changePassword();
    } else {
      ElMessage.error('表单验证失败');
    }
  });
};
const changePassword = async () => {
  loading.value = true;

    // 确保form对象有oldPassword、newPassword和UserID属性
    const { oldPassword, newPassword, UserID } = form;
    await userUpdatePasswordService({ oldPassword, newPassword, UserID });
    ElMessage.success('密码修改成功');
    router.push('/login');
    useStore.removeToken();
};
</script>

<style scoped>
/* 卡片？ */
.box-card {
  max-width: 400px;
  margin: 50px auto;
  border-radius: 10px; /* 卡片圆角 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 卡片阴影 */
  overflow: hidden; /* 隐藏溢出部分 */
}

.box-card /deep/ .el-card__header {
  background-color: #409eff; /* 卡片头部背景色 */
  color: white; /* 卡片头部字体颜色 */
  padding: 15px 20px; /* 卡片头部内边距 */
  font-size: 18px; /* 卡片头部字体大小 */
  font-weight: bold; /* 卡片头部字体加粗 */
}

.box-card /deep/ .el-form {
  padding: 20px; /* 表单内边距 */
}
.el-form-item {
  margin-bottom: 20px; /* 表单项底部间距 */
}

.el-input__inner {
  border-radius: 5px; /* 输入框圆角 */
  border: 1px solid #dcdfe6; /* 输入框边框 */
  padding: 10px; /* 输入框内边距 */
}

.el-button {
  border-radius: 5px; /* 按钮圆角 */
  background-color: #409eff; /* 按钮背景色 */
  border-color: #409eff; /* 按钮边框色 */
  padding: 10px 20px; /* 按钮内边距 */
  font-size: 16px; /* 字体大小 */
}

.el-button:hover {
  background-color: #66b1ff; /* 按钮悬浮背景色 */
  border-color: #66b1ff; /* 按钮悬浮边框色 */
}
.el-loading-spinner {
  border-color: #409eff !important; /* 加载动画颜色 */
}
@media (max-width: 768px) {
  .box-card {
    width: 90%; /* 移动端卡片宽度 */
  }
}
.el-message__icon {
  font-size: 18px; /* 错误图标大小 */
}

.el-message__icon {
  color: #f56c6c; /* 错误图标颜色 */
}
</style>