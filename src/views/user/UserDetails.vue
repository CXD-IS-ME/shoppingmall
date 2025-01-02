<template>
  <div>
    <el-table :data="tableData" height="250" style="width: 100%">
      <el-table-column prop="Username" label="账号" width="180" />
      <el-table-column prop="Email" label="邮箱" width="180" />
      <el-table-column prop="nickname" label="昵称" />
      <el-table-column prop="Phone" label="电话号码" />
      <el-table-column prop="Address" label="地址" />
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button type="primary" @click="openDialog(row.UserID)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <el-dialog
      title="编辑用户信息"
      v-model="dialogVisible"
      width="30%"
      @close="resetForm"
    >
      <el-form :model="formData">
        <el-form-item label="账号" :label-width="formLabelWidth">
          <el-input v-model="formData.Username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="formData.Email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称" :label-width="formLabelWidth">
          <el-input v-model="formData.nickname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" :label-width="formLabelWidth">
          <el-input v-model="formData.Phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址" :label-width="formLabelWidth">
          <el-input v-model="formData.Address" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUserInfo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { userGetInfoService, userUpdateInfoService } from '../../api/user';

const tableData = ref([]);
const dialogVisible = ref(false);
const formData = ref({
  Username: '',
  Email: '',
  nickname: '',
  Phone: '',
  Address: ''
});
const formLabelWidth = ref('120px');
const userId = ref(localStorage.getItem('res')); // 从本地存储中获取 UserID

const getData = async () => {
  const res = await userGetInfoService(userId.value);
  tableData.value = res.data.data.data;
};

getData();

const openDialog = async (id) => {
  try {
    const res = await userGetInfoService(id);
    formData.value = res.data.data.data[0];
    dialogVisible.value = true;
  } catch (error) {
    console.error('获取用户信息失败', error);
  }
};

const resetForm = () => {
  formData.value = {
    Username: '',
    Email: '',
    nickname: '',
    Phone: '',
    Address: ''
  };
};

const updateUserInfo = async () => {
  try {
    await userUpdateInfoService(formData.value);
    dialogVisible.value = false;
    // 重新获取数据
    getData();
  } catch (error) {
    console.error('更新用户信息失败', error);
  }
};
</script>

<style scoped>
.el-dialog {
  border-radius: 10px; /* 对话框圆角 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 对话框阴影 */
}

.el-dialog__header {
  background-color: #409eff; /* 对话框头部背景色 */
  color: white; /* 对话框头部字体颜色 */
  padding: 15px 20px; /* 对话框头部内边距 */
  font-size: 18px; /* 对话框头部字体大小 */
  font-weight: bold; /* 对话框头部字体加粗 */
}

.el-dialog__footer {
  background-color: #f4f4f9; /* 对话框底部背景色 */
  padding: 10px 20px; /* 对话框底部内边距 */
  border-top: 1px solid #ebeef5; /* 对话框底部边框 */
}

.dialog-footer {
  text-align: right; /* 底部按钮居右 */
  padding-top: 10px; /* 底部按钮上间距 */
}
.el-table {
  margin-top: 20px; /* 表格顶部间距 */
  border-radius: 10px; /* 表格圆角 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 表格阴影 */
}

.el-table th {
  background-color: #f4f4f9; /* 表头背景色 */
  color: #333; /* 表头字体颜色 */
  text-align: left; /* 表头文本居左 */
  font-weight: 500; /* 表头字体加粗 */
}

.el-table td {
  color: #666; /* 单元格字体颜色 */
}

.el-table-column {
  text-align: center; /* 单元格文本居中 */
}
.el-form {
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


.el-button:hover {
  background-color: #515a64; /* 按钮悬浮背景色 */
  border-color: #66b1ff; /* 按钮悬浮边框色 */
}
</style>