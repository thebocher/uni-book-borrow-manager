<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { booksApi } from '@/services/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import { AxiosError } from 'axios'
import { storage, Role } from '@/services/storage'

interface Book {
  id: number
  title: string
  stock: number
}

const router = useRouter()
const books = ref<Book[]>([])
const loading = ref(false)
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  totalItems: 0,
  pageCount: 1,
})
const canEdit = computed(() => !!storage.role.value && [Role.admin].includes(storage.role.value));
const canDelete = computed(() => !!storage.role.value && [Role.admin].includes(storage.role.value));
const canCreate = computed(() => !!storage.role.value && [Role.admin].includes(storage.role.value));

const handlePageChange = (value: number) => {
  pagination.value.currentPage = value;
  loadBooks();
}

const handlePageSizeChange = (value: number) => {
  pagination.value.pageSize = value;
  pagination.value.currentPage = 1;
  loadBooks();
}

const loadBooks = async () => {
  loading.value = true
  try {
    const response = await booksApi.getAll({
      page: pagination.value.currentPage,
      limit: pagination.value.pageSize,
    })
    const meta = response.data.meta;

    books.value = response.data.items;
    pagination.value = {
      totalItems: meta.totalItems,
      currentPage: meta.currentPage,
      pageSize: meta.itemsPerPage,
      pageCount: meta.totalPages,
    }

  } catch (error) {
    ElMessage.error('Failed to load books')
  } finally {
    loading.value = false
  }
}

const handleView = (id: number) => {
  router.push(`/books/${id}`)
}

const handleEdit = (id: number) => {
  router.push(`/books/${id}/edit`)
}

const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('Are you sure you want to delete this book?', 'Confirm Delete', {
      type: 'warning',
    })
    await booksApi.delete(id)
    ElMessage.success('Book deleted successfully')
    loadBooks()
  } catch (error) {
    if (error !== 'cancel') {
      let message = 'Failed to delete book';

      if (error instanceof AxiosError) {
        message += `. ${error.response?.data.message}`;
      }

      ElMessage.error(message)
    }
  }
}

const handleCreate = () => {
  router.push('/books/create')
}

onMounted(() => {
  loadBooks()
})
</script>

<template>
  <div class="books-list">
    <div class="header">
      <h1>Books</h1>
      <el-button v-if="canCreate" type="primary" @click="handleCreate">Create Book</el-button>
    </div>

    <el-table :data="books" v-loading="loading" stripe>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="title" label="Title" />
      <el-table-column prop="stock" label="Stock" width="100" />
      <el-table-column label="Actions" width="240">
        <template #default="{ row }">
          <el-button size="small" @click="handleView(row.id)">View</el-button>
          <el-button v-if="canEdit" size="small" type="primary" @click="handleEdit(row.id)">Edit</el-button>
          <el-button v-if="canDelete" size="small" type="danger" @click="handleDelete(row.id)">Delete</el-button>
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
.books-list {
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
