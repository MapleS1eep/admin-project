<template>
  <div>
    <el-card>
      <!-- 卡片顶部按钮 -->
      <el-button type="primary" icon="Plus" @click="addTrademark">
        添加品牌
      </el-button>
      <!-- 表格组件 -->
      <el-table border :data="trademarkArr">
        <el-table-column
          label="序号"
          width="80"
          align="center"
          type="index"
        ></el-table-column>
        <el-table-column label="品牌名称" prop="tmName"></el-table-column>
        <el-table-column label="品牌LOGO" prop="logoUrl">
          <template #="{ row }">
            <img :src="row.logoUrl" />
          </template>
        </el-table-column>
        <el-table-column label="品牌操作">
          <template #="{ row }">
            <el-button
              type="warning"
              icon="Edit"
              @click="updateTrademark(row)"
            ></el-button>
            <el-popconfirm
              :title="`您确定要删除${row.tmName}吗？`"
              width="200"
              icon="Delete"
              icon-color="red"
              @confirm="removeTrademark(row.id)"
            >
              <template #reference>
                <el-button type="danger" icon="Delete"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器组件 -->
      <el-pagination
        @current-change="getHasTrademark"
        @size-change="getHasTrademark"
        v-model:current-page="pageNo"
        v-model:page-size="limit"
        :page-sizes="[5, 10, 15, 20]"
        background
        layout="prev, pager, next, jumper, -> , sizes, total"
        :total="total"
      />
    </el-card>
    <!-- 对话框组件: 添加和修改已有品牌时使用-->
    <el-dialog
      v-model="dialogFormVisible"
      :title="trademarkParams.id ? '修改品牌' : '添加品牌'"
    >
      <el-form :model="trademarkParams" :rules="rules" ref="formRef">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input
            placeholder="请输入品牌名称"
            v-model="trademarkParams.tmName"
          ></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleImgSuccess"
            :before-upload="beforeImgUpload"
          >
            <img
              v-if="trademarkParams.logoUrl"
              :src="trademarkParams.logoUrl"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 弹窗底部插槽 -->
      <template #footer>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import {
  reqHasTrademark,
  reqAddOrUpdateTrademark,
  reqDeleteTrademark
} from '@/api/product/trademark'
import type {
  Records,
  TradeMarkResponseData,
  TradeMark
} from '@/api/product/trademark/type'
// 上传文件类型
import { ElMessage, type UploadProps } from 'element-plus'

// 当前页码
let pageNo = ref<number>(1)
// 每页展示多少条数据
let limit = ref<number>(5)
// 已有品牌数据的总量
let total = ref<number>(0)
// 表格要展示的数据
let trademarkArr = ref<Records>([])
// 控制对话框的显示和隐藏
let dialogFormVisible = ref<boolean>(false)
// 收集新增品牌数据
let trademarkParams = reactive<TradeMark>({
  tmName: '',
  logoUrl: ''
})
// 获取form组件实例
let formRef = ref()
// 组件挂载时获取数据
onMounted(() => {
  getHasTrademark()
})
//封装方法获取已有品牌数据
const getHasTrademark = async (page: number = 1) => {
  pageNo.value = page
  const result: TradeMarkResponseData = await reqHasTrademark(
    pageNo.value,
    limit.value
  )
  if (result.code == 200) {
    total.value = result.data.total
    trademarkArr.value = result.data.records
  }
}
// 添加品牌
const addTrademark = () => {
  dialogFormVisible.value = true
  // 每次添加品牌前先清空当前收集数据
  trademarkParams.id = 0
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  // 添加前清除掉上次的校验提示信息
  // 第一种写法：
  // formRef.value?.clearValidate()
  nextTick(() => {
    // restFilds 移除校验结果并重置表单字段
    // clearValidate 只移除校验结果
    // formRef.value.resetFields()
    formRef.value.clearValidate()
  })
}
// 编辑表格数据
const updateTrademark = (row: any) => {
  formRef.value?.clearValidate()
  // 展示已有品牌的数据
  Object.assign(trademarkParams, row)
  dialogFormVisible.value = true
}
// 弹窗-取消
const cancel = () => {
  dialogFormVisible.value = false
}
// 弹窗-确定
const confirm = async () => {
  // 在发送请求之前对整个表单进行校验
  await formRef.value.validate()
  const result: any = await reqAddOrUpdateTrademark(trademarkParams)
  // 添加或者修改品牌成功
  if (result.code == 200) {
    // 关闭对话框
    dialogFormVisible.value = false
    // 弹出提示信息
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '修改品牌成功' : '品牌添加成功'
    })
    // 再次发送请求获取已有的全部品牌数据
    getHasTrademark(trademarkParams.id ? pageNo.value : 1)
  } else {
    // 添加或者修改品牌失败
    ElMessage({
      type: 'error',
      message: trademarkParams.id ? '修改品牌失败' : '品牌添加失败'
    })
  }
}
// 上传图片组件：上传图片之前触发的钩子，可以在此约束文件的类型和大小
const beforeImgUpload: UploadProps['beforeUpload'] = (rawFile) => {
  const fileType = ['image/png', 'image/jpeg', 'image/gif']
  if (fileType.includes(rawFile.type)) {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传的文件大小必须小于4M'
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传的文件格式必须为PNG|JPG|GIF'
    })
    return false
  }
}
// 文件上传成功触发的钩子
const handleImgSuccess: UploadProps['onSuccess'] = (response, _uploadFile) => {
  // response:当前这次上传图片post请求服务器返回的数据
  // 收集上传图片的地址，添加一个新品牌的时候带给服务器
  trademarkParams.logoUrl = response.data
  // 图片上传成功后清除掉表单校验提示信息
  formRef.value.clearValidate('logoUrl')
}
// 品牌名自定义校验规则的方法
const validateTmName = (_rule: any, value: any, callback: any) => {
  if (value.trim().length >= 2) {
    callback()
  } else {
    callback(new Error('品牌名称至少两位'))
  }
}
// logo自定义校验规则
const validateLogoUrl = (_rule: any, value: any, callback: any) => {
  if (value) {
    callback()
  } else {
    callback(new Error('请上传图片'))
  }
}
// 表单校验规则对象
const rules = {
  tmName: [{ required: true, trigger: 'blur', validator: validateTmName }],
  logoUrl: [{ required: true, validator: validateLogoUrl }]
}
// 点击气泡弹窗确认键，删除品牌
const removeTrademark = async (id: number) => {
  // 发送请求删除数据
  const result = await reqDeleteTrademark(id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '品牌删除成功'
    })
    // 再次获取所有品牌数据
    getHasTrademark(
      trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1
    )
  } else {
    ElMessage({
      type: 'error',
      message: '品牌删失败'
    })
  }
}
</script>
<style lang="scss" scoped>
.el-table {
  margin: 10px 0;
  &__cell {
    img {
      width: 178px;
      // height: 178px;
      border-radius: 5px;
    }
  }
}
.el-form {
  width: 80%;
}
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
