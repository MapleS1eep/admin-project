<template>
  <div>
    <!-- 三级分类全局组件 -->
    <Category :scene="scene" />
    <el-card>
      <!-- 数据表格 -->
      <div v-show="scene">
        <el-button
          type="primary"
          icon="Plus"
          :disabled="!c3Id"
          @click="addAttr"
          v-has="'btn.Attr.add'"
        >
          添加属性
        </el-button>
        <el-table border :data="attrArr">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80"
          ></el-table-column>
          <el-table-column
            label="属性名称"
            width="120"
            prop="attrName"
          ></el-table-column>
          <el-table-column label="属性值名称" prop="">
            <template #="{ row }">
              <el-tag v-for="item in row.attrValueList" :key="item.id">
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template #="{ row }">
              <el-button
                type="warning"
                icon="Edit"
                size="small"
                @click="updateAttr(row)"
                v-has="'btn.Attr.update'"
              ></el-button>
              <el-popconfirm
                width="200"
                :title="`确定要删除${row.attrName}吗?`"
                @confirm="deleteAttr(row.id)"
              >
                <template #reference>
                  <el-button
                    type="danger"
                    icon="Delete"
                    size="small"
                    v-has="'btn.Attr.remove'"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加和修改 -->
      <div v-show="!scene">
        <el-form inline>
          <el-form-item label="属性名称">
            <el-input
              placeholder="请输入属性名称"
              v-model="attrParams.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="Plus"
          :disabled="!attrParams.attrName"
          @click="addAttrValue"
        >
          添加属性值
        </el-button>
        <el-button @click="cancel">取消</el-button>
        <el-table border :data="attrParams.attrValueList">
          <el-table-column
            width="80"
            type="index"
            align="center"
            label="序号"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <el-input
                placeholder="请输入属性值名称"
                v-model="row.valueName"
                v-if="row.flag"
                @blur="toLook(row, $index)"
                :ref="(vc: any) => (inputArr[$index] = vc)"
              ></el-input>
              <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #="{ $index }">
              <el-button
                type="danger"
                size="small"
                icon="Delete"
                @click="attrParams.attrValueList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="save"
          :disabled="attrParams.attrValueList.length == 0"
        >
          保存
        </el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, reactive, watch, nextTick, onBeforeUnmount } from 'vue'
import { reqAttr } from '@/api/product/attr'
import useCategoryStore from '@/store/modules/category'
import type {
  AttrResponseData,
  AttrList,
  Attr,
  AttrValue
} from '@/api/product/attr/type'
import { reqAddOrUpdateAttr, reqDeleteAttr } from '@/api/product/attr'
import { ElMessage } from 'element-plus'

// 存储已有的属性和属性值
let attrArr = ref<AttrList>([])
// 控制卡片内容的切换：true-展示表格 false-展示添加或修改的表单
let scene = ref<boolean>(true)
// 新增属性的数据
let attrParams = reactive<Attr>({
  attrName: '', //新增属性名字
  attrValueList: [], //新增属性值数组
  categoryId: '', //三级分类id
  categoryLevel: 3 //代表是三级分类
})
// 定义数组，存储el-input组件实例
let inputArr = ref<any>([])

let categoryStore = useCategoryStore()
const { c1Id, c2Id, c3Id } = storeToRefs(categoryStore)

// 监听三级分类id的变化
watch(
  () => c3Id.value,
  () => {
    // 清空上一次查询的属性和属性值数据
    attrArr.value = []
    // 保证三级分类的id有值才发送请求
    if (!c3Id.value) return
    getAttr()
  }
)
// 获取已有属性和属性值的方法
const getAttr = async () => {
  const result: AttrResponseData = await reqAttr(
    c1Id.value,
    c2Id.value,
    c3Id.value
  )
  if (result.code == 200) {
    attrArr.value = result.data
  }
}
// 添加属性按钮的回调
const addAttr = () => {
  // 每次点击先清空上次收集的数据并收集当前三级分类id
  Object.assign(attrParams, {
    attrName: '',
    attrValueList: [],
    categoryId: c3Id.value,
    categoryLevel: 3
  })
  scene.value = false
}
// 修改属性按钮
const updateAttr = (row: any) => {
  scene.value = false
  // 深拷贝
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}
// 取消修改或添加的操作
const cancel = () => {
  scene.value = true
}
// 点击添加属性值
const addAttrValue = () => {
  // flag:控制每个属性值编辑与查看模式的切换
  attrParams.attrValueList.push({ valueName: '', flag: true })
  // 获取最有一个el-input并聚焦
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus()
  })
}
// 保存属性值修改活添加
const save = async () => {
  // 发送请求
  const result: any = await reqAddOrUpdateAttr(attrParams)
  if (result.code == 200) {
    // 添加或修改成功
    scene.value = true
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改成功' : '添加成功'
    })
    // 再次获取已有的属性和属性值
    getAttr()
  } else {
    scene.value = false
    ElMessage({
      type: 'error',
      message: attrParams.id ? '修改失败' : '添加失败'
    })
  }
}
// 属性值表单输入框失去焦点的回调
const toLook = (row: AttrValue, $index: number) => {
  // 非法情况判断
  if (row.valueName.trim() == '') {
    // 删除掉属性值为空的元素
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '属性值不能为空'
    })
    return
  }
  // 属性值重复
  let repeat = attrParams.attrValueList.find((item) => {
    if (item != row) {
      return item.valueName === row.valueName
    }
  })
  if (repeat) {
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '属性值不能重复'
    })
    return
  }
  row.flag = false
}
// 点击切换为输入框
const toEdit = (row: AttrValue, $index: number) => {
  row.flag = true
  nextTick(() => {
    // 切换到编辑时输入框自动聚焦
    inputArr.value[$index].focus()
  })
}
// 删除已有属性
const deleteAttr = async (id: number) => {
  const result = await reqDeleteAttr(id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '属性删除成功'
    })
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: '属性删除失败'
    })
  }
}
// 当路由组件切换销毁时清空用到的仓库数据
onBeforeUnmount(() => {
  categoryStore.$reset()
})
</script>
<style lang="scss" scoped>
.el-card {
  margin: 10px 0;
}
.el-table {
  margin: 10px 0;
}
.el-tag {
  margin: 5px;
}
</style>
