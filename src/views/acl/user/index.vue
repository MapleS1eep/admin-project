<template>
  <el-card>
    <el-form inline class="form">
      <el-form-item label="用户名:">
        <el-input placeholder="请输入用户名" v-model="keyword"></el-input>
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
    <el-button type="primary" @click="addUser">添加</el-button>
    <el-button
      type="danger"
      @click="batchDeleteUser"
      :disabled="!userIdList.length"
    >
      批量删除
    </el-button>
    <!-- 表格展示用户信息 -->
    <el-table
      border
      :data="userList"
      show-overflow-tooltip
      @selection-change="changeSelection"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="#" type="index" align="center"></el-table-column>
      <el-table-column label="ID" prop="id" align="center"></el-table-column>
      <el-table-column
        label="用户名字"
        align="center"
        prop="username"
      ></el-table-column>
      <el-table-column
        label="用户昵称"
        align="center"
        prop="name"
      ></el-table-column>
      <el-table-column
        label="用户角色"
        prop="roleName"
        align="center"
      ></el-table-column>
      <el-table-column
        label="创建时间"
        prop="createTime"
        align="center"
      ></el-table-column>
      <el-table-column
        label="更新时间"
        prop="updataTime"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" width="350" fixed="right">
        <template #="{ row }">
          <el-button
            type="primary"
            icon="User"
            size="small"
            @click="setRole(row)"
          >
            分配角色
          </el-button>
          <el-button
            type="primary"
            icon="Edit"
            size="small"
            @click="updateUser(row)"
          >
            编辑
          </el-button>
          <el-popconfirm
            confirm-button-text="确定"
            cancel-button-text="取消"
            icon="InfoFilled"
            icon-color="red"
            :title="`确定要删除${row.username}吗？`"
            @confirm="deleteUser(row.id)"
            width="200"
          >
            <template #reference>
              <el-button type="primary" icon="Delete" size="small">
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
      :page-sizes="[5, 7, 9]"
      :background="true"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @size-change="changeSize"
      @current-change="getAllUsers"
    />
  </el-card>
  <!-- 添加和修改的抽屉 -->
  <el-drawer v-model="userDrawer">
    <!-- 动态显示标题 -->
    <template #header>
      <h4>{{ title }}</h4>
    </template>
    <template #default>
      <el-form :model="userParams" :rules="rules" ref="formRef">
        <el-form-item label="用户姓名" prop="username">
          <el-input v-model="userParams.username"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input v-model="userParams.name"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
          <el-input v-model="userParams.password"></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="userDrawer = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </template>
  </el-drawer>
  <!-- 分配角色的抽屉 -->
  <el-drawer v-model="roleDrawer">
    <template #header>
      <h4>分配角色</h4>
    </template>
    <template #default>
      <el-form>
        <el-form-item label="用户姓名">
          <el-input disabled v-model="userParams.username"></el-input>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
          >
            全选
          </el-checkbox>
          <!-- 全部角色的复选框 -->
          <el-checkbox-group
            v-model="checkedRoles"
            @change="handleCheckedRolesChange"
          >
            <el-checkbox
              v-for="role in allRoles"
              :key="role"
              :label="role"
              :value="role"
            >
              {{ role }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelSetRole">取消</el-button>
        <el-button type="primary" @click="confirmSetRole">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, computed } from 'vue'
