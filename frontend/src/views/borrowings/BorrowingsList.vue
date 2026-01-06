<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { borrowingsApi } from '@/services/api'
import { ElMessage } from 'element-plus'
import { storage, Role } from '@/services/storage'

interface Borrowing {
  id: number
  dateBorrowed: string
  userName: number
  bookTitle: number
  isReturned: boolean
}

const router = useRouter()
const borrowings = ref<Borrowing[]>([])
const loading = ref(false)
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  totalItems: 0,
  pageCount: 1,
})
const canReturn = computed(
  () => !!storage.role.value && [Role.admin, Role.manager].includes(storage.role.value),
);
const canAdd = computed(
  () => !!storage.role.value && [Role.admin, Role.manager].includes(storage.role.value),
);

const handlePageChange = (value: number) => {
  pagination.value.currentPage = value;
  loadBorrowings();
}

const handlePageSizeChange = (value: number) => {
  pagination.value.pageSize = value;
  pagination.value.currentPage = 1;
  loadBorrowings();
}

const loadBorrowings = async () => {
  loading.value = true
  try {
    const response = await borrowingsApi.getAll({
      page: pagination.value.currentPage,
      pageSize: pagination.value.pageSize,
    });
    const meta = response.data.meta;

    borrowings.value = response.data.items;
    pagination.value = {
      totalItems: meta.totalItems,
      currentPage: meta.currentPage,
      pageSize: meta.itemsPerPage,
      pageCount: meta.totalPages,
    };
  } catch (error) {
    ElMessage.error('Failed to load borrowings')
  } finally {
    loading.value = false
  }
}

const handleView = (id: number) => {
  router.push(`/borrowings/${id}`)
}

const handleAdd = () => {
  router.push('/borrowings/add')
}

const handleReturn = () => {
  router.push('/borrowings/return')
}

onMounted(() => {
  loadBorrowings()
})
</script>

<template>
  <div class="borrowings-list">
    <div class="header">
      <h1>Borrowings</h1>
      <div>
        <el-button v-if="canReturn" type="success" @click="handleReturn" style="margin-right: 10px">Return Book</el-button>
        <el-button v-if="canAdd" type="primary" @click="handleAdd">Add Borrowing</el-button>
      </div>
    </div>

    <el-table :data="borrowings" v-loading="loading" stripe>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="dateBorrowed" label="Date Borrowed" width="200">
        <template #default="{ row }">
          {{ new Date(row.dateBorrowed).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="User" />
      <el-table-column prop="bookTitle" label="Book" />
      <el-table-column prop="isReturned" label="Returned">
        <template #default="{ row }">
          <el-tag :type="row.isReturned ? 'success' : 'warning'">
            {{ row.isReturned ? 'Yes' : 'No' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Actions" width="120">
        <template #default="{ row }">
          <el-button size="small" @click="handleView(row.id)">View</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="pagination.currentPage"
      :page-size="pagination.pageSize"
      :page-sizes="[10, 20, 50]"
      layout="sizes, prev, pager, next"
      :page-count="pagination.pageCount"
      :total="pagination.totalItems"
      @update:current-page="handlePageChange"
      @update:page-size="handlePageSizeChange"
    />
  </div>
</template>

<style scoped>
.borrowings-list {
  padding: 20px;
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
