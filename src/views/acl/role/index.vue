<template>
  <el-card>
    <el-form inline>
      <el-form-item label="角色名称">
        <el-input placeholder="角色名称" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :disabled="!keyword.trim().length"
          @click="search"
        >
          搜索
        </el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card>
    <el-button
      type="primary"
      icon="Plus"
      style="margin-bottom: 10px"
      @click="addRole"
    >
      添加角色
    </el-button>
    <el-table show-overflow-tooltip border :data="rolesList">
      <el-table-column
        label="#"
        type="index"
        align="center"
        width="80"
      ></el-table-column>
      <el-table-column
        label="ID"
        width="120"
        align="center"
        prop="id"
      ></el-table-column>
      <el-table-column
        label="角色名称"
        align="center"
        prop="roleName"
      ></el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
      ></el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        prop="updateTime"
      ></el-table-column>
      <el-table-column label="操作" fixed="right" width="300">
        <template #="{ row }">
          <el-button
            type="primary"
            size="small"
            icon="User"
            @click="setPermission(row)"
          >
            分配权限
          </el-button>
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateRole(row)"
          >
            编辑
          </el-button>
          <el-popconfirm
            width="200"
            confirm-button-text="确定"
            cancel-button-text="取消"
            icon="InfoFilled"
            icon-color="red"
            :title="`确定要删除${row.roleName}?`"
            @confirm="deleteRole(row)"
          >
            <template #reference>
              <el-button type="primary" size="small" icon="Delete">
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[10, 15, 20, 25]"
      :background="true"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @current-change="getRolesList"
      @size-change="handleSizeChange"
    />
  </el-card>
  <!-- 添加和修改角色的弹窗 -->
  <el-dialog
    v-model="dialogFormVisible"
    :title="roleParams.id ? '添加角色' : '修改角色'"
    width="500"
  >
    <el-form :model="roleParams" :rules="rules" ref="formRef">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="roleParams.roleName" placeholder="请输入角色名称" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 分配权限的抽屉 -->
  <el-drawer v-model="drawerVisible">
    <template #header>
      <h4>分配权限</h4>
    </template>
    <template #default>
      <!-- 树形控件展示权限 -->
      <el-tree
        ref="treeRef"
        style="max-width: 600px"
        :data="menuList"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultCheckedKeys"
        :props="defaultProps"
      />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawerVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  reqRolesList,
  reqAddOrUpdateRole,
  reqAllPermission,
  reqSetPermission,
  reqDeleteRole
} from '@/api/acl/role'
import type { Records, Role, MenuArr, MenuData } from '@/api/acl/role/type'
import useLayoutSettingStore from '@/store/modules/setting'
// tree组件的节点配置
const defaultProps = {
  children: 'children',
  label: 'name'
}
// 当前页码
const pageNo = ref<number>(1)
// 每页多少条数据
const pageSize = ref<number>(10)
// 总共多少条数据
const total = ref<number>(0)
// 保存角色列表
const rolesList = ref<Records>([])
// 搜索关键字
const keyword = ref<string>('')
// 控制添加和修改角色的弹窗显示
const dialogFormVisible = ref<boolean>(false)
// 收集角色信息
const roleParams = reactive<Role>({
  roleName: ''
})
// 获取表单组件实例
const formRef = ref<any>()
// 控制抽屉的显示隐藏
const drawerVisible = ref<boolean>(false)
// 收集全部菜单和按钮权限数据
const menuList = ref<MenuArr>([])
// 默认勾选的节点（最后一级子节点即可，父节点会自动勾选）
const defaultCheckedKeys = ref<Array<number>>([])
// 获取settingstore
const layoutSettingStore = useLayoutSettingStore()
// 获取树形组件实例
const treeRef = ref<any>()
// 页面加载时获取全部角色数据
onMounted(() => {
  getRolesList()
})
// 获取角色列表的方法,默认第一页
const getRolesList = async (page = 1) => {
  pageNo.value = page
  // 发送请求获取数据
  const result = await reqRolesList(pageNo.value, pageSize.value, keyword.value)
  if (result.code == 200) {
    rolesList.value = result.data.records
    total.value = result.data.total
  }
}
// 分页器下拉菜单变化
const handleSizeChange = () => {
  getRolesList()
}
// 搜索按钮
const search = () => {
  getRolesList()
}
// 重置按钮
const reset = () => {
  layoutSettingStore.refresh = !layoutSettingStore.refresh
}
// 添加角色按钮
const addRole = () => {
  Object.assign(roleParams, { roleName: '', id: 0 })
  dialogFormVisible.value = true
  formRef.value.clearValidate()
}
// 修改角色按钮
const updateRole = (row: Role) => {
  Object.assign(roleParams, row)
  dialogFormVisible.value = true
  formRef.value.clearValidate()
}
// 校验的方法
const validateRoleName = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 2) {
    callback()
  } else {
    callback(new Error('角色名称至少两位'))
  }
}
// 表单校验规则
const rules = {
  roleName: [{ required: true, trigger: 'blur', validator: validateRoleName }]
}
// 添加或修改的保存按钮
const save = async () => {
  await formRef.value.validate()
  const result = await reqAddOrUpdateRole(roleParams.value)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: roleParams.value.id ? '修改成功' : '添加成功'
    })
    dialogFormVisible.value = false
    getRolesList(roleParams.value.id ? pageNo.value : 1)
  } else {
    ElMessage({
      type: 'success',
      message: roleParams.value.id ? '修改失败' : '添加失败'
    })
  }
}
// 分配权限按钮
const setPermission = async (row: Role) => {
  drawerVisible.value = true
  Object.assign(roleParams, row)
  const result = await reqAllPermission(roleParams.id)
  if (result.code == 200) {
    menuList.value = result.data
    defaultCheckedKeys.value = filterSelectArr(result.data, [])
  }
}
// 递归查找默认勾选的子节点
const filterSelectArr = (arr: MenuArr, initArr: Array) => {
  arr.forEach((item: MenuData) => {
    if (item.select && item.children.length == 0) {
      initArr.push(item.id)
    }
    if (item.select && item.children.length > 0) {
      filterSelectArr(item.children, initArr)
    }
  })
  return initArr
}
// 点击分配权限确认按钮
const confirmClick = async () => {
  // 角色id
  const roleId = roleParams.id
  //  选中的节点
  const checkedKeys = treeRef.value.getCheckedKeys()
  // 半选中的父节点
  const halfCheckedKeys = treeRef.value.getHalfCheckedKeys()
  // 组合参数
  const permissionId = checkedKeys.concat(halfCheckedKeys)
  // 发送请求
  const result = await reqSetPermission(roleId, permissionId)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '权限分配成功' })
    drawerVisible.value = false
    // 页面刷新
    window.location.reload()
  } else {
    ElMessage({ type: 'error', message: '权限分配失败' })
  }
}
// 点击删除角色
const deleteRole = async (row: Role) => {
  const result = await reqDeleteRole(row.id)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getRolesList(rolesList.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({ type: 'error', message: '删除失败' })
  }
}
</script>
<style lang="scss" scoped>
.el-card:first-of-type {
  height: 80px;
  margin-bottom: 10px;
  .el-form {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.el-table {
  margin-bottom: 10px;
}
</style>
