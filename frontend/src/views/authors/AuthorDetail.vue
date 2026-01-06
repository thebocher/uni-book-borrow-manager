<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authorsApi } from '@/services/api'
import { ElMessage } from 'element-plus'
import { Role, storage } from '@/services/storage'

interface Book {
  id: number
  title: string
  stock: number
}

interface Author {
  id: number
  name: string
  bio: string
  books: Book[]
}

const route = useRoute()
const router = useRouter()
const author = ref<Author | null>(null)
const loading = ref(false)

const canEdit = computed(() => !!storage.role.value && [Role.admin].includes(storage.role.value));

const loadAuthor = async () => {
  loading.value = true
  try {
    const id = Number(route.params.id)
    const response = await authorsApi.getById(id)
    author.value = response.data
  } catch (error) {
    ElMessage.error('Failed to load author')
    router.push('/authors')
  } finally {
    loading.value = false
  }
}

const handleEdit = () => {
  router.push(`/authors/${route.params.id}/edit`)
}

const handleBack = () => {
  router.push('/authors')
}

onMounted(() => {
  loadAuthor()
})
</script>

<template>
  <div class="author-detail" v-loading="loading">
    <el-button @click="handleBack" style="margin-bottom: 20px">← Back to Authors</el-button>

    <div v-if="author" class="detail-content">
      <div class="header">
        <h1>{{ author.name }}</h1>
        <el-button v-if="canEdit" type="primary" @click="handleEdit">Edit</el-button>
      </div>

      <el-descriptions :column="1" border>
        <el-descriptions-item label="ID">{{ author.id }}</el-descriptions-item>
        <el-descriptions-item label="Name">{{ author.name }}</el-descriptions-item>
        <el-descriptions-item label="Bio">{{ author.bio }}</el-descriptions-item>
      </el-descriptions>

      <h2 style="margin-top: 30px">Books</h2>
      <el-table :data="author.books" stripe v-if="author.books.length > 0">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="Title" />
        <el-table-column prop="stock" label="Stock" width="100" />
      </el-table>
      <p v-else>No books found</p>
    </div>
  </div>
</template>

<style scoped>
.author-detail {
  padding: 20px;
}

.detail-content {
  max-width: 800px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h1 {
  margin: 0;
}
</style>

