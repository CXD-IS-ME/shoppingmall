<script setup>
import { ref } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import {
  artPublishService,
  artGetDetailService,
  artEditService
} from '@/api/article'
import { baseURL } from '@/utils/request'
import axios from 'axios'
// 控制抽屉显示隐藏
const visibleDrawer = ref(false)

// 默认数据
const defaultForm = {
  ProductName: '', // 产品名
  CategoryID: '', // 分类id
  Image: '', // 封面图片 file 对象
  Description: '', // string 内容
  state: '', // 状态
  Price: '',//价格
  Stock:'', //库存
  CategoryName:'',
  category:''
}

// 准备数据
const formModel = ref({ ...defaultForm })

// 图片上传相关逻辑
const imgUrl = ref('')
const onSelectFile = (uploadFile) => {
  if (uploadFile && uploadFile.raw) {
    imgUrl.value = URL.createObjectURL(uploadFile.raw);
    formModel.value.Image = uploadFile.raw;
  }
};

// 提交
const emit = defineEmits(['success'])
const onPublish = async (state) => {
  // 将已发布还是草稿状态，存入 formModel
  formModel.value.state = state

  // 注意：当前接口，需要的是 formData 对象
  // 将普通对象 => 转换成 => formData对象
  const fd = new FormData()
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }

  // 发请求
  if (formModel.value.ProductID) {
    // 编辑操作
    await artEditService(fd)
    ElMessage.success('修改成功')
    visibleDrawer.value = false
    emit('success', 'edit')
  } else {
    // 添加操作
    await artPublishService(fd)
    ElMessage.success('添加成功')
    visibleDrawer.value = false
    // 通知到父组件，添加成功了
    emit('success', 'add')
  }
}

// 组件对外暴露一个方法 open，基于open传来的参数，区分添加还是编辑
// open({})  => 表单无需渲染，说明是添加
// open({ id, ..., ... })  => 表单需要渲染，说明是编辑
// open调用后，可以打开抽屉
const editorRef = ref()
const open = async (row) => {
  visibleDrawer.value = true;
  if (row?.ProductID) {
    const res = await artGetDetailService(row.ProductID);
    if (res && res.data && res.data.data && res.data.data.data) {
      formModel.value = { ...res.data.data.data };
      imgUrl.value = baseURL + res.data.data.data.Image;
      const file = await imageUrlToFileObject(imgUrl.value, res.data.data.data.Image);
      formModel.value.Image = file;
    } else {
      console.error('获取详情数据失败:', res);
    }
  } else {
    formModel.value = { ...defaultForm };
    imgUrl.value = '';
    editorRef.value.setHTML('');
  }
};

// 将网络图片地址转换为 File 对象的函数
async function imageUrlToFileObject(imageUrl, filename) {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    if (!response.data) {
      throw new Error('No data received from the URL');
    }
    const blob = new Blob([response.data], {
      type: response.headers['content-type'] || 'image/jpeg'
    });
    return new File([blob], filename, {
      type: response.headers['content-type'] || 'image/jpeg'
    });
  } catch (error) {
    console.error('Error converting image URL to File object:', error);
    return null;
  }
}
function removeHtmlTags() {
  const editor = formModel.value.Description;
  // 使用 DOMParser 来解析 HTML 并提取纯文本
  const parser = new DOMParser();
  const doc = parser.parseFromString(editor, 'text/html');
  formModel.value.Description = doc.body.textContent || "";
}
defineExpose({
  open
})
</script>

<template>
  <el-drawer
    v-model="visibleDrawer"
    :ProcuctName="formModel.ProductID ? '编辑产品' : '添加产品'"
    direction="rtl"
    size="50%"
  >
    <!-- 发表产品表单 -->
    <el-form :model="formModel" ref="formRef" label-width="100px">
      <el-form-item label="产品名称" prop="ProductName">
        <el-input v-model="formModel.ProductName" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="产品价格" prop="Price">
        <el-input v-model="formModel.Price" placeholder="请输入价钱"></el-input>
      </el-form-item>
      <el-form-item label="产品库存" prop="Stock">
        <el-input v-model="formModel.Stock" placeholder="请输入库存"></el-input>
      </el-form-item>
      <el-form-item label="产品分类" prop="CategoryID">
        <channel-select
          v-model="formModel.CategoryID"
          width="100%"
        ></channel-select>
      </el-form-item>
      <el-form-item label="产品封面" prop="Image">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onSelectFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="产品内容" prop="Description" >
        <div class="editor">
          <quill-editor
  ref="editorRef"
  v-model:content="formModel.Description"
  content-type="text"
  theme="snow"
  @blur="removeHtmlTags"
></quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="onPublish('已发布')" type="primary">发布</el-button>
        <el-button @click="onPublish('草稿')" type="info">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
