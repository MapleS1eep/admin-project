<template>
  <el-form label-width="100">
    <el-form-item label="SPU名称">
      <el-input
        placeholder="请输入SPU名称"
        v-model="spuParams.spuName"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select placeholder="请选择品牌" v-model="spuParams.tmId">
        <el-option
          v-for="item in allTrademark"
          :key="item.id"
          :label="item.tmName"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input
        v-model="spuParams.description"
        type="textarea"
        placeholder="请输入描述"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU照片">
      <el-upload
        v-model:file-list="imageList"
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :before-upload="handleUpload"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <el-select
        v-model="saleAttrIdAndValueName"
        :placeholder="
          unSelectSaleAttr.length
            ? `还有${unSelectSaleAttr.length}个未选择`
            : '已全部选择'
        "
      >
        <el-option
          v-for="item in unSelectSaleAttr"
          :key="item.id"
          :label="item.name"
          :value="`${item.id}:${item.name}`"
        ></el-option>
      </el-select>
      <el-button
        type="primary"
        icon="Plus"
        :disabled="!saleAttrIdAndValueName"
        @click="addSaleAttr"
      >
        添加属性
      </el-button>
      <!-- 展示销售属性与属性值 -->
      <el-table border :data="saleAttr">
        <el-table-column
          type="index"
          align="center"
          label="序号"
          width="120"
        ></el-table-column>
        <el-table-column
          label="销售属性名称"
          width="120"
          prop="saleAttrName"
        ></el-table-column>
        <el-table-column label="销售属性值">
          <template #="{ row }">
            <el-tag
              v-for="(item, index) in row.spuSaleAttrValueList"
              :key="item.id"
              closable
              @close="row.spuSaleAttrValueList.splice(index, 1)"
            >
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-input
              v-if="row.flag == true"
              size="small"
              style="width: 100px"
              v-model="row.saleAttrValue"
              @blur="toLook(row)"
            ></el-input>
            <el-button
              v-else
              type="success"
              size="small"
              icon="Plus"
              @click="toEdit(row)"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #="{ $index }">
            <el-button
              type="danger"
              size="small"
              icon="Delete"
              @click="saleAttr.splice($index, 1)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button @click="cancel">取消</el-button>
      <el-button
        type="primary"
        @click="save"
        :disabled="saleAttr.length == 0 ? true : false"
      >
        保存
      </el-button>
    </el-form-item>
  </el-form>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import type {
  AllTrademark,
  HasSaleAttr,
  HasSaleAttrResponseData,
  SaleAttr,
  SaleAttrResponseData,
  SaleAttrValue,
  SpuData,
  SpuHasImage,
  // SpuImage,
  Trademark
} from '@/api/product/spu/type'
import {
  reqAddOrUpdateSpu,
  reqAllSaleAttr,
  reqAllTrademark,
  reqSpuImageList,
  reqSpuSaleAttr
} from '@/api/product/spu'
import { ElMessage } from 'element-plus'
import type { UploadUserFile } from 'element-plus'

// 向父组件传递数据
let $emit = defineEmits(['changeType'])
// 点击取消切换卡片内容
const cancel = () => {
  $emit('changeType', { flag: 0, operation: 'update' })
}

//存储已有SPU相关数据
let allTrademark = ref<Array<Trademark>>([])
// let imageList = ref<Array<SpuImage>>([])
let imageList = ref<UploadUserFile[]>([])
let saleAttr = ref<Array<SaleAttr>>([])
let allSaleAttr = ref<Array<HasSaleAttr>>([])
// 存储已有的SPU对象
let spuParams = ref<SpuData>({
  category3Id: '',
  spuName: '',
  description: '',
  tmId: '',
  spuImageList: [],
  spuSaleAttrList: []
})
// 控制图片预览的dialog
let dialogVisible = ref<boolean>(false)
// 预览图片的地址
let dialogImageUrl = ref<string>('')
// 收集还未选择的销售属性的id和属性值的名字
let saleAttrIdAndValueName = ref<string>('')

