<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { borrowingsApi } from '@/services/api'
import { ElMessage } from 'element-plus'

interface Borrowing {
  id: number
  dateBorrowed: string
  userName: string
  bookTitle: string
  isReturned: boolean
}

const route = useRoute()
const router = useRouter()
const borrowing = ref<Borrowing | null>(null)
const loading = ref(false)

const loadBorrowing = async () => {
  loading.value = true
  try {
    const id = Number(route.params.id)
    const response = await borrowingsApi.getById(id)
    borrowing.value = response.data
  } catch (error) {
    ElMessage.error('Failed to load borrowing')
    router.push('/borrowings')
  } finally {
    loading.value = false
  }
}

const handleBack = () => {
  router.push('/borrowings')
}

onMounted(() => {
  loadBorrowing()
})
</script>

<template>
  <div class="borrowing-detail" v-loading="loading">
    <el-button @click="handleBack" style="margin-bottom: 20px">← Back to Borrowings</el-button>

    <div v-if="borrowing" class="detail-content">
      <h1>Borrowing Details</h1>

      <el-descriptions :column="1" border>
        <el-descriptions-item label="ID">{{ borrowing.id }}</el-descriptions-item>
        <el-descriptions-item label="Date Borrowed">
          {{ new Date(borrowing.dateBorrowed).toLocaleString() }}
        </el-descriptions-item>
        <el-descriptions-item label="User">{{ borrowing.userName }}</el-descriptions-item>
        <el-descriptions-item label="Book">{{ borrowing.bookTitle }}</el-descriptions-item>
        <el-descriptions-item label="Returned">
          <el-tag :type="borrowing.isReturned ? 'success' : 'warning'">
            {{ borrowing.isReturned ? 'Yes' : 'No' }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<style scoped>
.borrowing-detail {
  padding: 20px;
}

.detail-content {
  max-width: 800px;
}

h1 {
  margin: 0 0 20px 0;
}
</style>