import {
  reqAllUsers,
  reqAddOrUpdateUser,
  reqAllRoles,
  reqSetRole,
  reqDeleteUser,
  reqBatchDeleteUser
} from '@/api/acl/user'
import type { Records, User, AllRoles, SetRoleData } from '@/api/acl/user/type'
import { ElMessage } from 'element-plus'
import useLayoutSettingStore from '@/store/modules/setting'
// 当前页码
let pageNo = ref<number>(1)
// 每页数据条数
let pageSize = ref<number>(5)
// 数据总量
let total = ref<number>(0)
// 保存全部用户的数据
let userList = ref<Records>([])
// 控制添加/修改角色的抽屉的打开和关闭
let userDrawer = ref<boolean>(false)
// 控制分配角色的抽屉的打开和关闭
let roleDrawer = ref<boolean>(false)
// 收集用户信息
let userParams = reactive<User>({
  username: '',
  name: '',
  password: ''
})
// 表单组件实例
let formRef = ref<any>()
// 全选框是否勾选
let checkAll = ref<boolean>(false)
// 设置不确定状态，仅负责样式控制
let isIndeterminate = ref<boolean>(true)
// 当前用户已有的角色名字
const checkedRoles = ref<Array<string>>([])
// 全部角色的名字
const allRoles = ref<Array<string>>([])
// 保存全部角色的信息
const allRolesList = ref<AllRoles>([])
// 保存用户id的数组，用于批量删除请求
const userIdList = ref<Array<number>>([])
// 保存搜索的关键字
const keyword = ref<string>('')
// 获取setting仓库
const layoutSettingStore = useLayoutSettingStore()
// 通过id动态计算标题
const title = computed(() => {
  return userParams.id ? '修改用户' : '添加用户'
})
// 页面挂载时获取全部用户
onMounted(() => {
  getAllUsers()
})
// 获取全部用户的信息
const getAllUsers = async (page = 1) => {
  // 默认获取第一页数据
  pageNo.value = page
  const result = await reqAllUsers(pageNo.value, pageSize.value, keyword.value)
  userList.value = result.data.records
  total.value = result.data.total
}
// 分页器下拉菜单发生变化
const changeSize = () => {
  getAllUsers()
}
// 点击添加用户
const addUser = () => {
  // 添加时先清空上次数据
  userDrawer.value = true
  Object.assign(userParams, {
    id: 0,
    username: '',
    name: '',
    password: ''
  })
  // 清空上次的校验提示
  nextTick(() => {
    formRef.value.clearValidate()
  })
}
// 点击修改用户
const updateUser = (row: User) => {
  userDrawer.value = true
  Object.assign(userParams, row)
  formRef.value?.clearValidate()
}
// 抽屉点击确认发送请求
const save = async () => {
  // 表单全部校验通过才发送请求
  await formRef.value.validate()
  // 新增或者修改的请求
  const result = await reqAddOrUpdateUser(userParams)
  if (result.code == 200) {
    userDrawer.value = false
    ElMessage({
      type: 'success',
      message: userParams.id ? '修改成功' : '添加成功'
    })
    // getAllUsers(userParams.id ? pageNo.value : 1)
    // 用户信息更新浏览器自动刷新一次(如果是修改自身账号会跳转至登录页)
    window.location.reload()
  } else {
    ElMessage({
      type: 'error',
      message: userParams.id ? '修改失败' : '添加失败'
    })
  }
}
// 校验用户名字的回调函数
const validateUsername = (_rule: any, value: any, callback: any) => {
  // 名字必须至少五位
  if (value.trim().length >= 5) {
    callback()
  } else {
    callback(new Error('用户名字至少5位'))
  }
}
// 校验用户昵称的回调函数
const validateName = (_rule: any, value: any, callback: any) => {
  // 昵称必须至少五位
  if (value.trim().length >= 5) {
    callback()
  } else {
    callback(new Error('用户昵称至少5位'))
  }
}
// 校验用户密码的回调函数
const validatePassword = (_rule: any, value: any, callback: any) => {
  // 名字必须至少五位
  if (value.trim().length >= 6) {
    callback()
  } else {
    callback(new Error('用户密码至少6位'))
  }
}
// 表单校验规则
const rules = {
  // 用户名字
  username: [{ required: true, trigger: 'blur', validator: validateUsername }],
  // 用户昵称
  name: [{ required: true, trigger: 'blur', validator: validateName }],
  // 密码
  password: [{ required: true, trigger: 'blur', validator: validatePassword }]
}
// 点击分配角色
const setRole = async (row: User) => {
  // 存储用户信息用于展示
  Object.assign(userParams, row)
  const result = await reqAllRoles(userParams.id)
  if (result.code == 200) {
    allRoles.value = result.data.allRolesList.map((item) => item.roleName)
    checkedRoles.value = result.data.assignRoles.map((item) => item.roleName)
    // 保存一个数组用于发送请求时查找对应角色id
    allRolesList.value = result.data.allRolesList
    roleDrawer.value = true
  }
}
// 全选复选框变化时的回调
const handleCheckAllChange = (val: boolean) => {
  // val是勾选状态，全选时为true，全不选为false
  checkedRoles.value = val ? allRoles.value : []
  isIndeterminate.value = false
}
// 复选框变化时
const handleCheckedRolesChange = (value: string[]) => {
  // value是勾选过的值构成的数组
  const checkedCount = value.length
  checkAll.value = checkedCount === allRoles.value.length
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < allRoles.value.length
}
// 分配角色抽屉的取消按钮
const cancelSetRole = () => {
  roleDrawer.value = false
}
// 分配角色抽屉的确认按钮
const confirmSetRole = async () => {
  // 过滤出已选中角色的id
  const roleIdList = allRolesList.value
    .filter((item) => checkedRoles.value.includes(item.roleName))
    .map((role) => role.id)
  // 收集请求参数
  const params = { userId: userParams.id, roleIdList }
  // 发送分配角色请求
  const result = await reqSetRole(params)
  if (result.code == 200) {
    roleDrawer.value = false
    ElMessage({ type: 'success', message: '角色分配成功' })
    getAllUsers(pageNo.value)
  } else {
    ElMessage({ type: 'error', message: '角色分配失败' })
  }
}
// 点击删除用户按钮
const deleteUser = async (userId: number) => {
  const result = await reqDeleteUser(userId)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getAllUsers(userList.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({ type: 'error', message: '删除失败' })
  }
}
// 表格复选框选择项发生变化时的回调
const changeSelection = (val: Records) => {
  userIdList.value = val.map((item) => item.id)
  console.log('用户id列表', userIdList.value)
}
// 批量删除
const batchDeleteUser = async () => {
  const result = await reqBatchDeleteUser(userIdList.value)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getAllUsers(userList.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({ type: 'error', message: '删除失败' })
  }
}
// 点击搜索按钮
const search = () => {
  getAllUsers()
  keyword.value = ''
}
// 点击重置按钮
const reset = () => {
  layoutSettingStore.refresh = !layoutSettingStore.refresh
}
</script>
<style lang="scss" scoped>
.el-card {
  &:first-of-type {
    height: 80px;
    margin-bottom: 10px;
  }
}
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-table {
  margin: 10px 0;
}
.el-checkbox-group {
  width: 100%;
}
</style>
