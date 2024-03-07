<template>
  <el-card>
    <el-table border :data="skuList">
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="80"
      ></el-table-column>
      <el-table-column
        label="名称"
        prop="skuName"
        show-overflow-tooltip
        width="150"
      ></el-table-column>
      <el-table-column
        label="描述"
        prop="skuDesc"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="默认图片" width="150">
        <template #="{ row }">
          <img :src="row.skuDefaultImg" style="width: 80%" />
        </template>
      </el-table-column>
      <el-table-column
        label="重量(g)"
        prop="weight"
        width="150"
      ></el-table-column>
      <el-table-column
        label="价格(元)"
        prop="price"
        width="150"
      ></el-table-column>
      <el-table-column label="操作" fixed="right" width="300">
        <template #="{ row }">
          <el-button
            :type="row.isSale == 1 ? 'info' : 'success'"
            :icon="row.isSale == 1 ? 'Bottom' : 'Top'"
            @click="updateSale(row)"
            size="small"
            v-has="'btn.Sku.updown'"
          ></el-button>
          <el-button
            type="primary"
            icon="Edit"
            size="small"
            @click="updateSku"
            v-has="'btn.Sku.update'"
          ></el-button>
          <el-button
            type="info"
            icon="InfoFilled"
            size="small"
            @click="viewSkuInfo(row)"
            v-has="'btn.Sku.detail'"
          ></el-button>
          <el-popconfirm
            confirm-button-text="确定"
            cancel-button-text="取消"
            icon="InfoFilled"
            icon-color="red"
            :title="`确定要删除${row.skuName}吗?`"
            @confirm="deleteSku(row)"
            width="200"
          >
            <template #reference>
              <el-button
                type="danger"
                icon="Delete"
                size="small"
                v-has="'btn.Sku.remove'"
              ></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :background="true"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @current-change="getSkuList"
      @size-change="changeSize"
    />
    <!-- 抽屉组件 展示商品详情 -->
    <el-drawer v-model="drawer">
      <template #header="{ titleId, titleClass }">
        <h4 :id="titleId" :class="titleClass">查看商品详情</h4>
      </template>
      <template #default>
        <el-row>
          <el-col :span="6">名称</el-col>
          <el-col :span="18">{{ skuInfo.skuName }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">描述</el-col>
          <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">价格</el-col>
          <el-col :span="18">{{ skuInfo.price }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">平台属性</el-col>
          <el-col :span="18">
            <el-tag v-for="item in skuInfo.skuAttrValueList" :key="item.id">
              {{ item.valueName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">销售属性</el-col>
          <el-col :span="18">
            <el-tag v-for="item in skuInfo.skuSaleAttrValueList" :key="item.id">
              {{ item.saleAttrValueName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">商品图片</el-col>
          <el-col :span="18">
            <el-carousel :interval="3000" type="card" height="200px">
              <el-carousel-item
                v-for="item in skuInfo.skuImageList"
                :key="item.id"
              >
                <img
                  :src="item.imgUrl"
                  style="width: 100%; height: 100%; margin: auto"
                />
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>
    </el-drawer>
  </el-card>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  reqCancelSale,
  reqOnSale,
  reqSkuList,
  reqSkuInfo,
  reqDeleteSku
} from '@/api/product/sku'
import { SkuData } from '@/api/product/sku/type'
import { ElMessage } from 'element-plus'
// 当前页码
let pageNo = ref<number>(1)
// 一页展示的条数
let pageSize = ref<number>(10)
// 表格展示数据
let skuList = ref<Array<SkuData>>([])
// 数据的总量
let total = ref<number>(0)
// 控制抽屉的显示和隐藏
let drawer = ref<boolean>(false)
// 商品详情数据
let skuInfo = ref<SkuData>({
  category3Id: '',
  createTime: '',
  id: 1,
  isSale: 0,
  price: '',
  weight: '',
  skuAttrValueList: [],
  skuSaleAttrValueList: [],
  skuDefaultImg: '',
  skuDesc: '',
  skuImageList: [],
  skuName: '',
  spuId: '',
  tmId: '',
  updateTime: ''
})

// 组件挂载时获取第一页数据
onMounted(() => {
  getSkuList()
})
// 获取当前页sku数据的方法
const getSkuList = async (page = 1) => {
  pageNo.value = page
  const result = await reqSkuList(pageNo.value, pageSize.value)
  skuList.value = result.data.records
  total.value = result.data.total
}
// 分页器下拉菜单变化
const changeSize = () => {
  getSkuList()
}
// 更新商品售卖状态:上架/下架
const updateSale = async (row: SkuData) => {
  if (row.isSale == 1) {
    await reqCancelSale(row.id)
    ElMessage({ type: 'success', message: '下架成功' })
  } else {
    await reqOnSale(row.id)
    ElMessage({ type: 'success', message: '上架成功' })
  }
  getSkuList(pageNo.value)
}
// 更新已有的SKU
const updateSku = () => {
  ElMessage({ type: 'success', message: '程序员在努力地更新中...' })
}
// 查看当前SKU详情
const viewSkuInfo = async (row: SkuData) => {
  drawer.value = true
  // 发送请求获取详情
  const result = await reqSkuInfo(row.id)
  if (result.code == 200) {
    skuInfo.value = result.data
  }
}
// 点击删除当前SKU
const deleteSku = async (row: SkuData) => {
  const result = await reqDeleteSku(row.id)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getSkuList(skuList.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({ type: 'error', message: '删除失败' })
  }
}
</script>
<style lang="scss" scoped>
.el-table {
  margin-bottom: 10px;
}
.el-row {
  border-bottom: 1px solid #ccd2dbda;
  .el-col {
    padding: 10px;
    .el-tag {
      margin: 5px;
    }
  }
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
