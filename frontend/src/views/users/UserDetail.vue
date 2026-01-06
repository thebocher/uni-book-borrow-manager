<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usersApi } from '@/services/api'
import { ElMessage } from 'element-plus'
import { Role, storage } from '@/services/storage'

interface Borrowing {
  id: number
  dateBorrowed: string
  isReturned: boolean
}

interface User {
  id: number
  username: string
  passwordHash: string
  role: string
  borrowings: Borrowing[]
}

const route = useRoute()
const router = useRouter()
const user = ref<User | null>(null)
const loading = ref(false)

const canEdit = computed(() => !!storage.role.value && [Role.admin].includes(storage.role.value));
const canView = computed(() => !!storage.role.value && [Role.admin, Role.manager].includes(storage.role.value));

if (!canView.value) {
  router.push('/authors')
}

const loadUser = async () => {
  loading.value = true
  try {
    const id = Number(route.params.id)
    const response = await usersApi.getById(id)
    user.value = response.data
  } catch (error) {
    ElMessage.error('Failed to load user')
    router.push('/users')
  } finally {
    loading.value = false
  }
}

const handleEdit = () => {
  router.push(`/users/${route.params.id}/edit`)
}

const handleBack = () => {
  router.push('/users')
}

onMounted(() => {
  loadUser()
})
</script>

<template>
  <div class="user-detail" v-loading="loading">
    <el-button @click="handleBack" style="margin-bottom: 20px">← Back to Users</el-button>

    <div v-if="user" class="detail-content">
      <div class="header">
        <h1>{{ user.username }}</h1>
        <el-button v-if="canEdit" type="primary" @click="handleEdit">Edit</el-button>
      </div>

      <el-descriptions :column="1" border>
        <el-descriptions-item label="ID">{{ user.id }}</el-descriptions-item>
        <el-descriptions-item label="Username">{{ user.username }}</el-descriptions-item>
        <el-descriptions-item label="Role">{{ user.role }}</el-descriptions-item>
      </el-descriptions>

      <h2 style="margin-top: 30px">Borrowings</h2>
      <el-table :data="user.borrowings" stripe v-if="user.borrowings.length > 0" style="width: 380px">
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
.user-detail {
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
