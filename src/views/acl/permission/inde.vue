<template>
  <el-table class="table" :data="permissionList" row-key="id" border>
    <el-table-column label="名称" prop="name"></el-table-column>
    <el-table-column label="权限值" prop="code"></el-table-column>
    <el-table-column label="修改时间" prop="updateTime"></el-table-column>
    <el-table-column label="操作">
      <template #="{ row }">
        <el-button
          type="primary"
          size="small"
          :disabled="row.level == 4"
          @click="addPermission(row)"
        >
          {{ row.level == 3 ? '添加功能' : '添加菜单' }}
        </el-button>
        <el-button
          type="primary"
          size="small"
          :disabled="row.level == 1"
          @click="updatePermission(row)"
        >
          编辑
        </el-button>
        <el-popconfirm
          width="200"
          confirm-button-text="确定"
          cancel-button-text="取消"
          icon="InfoFilled"
          icon-color="red"
          :title="`确定要删除${row.name}吗？`"
          @confirm="deletePermission(row)"
        >
          <template #reference>
            <el-button type="primary" size="small" :disabled="row.level == 1">
              删除
            </el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <!-- 添加和编辑的对话框 -->
  <el-dialog
    v-model="dialogVisible"
    :title="menuParams.id ? '更新菜单' : '添加菜单'"
    width="400"
  >
    <el-form
      :model="menuParams"
      :rules="rules"
      ref="formRef"
      label-width="auto"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="menuParams.name" />
      </el-form-item>
      <el-form-item label="权限值" prop="code">
        <el-input v-model="menuParams.code" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import {
  reqAllPermission,
  reqAddOrUpdateMenu,
  reqDeleteMenu
} from '@/api/acl/menu'
import type {
  Permission,
  PermissionList,
  MenuParams
} from '@/api/acl/menu/type'
import { ElMessage } from 'element-plus'

// 收集全部菜单的数据
const permissionList = ref<PermissionList>([])
// 控制dialog的显示隐藏
const dialogVisible = ref<boolean>(false)
// 收集参数
const menuParams = reactive<MenuParams>({
  name: '',
  code: '',
  level: 0,
  pid: 0
})
// 获取表单实例
const formRef = ref<any>()

// 组件挂载完毕获取数据
onMounted(() => {
  getPermissionList()
})
// 获取全部权限数据的方法
const getPermissionList = async () => {
  const result = await reqAllPermission()
  if (result.code == 200) {
    permissionList.value = result.data
  }
}
// 添加按钮
const addPermission = (row: Permission) => {
  // 每次点击添加时先清空上次数据
  Object.assign(menuParams, {
    id: 0,
    name: '',
    code: '',
    level: 0,
    pid: 0
  })
  dialogVisible.value = true
  // 清除校验信息
  formRef.value.clearValidate()
  // 收集新增菜单的level属性
  menuParams.level = row.level + 1
  // 给哪个菜单新增子菜单
  menuParams.pid = row.id
}
// 编辑按钮
const updatePermission = (row: Permission) => {
  dialogVisible.value = true
  formRef.value.clearValidate()
  Object.assign(menuParams, row)
}
// 定义校验规则的方法
const validateName = (_rule: any, value: any, callback: any) => {
  if (value.trim().length >= 4) {
    callback()
  } else {
    callback(new Error('名称至少4位'))
  }
}

const validateCode = (_rule: any, value: any, callback: any) => {
  if (value.trim().length >= 3) {
    callback()
  } else {
    callback(new Error('权限值至少3位'))
  }
}
// 表单自定义校验规则
const rules = {
  name: [{ required: true, trigger: 'blur', validator: validateName }],
  code: [{ required: true, trigger: 'blur', validator: validateCode }]
}
// 点击确认按钮新增或更新菜单
const save = async () => {
  // 表单检验，通过再发请求
  await formRef.value.validate()
  // 发送请求
  const result = await reqAddOrUpdateMenu(menuParams)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: menuParams.id ? '更新成功' : '添加成功'
    })
    dialogVisible.value = false
    getPermissionList()
  } else {
    ElMessage({
      type: 'error',
      message: menuParams.id ? '更新失败' : '添加失败'
    })
  }
}
// 删除按钮
const deletePermission = async (row: Permission) => {
  const result = await reqDeleteMenu(row.id)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getPermissionList()
  } else {
    ElMessage({ type: 'error', message: '删除失败' })
  }
}
</script>
<style lang="scss" scoped>
.table {
  width: 100%;
  margin-bottom: 20px;
}
</style>
