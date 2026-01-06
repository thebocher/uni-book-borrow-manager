<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { booksApi, authorsApi } from '@/services/api'
import { ElMessage } from 'element-plus'
import { storage, Role } from '@/services/storage'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const authorsList = ref<Array<{ id: number; name: string }>>([])
const form = ref({
  title: '',
  description: '',
  authorIds: [] as number[],
  stock: 0,
})

const isEdit = ref(false)
const canEdit = computed(() => !!storage.role.value && [Role.admin].includes(storage.role.value));

if (!canEdit.value) {
  router.push('/books');
}

const loadAuthors = async () => {
  try {
    const response = await authorsApi.getAllFlat()
    authorsList.value = response.data
  } catch (error) {
    ElMessage.error('Failed to load authors')
  }
}

const loadBook = async () => {
  if (route.params.id && route.params.id !== 'create') {
    isEdit.value = true
    loading.value = true
    try {
      const id = Number(route.params.id)
      const response = await booksApi.getById(id)
      form.value = {
        title: response.data.title,
        description: response.data.description,
        authorIds: response.data.authors.map((a: { id: number }) => a.id),
        stock: response.data.stock,
      }
    } catch (error) {
      ElMessage.error('Failed to load book')
      router.push('/books')
    } finally {
      loading.value = false
    }
  }
}

const validateForm = () => {
  const errors = []

  if (!form.value.title) errors.push('Title must be set');

  if (!form.value.description) errors.push('Description must be set');

  if (form.value.stock < 0) errors.push('Stock must be a non-negative number');

  errors.forEach(e => ElMessage.error(e));

  return errors.length === 0;
}

const handleSubmit = async () => {
  if (!validateForm()) return;

  loading.value = true
  try {
    if (isEdit.value) {
      const id = Number(route.params.id)
      await booksApi.update(id, form.value)
      ElMessage.success('Book updated successfully')
    } else {
      await booksApi.create(form.value)
      ElMessage.success('Book created successfully')
    }
    router.push('/books')
  } catch (error) {
    ElMessage.error(isEdit.value ? 'Failed to update book' : 'Failed to create book')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  router.push('/books')
}

onMounted(async () => {
  await loadAuthors()
  await loadBook()
})
</script>

<template>
  <div class="book-edit" v-loading="loading">
    <el-button @click="handleCancel" style="margin-bottom: 20px">← Back to Books</el-button>

    <h1>{{ isEdit ? 'Edit Book' : 'Create Book' }}</h1>

    <el-form :model="form" label-width="100px" style="max-width: 600px; margin-top: 30px">
      <el-form-item label="Title" required>
        <el-input v-model="form.title" placeholder="Enter book title" />
      </el-form-item>

      <el-form-item label="Description" required>
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="5"
          placeholder="Enter book description"
        />
      </el-form-item>

      <el-form-item label="Authors" required>
        <el-select
          v-model="form.authorIds"
          multiple
          placeholder="Select authors"
          style="width: 100%"
        >
          <el-option
            v-for="author in authorsList"
            :key="author.id"
            :label="author.name"
            :value="author.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Stock" required>
        <el-input-number
          v-model="form.stock"
          :min="0"
        >
        </el-input-number>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSubmit">Submit</el-button>
        <el-button @click="handleCancel">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.book-edit {
  padding: 20px;
}

h1 {
  margin: 0 0 20px 0;
}
</style>