// spu是父组件传递过来的数据
const initHasSpuData = async (spu: SpuData) => {
  // 存储已有的SPU对象，用于展示
  spuParams.value = spu
  // 获取全部品牌的数据
  let result: AllTrademark = await reqAllTrademark()
  // 获取当前SPU下全部商品的图片
  let result1: SpuHasImage = await reqSpuImageList(spu.id as number)
  // 获取已有SPU销售属性的数据
  let result2: SaleAttrResponseData = await reqSpuSaleAttr(spu.id as number)
  // 获取整个项目全部SPU的销售属性
  let result3: HasSaleAttrResponseData = await reqAllSaleAttr()

  // 存储全部品牌的数据
  allTrademark.value = result.data
  // 存储SPU对应的商品图片
  imageList.value = result1.data.map((item: any) => {
    return { name: item.imgName, url: item.imgUrl }
  })
  // 存储已有SPU的销售属性
  saleAttr.value = result2.data
  // 存储全部的销售属性
  allSaleAttr.value = result3.data
}
// 照片墙点击预览图片的回调
const handlePictureCardPreview = (file: any) => {
  // 弹出图片预览对话框
  dialogImageUrl.value = file.url
  dialogVisible.value = true
}
// 照片墙点击移除图片的回调
// const handleRemove = (file: any) => {}
// 上传文件之前触发的钩子，可以约束文件类型与大小
const handleUpload = (file: any) => {
  const types = ['image/png', 'image/jpeg', 'image/gif']
  if (types.includes(file.type)) {
    if (file.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传的图片必须小于4M'
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传的文件类型必须是PNG|JPG|GIF'
    })
    return false
  }
}
// 计算当前SPU还未拥有的销售属性
let unSelectSaleAttr = computed(() => {
  // 从全部销售属性中过滤掉已经选择过的属性
  let unSelectAttr = allSaleAttr.value.filter((item) => {
    return saleAttr.value.every((attr) => {
      return item.name !== attr.saleAttrName
    })
  })
  return unSelectAttr
})
// 点击添加销售属性
const addSaleAttr = () => {
  // 解构并组装为一个符合要求的销售属性对象
  const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':')
  let newSaleAttr: SaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: []
  }
  // 追加到数组中
  saleAttr.value.push(newSaleAttr)
  saleAttrIdAndValueName.value = ''
}
// 属性值按钮点击添加
const toEdit = (row: SaleAttr) => {
  row.flag = true
  row.saleAttrValue = ''
}
// 表单输入框失去焦点的回调
const toLook = (row: SaleAttr) => {
  //属性id 属性值名字
  const { baseSaleAttrId, saleAttrValue } = row
  let newSaleAttrValue: SaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue as string
  }
  // 非法数据：禁止重复或者空值
  if (saleAttrValue?.trim() == '') {
    ElMessage({ type: 'error', message: '属性值不能为空' })
    return
  }
  let repeat = row.spuSaleAttrValueList.find((item) => {
    return item.saleAttrValueName == saleAttrValue
  })
  if (repeat) {
    ElMessage({ type: 'error', message: '属性值不能重复' })
    return
  }
  // 追加新的属性值对象
  row.spuSaleAttrValueList.push(newSaleAttrValue)
  // 切换为查看模式
  row.flag = false
}
// 点击保存按钮
const save = async () => {
  // 禁止只填属性名不填属性值就保存
  let empty = saleAttr.value.some((item) => {
    return item.spuSaleAttrValueList.length == 0
  })
  if (empty) {
    ElMessage({ type: 'error', message: '属性值不能为空' })
    return
  }
  // 把收集到的数据整理为请求需要的参数
  // 1. 照片墙的数据
  spuParams.value.spuImageList = imageList.value.map((item: any) => {
    return {
      imgName: item.name,
      imgUrl: item.response?.data || item.url
    }
  })
  // 2. 销售属性的数据
  spuParams.value.spuSaleAttrList = saleAttr.value
  // 3. 发送请求
  const result = await reqAddOrUpdateSpu(spuParams.value)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: spuParams.value.id ? '更新成功' : '添加成功'
    })
    $emit('changeType', {
      flag: 0,
      operation: spuParams.value.id ? 'update' : 'add'
    })
  } else {
    ElMessage({
      type: 'error',
      message: spuParams.value.id ? '更新失败' : '添加失败'
    })
  }
}
// 点击添加一个新的SPU
const initAddSpu = async (c3Id: number | string) => {
  // 每次点击添加先清空上次数据
  Object.assign(spuParams.value, {
    category3Id: '',
    spuName: '',
    description: '',
    tmId: '',
    spuImageList: [],
    spuSaleAttrList: []
  })
  imageList.value = []
  saleAttr.value = []
  saleAttrIdAndValueName.value = ''
  // 存储三级分类的id
  spuParams.value.category3Id = c3Id
  // 获取全部品牌的数据
  let result: AllTrademark = await reqAllTrademark()
  // 获取整个项目全部SPU的销售属性
  let result1: HasSaleAttrResponseData = await reqAllSaleAttr()

  // 存储全部品牌的数据
  allTrademark.value = result.data
  // 存储全部的销售属性
  allSaleAttr.value = result1.data
}
// 对外暴露方法
defineExpose({ initHasSpuData, initAddSpu })
</script>
<style lang="scss" scoped>
.el-select {
  width: 240px;
  margin-right: 10px;
}
.el-table {
  margin: 10px 0;
}
.el-dialog {
  img {
    width: 100%;
  }
}
.el-tag {
  margin: 0 5px;
}
</style>
