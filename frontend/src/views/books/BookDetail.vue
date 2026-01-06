<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { booksApi } from '@/services/api'
import { ElMessage } from 'element-plus'
import { storage, Role } from '@/services/storage'

interface Author {
  id: number
  name: string
}

interface Borrowing {
  id: number
  dateBorrowed: string
  isReturned: boolean
}

interface Book {
  id: number
  title: string
  stock: number
  description: string
  authors: Author[]
  borrowed: Borrowing[]
}

const route = useRoute()
const router = useRouter()
const book = ref<Book | null>(null)
const loading = ref(false)

const canEdit = computed(() => !!storage.role.value && [Role.admin].includes(storage.role.value));

const loadBook = async () => {
  loading.value = true
  try {
    const id = Number(route.params.id)
    const response = await booksApi.getById(id)
    book.value = response.data
  } catch (error) {
    ElMessage.error('Failed to load book')
    router.push('/books')
  } finally {
    loading.value = false
  }
}

const handleEdit = () => {
  router.push(`/books/${route.params.id}/edit`)
}

const handleBack = () => {
  router.push('/books')
}

onMounted(() => {
  loadBook()
})
</script>

<template>
  <div class="book-detail" v-loading="loading">
    <el-button @click="handleBack" style="margin-bottom: 20px">← Back to Books</el-button>

    <div v-if="book" class="detail-content">
      <div class="header">
        <h1>{{ book.title }}</h1>
        <el-button v-if="canEdit" type="primary" @click="handleEdit">Edit</el-button>
      </div>

      <el-descriptions :column="1" border>
        <el-descriptions-item label="ID">{{ book.id }}</el-descriptions-item>
        <el-descriptions-item label="Title">{{ book.title }}</el-descriptions-item>
        <el-descriptions-item label="Description">{{ book.description }}</el-descriptions-item>
        <el-descriptions-item label="Stock">{{ book.stock }}</el-descriptions-item>
      </el-descriptions>

      <h2 style="margin-top: 30px">Authors</h2>
      <el-table :data="book.authors" stripe v-if="book.authors.length > 0">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="Name" />
      </el-table>
      <p v-else>No authors found</p>

      <h2 style="margin-top: 30px">Borrowings</h2>
      <el-table :data="book.borrowed" stripe v-if="book.borrowed.length > 0">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="dateBorrowed" label="Date Borrowed" width="200">
          <template #default="{ row }">
            {{ new Date(row.dateBorrowed).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="isReturned" label="Returned" width="100">
          <template #default="{ row }">
            <el-tag :type="row.isReturned ? 'success' : 'warning'">
              {{ row.isReturned ? 'Yes' : 'No' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <p v-else>No borrowings found</p>
    </div>
  </div>
</template>

<style scoped>
.book-detail {
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
