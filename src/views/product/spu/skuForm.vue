<template>
  <el-form label-width="80">
    <el-form-item label="SKU名称">
      <el-input
        placeholder="请输入SKU名称"
        v-model="skuParams.skuName"
      ></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input
        placeholder="请输入价格(元)"
        type="number"
        v-model="skuParams.price"
      ></el-input>
    </el-form-item>
    <el-form-item label="重量(克)">
      <el-input
        placeholder="请输入重量(克)"
        v-model="skuParams.weight"
      ></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input
        placeholder="请输入SKU描述"
        type="textarea"
        v-model="skuParams.skuDesc"
      ></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form inline class="attr">
        <el-form-item
          v-for="item in attrArr"
          :key="item.id"
          :label="item.attrName"
        >
          <el-select style="width: 240px" v-model="item.attrIdAndValueId">
            <el-option
              v-for="attrValue in item.attrValueList"
              :key="attrValue.id"
              :label="attrValue.valueName"
              :value="`${item.id}:${attrValue.id}`"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form class="attr" inline>
        <el-form-item
          v-for="item in saleArr"
          :key="item.id"
          :label="item.saleAttrName"
        >
          <el-select style="width: 240px" v-model="item.saleIdAndValueId">
            <el-option
              v-for="saleAttrValue in item.spuSaleAttrValueList"
              :key="saleAttrValue.id"
              :label="saleAttrValue.saleAttrValueName"
              :value="`${item.id}:${saleAttrValue.id}`"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table border :data="imageList" ref="tableRef">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column label="图片">
          <template #="{ row }">
            <img :src="row.imgUrl" style="width: 50%" />
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template #="{ row }">
            <el-button type="warning" size="small" @click="setDefault(row)">
              设置默认
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
import { reqAttr } from '@/api/product/attr'
import { reqAddSku, reqSpuImageList, reqSpuSaleAttr } from '@/api/product/spu'
import type { SkuData } from '@/api/product/spu/type'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'

let $emit = defineEmits(['changeType'])
// 平台属性
let attrArr = ref<any>([])
// 销售属性
let saleArr = ref<any>([])
// 照片墙
let imageList = ref<any>([])
// 收集SKU的参数
let skuParams = reactive<SkuData>({
  category3Id: '', // 三级分类的id
  spuId: '', // 已有的spu的id
  tmId: '', // spu品牌的id
  skuName: '', // sku名称
  price: '', // sku价格
  weight: '', // sku重量
  skuDesc: '', // sku描述
  skuAttrValueList: [], // 平台属性
  skuSaleAttrValueList: [], // 销售属性
  skuDefaultImg: '' //sku图片地址
})
// 获取table
let tableRef = ref<any>()
// 定义方法获取数据,暴露给父组件使用
const initSkuData = async (
  c1Id: number | string,
  c2Id: number | string,
  spu: any
) => {
  // 收集数据
  skuParams.category3Id = spu.category3Id
  skuParams.spuId = spu.id
  skuParams.tmId = spu.tmId
  // 获取平台属性
  const result = await reqAttr(c1Id, c2Id, spu.category3Id)
  // 获取对应的销售属性
  const result1 = await reqSpuSaleAttr(spu.id)
  // 获取照片墙的数据
  const result2 = await reqSpuImageList(spu.id)
  // 存储页面需要的数据
  attrArr.value = result.data
  saleArr.value = result1.data
  imageList.value = result2.data
}
// 点击设置默认图片
const setDefault = (row: any) => {
  // 点击时，先让所有复选框取消勾选，再选中当前row
  tableRef.value.clearSelection()
  tableRef.value.toggleRowSelection(row, true)
  skuParams.skuDefaultImg = row.imgUrl
}
// 点击保存
const save = async () => {
  // 整理参数用于发送请求
  // 1. 平台属性
  skuParams.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
    if (next.attrIdAndValueId) {
      let [attrId, valueId] = next.attrIdAndValueId.split(':')
      prev.push({ attrId, valueId })
    }
    return prev
  }, [])
  // 2. 销售属性
  skuParams.skuSaleAttrValueList = saleArr.value.reduce(
    (prev: any, next: any) => {
      if (next.saleIdAndValueId) {
        let [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':')
        prev.push({ saleAttrId, saleAttrValueId })
      }
      return prev
    },
    []
  )
  // 3. 发送添加sku请求
  const result = await reqAddSku(skuParams)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '添加成功'
    })
    $emit('changeType', { flag: 0, operation: '' })
  } else {
    ElMessage({
      type: 'error',
      message: '添加失败'
    })
  }
}
// 取消按钮的回调
const cancel = () => {
  $emit('changeType', { flag: 0, operation: '' })
}
// 向外暴露方法
defineExpose({ initSkuData })
</script>
<style lang="scss" scoped>
.attr {
  .el-form-item {
    margin-bottom: 10px;
  }
}
</style>
