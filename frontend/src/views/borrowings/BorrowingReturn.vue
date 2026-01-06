<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { borrowingsApi, usersApi, booksApi } from '@/services/api'
import { ElMessage } from 'element-plus'
import { storage, Role } from '@/services/storage'

const router = useRouter()
const loading = ref(false)
const usersList = ref<Array<{ id: number; username: string }>>([])
const booksList = ref<Array<{ id: number; title: string }>>([])
const form = ref({
  userId: null as number | null,
  bookId: null as number | null,
})
const canReturn = computed(
  () => !!storage.role.value && [Role.admin, Role.manager].includes(storage.role.value),
)

if (!canReturn.value) {
  router.push('/borrowings')
}

const loadUsers = async () => {
  try {
    const response = await usersApi.getAllFlat()
    usersList.value = response.data
  } catch (error) {
    ElMessage.error('Failed to load users')
  }
}

const loadBooks = async () => {
  try {
    const response = await booksApi.getAllFlat()
    booksList.value = response.data
  } catch (error) {
    ElMessage.error('Failed to load books')
  }
}

const handleSubmit = async () => {
  if (!form.value.userId || !form.value.bookId) {
    ElMessage.warning('Please select both user and book')
    return
  }

  loading.value = true
  try {
    await borrowingsApi.return({
      userId: form.value.userId,
      bookId: form.value.bookId,
    })
    ElMessage.success('Book returned successfully')
    router.push('/borrowings')
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || 'Failed to return book')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  router.push('/borrowings')
}

onMounted(async () => {
  await loadUsers()
  await loadBooks()
})
</script>

<template>
  <div class="borrowing-return" v-loading="loading">
    <el-button @click="handleCancel" style="margin-bottom: 20px">← Back to Borrowings</el-button>

    <h1>Return Book</h1>

    <el-form :model="form" label-width="100px" style="max-width: 600px; margin-top: 30px">
      <el-form-item label="User" required>
        <el-select
          v-model="form.userId"
          placeholder="Select user"
          style="width: 100%"
          filterable
        >
          <el-option
            v-for="user in usersList"
            :key="user.id"
            :label="user.username"
            :value="user.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Book" required>
        <el-select
          v-model="form.bookId"
          placeholder="Select book"
          style="width: 100%"
          filterable
        >
          <el-option
            v-for="book in booksList"
            :key="book.id"
            :label="book.title"
            :value="book.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSubmit">Return Book</el-button>
        <el-button @click="handleCancel">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.borrowing-return {
  padding: 20px;
}

h1 {
  margin: 0 0 20px 0;
}
</style>
