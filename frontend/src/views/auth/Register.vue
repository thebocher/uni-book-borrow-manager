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
  passwordRepeat: '',
})

if (storage.access_token.value) {
  router.push('/authors')
}

const validateForm = () => {
  const errors = []

  if (!form.value.username) errors.push('Username must be set');
  if (form.value.username.length < 8) errors.push('Username must be at least 8 characters long');

  if (!form.value.password) errors.push('Password must be set');
  if (form.value.password.length < 8) errors.push('Password must be at least 8 characters long');

  if (form.value.password !== form.value.passwordRepeat) errors.push('Passwords don\'t match');

  errors.forEach(e => ElMessage.error(e))

  return errors.length === 0;
}

const handleRegister = async () => {
  if (!validateForm()) return;

  try {
    await authApi.register({
      username: form.value.username,
      password: form.value.password,
    })

    router.push('/login')
    ElMessage.success('Registered successfully!')
  } catch (error) {
    if (error instanceof AxiosError) {
      const errors = error.response?.data.message

      if (Array.isArray(errors)) {
        errors.forEach((err) => ElMessage.error(err))
      } else {
        ElMessage.error(errors)
      }
    }
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
      <el-form-item label="Repeat password">
        <el-input v-model="form.passwordRepeat" :show-password="true" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleRegister">Register</el-button>
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
