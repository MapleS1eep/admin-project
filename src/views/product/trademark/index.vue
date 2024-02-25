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
            <el-button
              type="danger"
              icon="Delete"
              @click="deleteTrademark(row)"
            ></el-button>
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
    <el-dialog v-model="dialogFormVisible" title="添加品牌">
      <el-form>
        <el-form-item label="品牌名称" label-width="100px">
          <el-input placeholder="请输入品牌名称"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px">
          <el-upload
            class="avatar-uploader"
            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 弹窗底部插槽 -->
      <template #footer>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="cancel">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { reqHasTrademark } from '@/api/product/trademark'
import { Records, TradeMarkResponseData } from '@/api/product/trademark/type'

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
}
// 编辑表格数据
const updateTrademark = (row: any) => {
  console.log(row)
}
// 删除表格数据
const deleteTrademark = (row: any) => {
  console.log(row)
}
// 关闭弹窗
const cancel = () => {
  dialogFormVisible.value = false
}
</script>
<style lang="scss" scoped>
.el-table {
  margin: 10px 0;
  &__cell {
    img {
      width: 50%;
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
