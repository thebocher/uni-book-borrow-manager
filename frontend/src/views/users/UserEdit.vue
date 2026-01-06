<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usersApi } from '@/services/api'
import { ElMessage } from 'element-plus'
import { AxiosError } from 'axios'
import { Role, storage } from '@/services/storage'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const form = ref({
  username: '',
  password: '',
  role: '',
})
const isEdit = ref(false)

const canEdit = computed(() => !!storage.role.value && [Role.admin].includes(storage.role.value));

if (!canEdit.value) {
  router.push('/authors')
}

const loadUser = async () => {
  if (route.params.id && route.params.id !== 'create') {
    isEdit.value = true
    loading.value = true
    try {
      const id = Number(route.params.id)
      const response = await usersApi.getById(id)
      form.value = {
        username: response.data.username,
        password: '',
        role: response.data.role,
      }
    } catch (error) {
      ElMessage.error('Failed to load user')
      router.push('/users')
    } finally {
      loading.value = false
    }
  }
}
const validateForm = () => {
  const errors = []

  if (!form.value.username) errors.push('Username must be set');
  if (form.value.username.length < 8) errors.push('Username must be at least 8 characters long');

  if (!form.value.password) errors.push('Password must be set');
  if (form.value.password.length < 8) errors.push('Password must be at least 8 characters long');

  if (!Object.keys(Role).includes(form.value.role)) errors.push('Please select a role');
  errors.forEach(e => ElMessage.error(e));

  return errors.length === 0;
}

const handleSubmit = async () => {
  if (!validateForm()) return;

  loading.value = true
  try {
    if (isEdit.value) {
      const id = Number(route.params.id)
      await usersApi.update(id, { 
        username: form.value.username,
        password: form.value.password || undefined,
        role: form.value.role,
      });
      ElMessage.success('User updated successfully')
    } else {
      await usersApi.create(form.value)
      ElMessage.success('User created successfully')
    }
    router.push('/users')
  } catch (error) {
    if (error instanceof AxiosError) {
      const errors = error.response?.data.message

      if (Array.isArray(errors)) {
        errors.forEach((err) => ElMessage.error(err[0].toUpperCase() + err.slice(1)))
      } else {
        ElMessage.error(errors)
      }
    }
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  router.push('/users')
}

onMounted(() => {
  loadUser()
})
</script>

<template>
  <div class="user-edit" v-loading="loading">
    <el-button @click="handleCancel" style="margin-bottom: 20px">← Back to Users</el-button>

    <h1>{{ isEdit ? 'Edit User' : 'Create User' }}</h1>

    <el-form :model="form" label-width="100px" style="max-width: 600px; margin-top: 30px">
      <el-form-item label="Username" required>
        <el-input v-model="form.username" placeholder="Enter username" />
      </el-form-item>

      <el-form-item :label="isEdit ? 'New Password (optional)' : 'Password'" :required="!isEdit">
        <el-input
          v-model="form.password"
          type="password"
          :placeholder="isEdit ? 'Leave empty to keep current password' : 'Enter password'"
          show-password
        />
      </el-form-item>

      <el-form-item label="Role" required>
        <el-select v-model="form.role" placeholder="Role" style="width: 240px">
          <el-option
            v-for="item in Object.values(Role)"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSubmit">Submit</el-button>
        <el-button @click="handleCancel">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.user-edit {
  padding: 20px;
}

h1 {
  margin: 0 0 20px 0;
}
</style>
