<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authorsApi } from '@/services/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Role, storage } from '@/services/storage'

interface Author {
  id: number
  name: string
}

const router = useRouter()
const authors = ref<Author[]>([])
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  totalItems: 0,
  pageCount: 1,
})
const loading = ref(false)

const canEdit = computed(() => !!storage.role.value && [Role.admin].includes(storage.role.value));
const canDelete = computed(() => !!storage.role.value && [Role.admin].includes(storage.role.value));
const canCreate = computed(() => !!storage.role.value && [Role.admin].includes(storage.role.value));

const handlePageChange = (value: number) => {
  pagination.value.currentPage = value;
  loadAuthors();
}

const handlePageSizeChange = (value: number) => {
  pagination.value.pageSize = value;
  pagination.value.currentPage = 1;
  loadAuthors();
}

const loadAuthors = async () => {
  loading.value = true
  try {
    const response = await authorsApi.getAll({
      page: pagination.value.currentPage,
      pageSize: pagination.value.pageSize,
    });
    const meta = response.data.meta;

    authors.value = response.data.items
    pagination.value = {
      totalItems: meta.totalItems,
      currentPage: meta.currentPage,
      pageSize: meta.itemsPerPage,
      pageCount: meta.totalPages,
    };
  } catch (error) {
    ElMessage.error('Failed to load authors')
  } finally {
    loading.value = false
  }
}

const handleView = (id: number) => {
  router.push(`/authors/${id}`)
}

const handleEdit = (id: number) => {
  router.push(`/authors/${id}/edit`)
}

const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('Are you sure you want to delete this author?', 'Confirm Delete', {
      type: 'warning',
    })
    await authorsApi.delete(id)
    ElMessage.success('Author deleted successfully')
    loadAuthors()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to delete author')
    }
  }
}

const handleCreate = () => {
  router.push('/authors/create')
}

onMounted(() => {
  loadAuthors()
})
</script>

<template>
  <div class="authors-list">
    <div class="header">
      <h1>Authors</h1>
      <el-button v-if="canCreate" type="primary" @click="handleCreate">Create Author</el-button>
    </div>

    <el-table :data="authors" v-loading="loading" stripe>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="Name" />
      <el-table-column label="Actions" width="240">
        <template #default="{ row }">
          <el-button size="small" @click="handleView(row.id)">View</el-button>
          <el-button v-if="canEdit" size="small" type="primary" @click="handleEdit(row.id)"
            >Edit</el-button
          >
          <el-button v-if="canDelete" size="small" type="danger" @click="handleDelete(row.id)"
            >Delete</el-button
          >
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
.authors-list {
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
