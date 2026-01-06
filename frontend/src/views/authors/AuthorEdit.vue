<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authorsApi } from '@/services/api'
import { ElMessage } from 'element-plus'
import { storage, Role } from '@/services/storage'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const form = ref({
  name: '',
  bio: '',
})

const isEdit = ref(false)

const canEdit = computed(() => !!storage.role.value && [Role.admin].includes(storage.role.value));

if (!canEdit.value) {
  router.push('/authors')
}

const loadAuthor = async () => {
  if (route.params.id && route.params.id !== 'create') {
    isEdit.value = true
    loading.value = true
    try {
      const id = Number(route.params.id)
      const response = await authorsApi.getById(id)
      form.value = {
        name: response.data.name,
        bio: response.data.bio,
      }
    } catch (error) {
      ElMessage.error('Failed to load author')
      router.push('/authors')
    } finally {
      loading.value = false
    }
  }
}


const validateForm = () => {
  const errors = []

  if (!form.value.name) errors.push('Name must be set');
  if (form.value.name.length < 8) errors.push('Name must be at least 8 characters long');

  if (!form.value.bio) errors.push('Bio must be set');

  errors.forEach(e => ElMessage.error(e))

  return errors.length === 0;
}

const handleSubmit = async () => {
  if (!validateForm()) return;

  loading.value = true
  try {
    if (isEdit.value) {
      const id = Number(route.params.id)
      await authorsApi.update(id, form.value)
      ElMessage.success('Author updated successfully')
    } else {
      await authorsApi.create(form.value)
      ElMessage.success('Author created successfully')
    }
    router.push('/authors')
  } catch (error) {
    ElMessage.error(isEdit.value ? 'Failed to update author' : 'Failed to create author')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  router.push('/authors')
}

onMounted(() => {
  loadAuthor()
})
</script>

<template>
  <div class="author-edit" v-loading="loading">
    <el-button @click="handleCancel" style="margin-bottom: 20px">← Back to Authors</el-button>

    <h1>{{ isEdit ? 'Edit Author' : 'Create Author' }}</h1>

    <el-form :model="form" label-width="100px" style="max-width: 600px; margin-top: 30px">
      <el-form-item label="Name" required>
        <el-input v-model="form.name" placeholder="Enter author name" />
      </el-form-item>

      <el-form-item label="Bio" required>
        <el-input
          v-model="form.bio"
          type="textarea"
          :rows="5"
          placeholder="Enter author biography"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSubmit">Submit</el-button>
        <el-button @click="handleCancel">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.author-edit {
  padding: 20px;
}

h1 {
  margin: 0 0 20px 0;
}
</style>
