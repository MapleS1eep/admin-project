<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0">占位</el-col>
      <el-col :span="12" :xs="24">
        <el-form
          class="login_form"
          :model="loginForm"
          :rules="rules"
          ref="loginFormRef"
        >
          <h1>你好</h1>
          <h2>欢迎光临</h2>
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              :prefix-icon="Lock"
              v-model="loginForm.password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loading"
              class="login_btn"
              type="primary"
              size="default"
              @click="login"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { ElNotification } from 'element-plus'
import { ref, reactive } from 'vue'
import useUserStore from '@/store/modules/user'
import { useRouter, useRoute } from 'vue-router'
import { getTime } from '@/utils/time'

let loading = ref(false)

let $router = useRouter()
let $route = useRoute()
let userStore = useUserStore()
// 收集账号和密码的数据
let loginForm = reactive({
  username: 'admin',
  password: '111111'
})
// 获取el-form
let loginFormRef = ref()

// 自定义校验规则
const validateUsername = (_rule: any, value: any, callback: any) => {
  if (value.length >= 5) {
    callback()
  } else {
    callback(new Error('用户名长度至少5位'))
  }
}
const validatePassword = (_rule: any, value: any, callback: any) => {
  if (value.length >= 6) {
    callback()
  } else {
    callback(new Error('密码长度至少6位'))
  }
}
// 表单校验的规则
const rules = {
  username: [{ trigger: 'change', validator: validateUsername }],
  password: [{ trigger: 'change', validator: validatePassword }]
}
// 登录按钮的回调
const login = async () => {
  // 表单全部校验通过以后再发送请求
  await loginFormRef.value.validate()
  // 开始加载
  loading.value = true
  //点击登录以后要完成的事
  // 通知仓库发送登录请求
  // 请求成功要跳转到首页
  // 请求失败弹出失败信息
  try {
    await userStore.userLogin(loginForm)
    // 登录成功跳转至首页或者退出登录之前的页面
    let redirect: any = $route.query.redirect
    $router.push({ path: redirect || '/' })
    // 登录成功的提示
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `Hi, ${getTime()}好！`
    })
    loading.value = false
  } catch (error) {
    loading.value = false
    ElNotification({
      type: 'error',
      message: (error as Error).message
    })
  }
}
</script>
<style lang="scss" scoped>
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;

  .login_form {
    position: relative;
    width: 70%;
    top: 30vh;
    padding: 40px;
    border-radius: 10px;
    background: url('@/assets/images/login_form.jpg') no-repeat;
    background-size: cover;
    opacity: 0.9;

    h1 {
      color: white;
      font-size: 40px;
    }

    h2 {
      color: white;
      font-size: 20px;
      margin: 20px 0;
    }

    .login_btn {
      width: 100%;
    }
  }
}
</style>
