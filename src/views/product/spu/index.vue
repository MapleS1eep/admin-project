<template>
  <div class="">
    <Category :scene="scene" />
    <el-card>
      <!-- v-if和v-show都能控制组件显示隐藏，但v-if会销毁重建，需频繁切换时性能开销较大，v-show原理是display属性 -->
      <div v-show="type == 0">
        <el-button type="primary" icon="Plus" :disabled="!c3Id" @click="addSpu">
          添加SPU
        </el-button>
        <!-- 展示已有SPU数据 -->
        <el-table border :data="records">
          <el-table-column
            type="index"
            label="序号"
            width="100"
            aligh="center"
          ></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column
            label="SPU描述"
            prop="description"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="操作">
            <template #="{ row }">
              <el-button
                type="primary"
                size="small"
                icon="Plus"
                title="添加SKU"
                @click="addSku(row)"
              ></el-button>
              <el-button
                type="warning"
                size="small"
                icon="Edit"
                title="修改SPU"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                type="info"
                size="small"
                icon="View"
                title="查看SKU列表"
                @click="viewSku(row)"
              ></el-button>
              <el-popconfirm
                width="220"
                confirm-button-text="确定"
                cancel-button-text="取消"
                icon="InfoFilled"
                icon-color="red"
                :title="`确定要删除${row.spuName}吗?`"
                @confirm="deleteSpu(row)"
              >
                <template #reference>
                  <el-button
                    type="danger"
                    size="small"
                    icon="Delete"
                    title="删除SPU"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-model:current-page="pageNo"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 15, 20]"
          :background="true"
          layout="prev, pager, next, jumper, ->, sizes, total"
          :total="total"
          @current-change="getHasSpu"
          @size-change="getHasSpu"
        />
      </div>
      <!-- 添加和修改spu子组件 -->
      <SpuForm v-show="type == 1" @changeType="changeType" ref="spuRef" />
      <!-- 添加sku子组件 -->
      <SkuForm v-show="type == 2" @changeType="changeType" ref="skuRef" />
      <!-- dialog用于展示sku数据 -->
      <el-dialog title="SKU列表" v-model="dialogVisible">
        <el-table border :data="skuArr">
          <el-table-column label="SKU名称" prop="skuName"></el-table-column>
          <el-table-column label="SKU价格" prop="price"></el-table-column>
          <el-table-column label="SKU重量" prop="weight"></el-table-column>
          <el-table-column label="SKU图片">
            <template #="{ row }">
              <img :src="row.skuDefaultImg" />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { reqDeleteSpu, reqHasSpu, reqSkuInfo } from '@/api/product/spu'
import type {
  HasSpuResponseData,
  Records,
  SpuData,
  SkuData
} from '@/api/product/spu/type'
// 引入分类的仓库
import useCategoryStore from '@/store/modules/category'
import { storeToRefs } from 'pinia'
const categoryStore = useCategoryStore()
const { c1Id, c2Id, c3Id } = storeToRefs(categoryStore)
// 引入封装的子组件
import SkuForm from './skuForm.vue'
import SpuForm from './spuForm.vue'
import { ElMessage } from 'element-plus'
// 场景数据
let scene = ref<boolean>(true)
// 分页器的页码
let pageNo = ref<number>(1)
// 每页的数据量
let pageSize = ref<number>(5)
// 存储已有的SPU数据
let records = ref<Records>([])
// 存储数据的总条数
let total = ref<number>(0)
// 组件类型的控制显示和隐藏 0-显示已有SPU 1-添加或修改已有SPU 2-添加SKU
let type = ref<number>(0)
// 获取子组件实例
let spuRef = ref<any>()
let skuRef = ref<any>()
// 存储全部sku数据
let skuArr = ref<Array<SkuData>>([])
// 控制dialog的显示隐藏
let dialogVisible = ref<boolean>(false)

// 监听三级分类id的变化
watch(
  () => c3Id.value,
  () => {
    // 保证有三级分类id
    if (!c3Id.value) return
    getHasSpu()
  }
)
// 获取已有SPU的方法
const getHasSpu = async (page = 1) => {
  // 默认第一页
  pageNo.value = page
  const result: HasSpuResponseData = await reqHasSpu(
    pageNo.value,
    pageSize.value,
    c3Id.value
  )
  if (result.code == 200) {
    records.value = result.data.records
    total.value = result.data.total
  }
}
// 添加SPU
const addSpu = () => {
  type.value = 1
  scene.value = false
  // 调用子组件的方法
  spuRef.value.initAddSpu()
}
// 修改SPU
const updateSpu = (row: SpuData) => {
  type.value = 1
  scene.value = false
  // 调用子组件的方法
  spuRef.value.initHasSpuData(row)
}
// 给子组件传参
const changeType = (obj: any) => {
  const { flag, operation } = obj
  scene.value = true
  // 子组件点击取消按钮切换卡片内容为展示SPU数据
  type.value = flag
  // 再次获取已有SPU
  // 如果是更新，获取当前页；如果是新增，获取第一页
  if (operation == 'update') {
    getHasSpu(pageNo.value)
  } else {
    getHasSpu()
  }
}
// 点击为已有spu添加一个sku
const addSku = (row: SpuData) => {
  type.value = 2
  scene.value = false
  skuRef.value.initSkuData(c1Id.value, c2Id.value, row)
}
// 查看SKU
const viewSku = async (row: SpuData) => {
  const result = await reqSkuInfo(row.id!)
  if (result.code == 200) {
    skuArr.value = result.data
    dialogVisible.value = true
  }
}
// 删除SPU
const deleteSpu = async (row: SpuData) => {
  const result = await reqDeleteSpu(row.id!)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getHasSpu(records.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({ type: 'error', message: '删除失败' })
  }
}
// 组件销毁时清空用到的store数据
onBeforeUnmount(() => {
  categoryStore.$reset()
})
</script>
<style lang="scss" scoped>
.el-card {
  margin: 10px 0;
  .el-table {
    margin: 10px 0;
  }
  .el-dialog {
    img {
      width: 100%;
    }
  }
}
</style>
