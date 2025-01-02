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
    router.push('/admin/login');
};
</script>

<style scoped>
.box-card {
  max-width: 400px;
  margin: 50px auto;
}
</style>