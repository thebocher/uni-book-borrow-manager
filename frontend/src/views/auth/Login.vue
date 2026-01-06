<script setup lang="ts">
import { authApi } from '@/services/api'
import { storage } from '@/services/storage'
import { AxiosError } from 'axios'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = ref({
  username: '',
  password: '',
})

if (storage.access_token.value) {
  router.push('/authors');
}

const handleLogin = async () => {
  try {
    const response = await authApi.login({
      username: form.value.username,
      password: form.value.password,
    });

    storage.access_token.value = response.data.access_token;
    storage.role.value = response.data.role;
    router.push('/authors');
  } catch (error) {
    let message = 'Failed to login'

    if (error instanceof AxiosError) {
      switch (error.response?.status) {
        case 403:
          message = 'Invalid login or password'
      }
    }

    ElMessage.error(message)
  }
}

</script>

<template>
  <div class="center">
    <el-form>
      <el-form-item label="Username">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="Password">
        <el-input v-model="form.password" :show-password="true" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleLogin">Login</el-button>
        <el-button @click="router.push('/register')">Register</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
}
</style>
