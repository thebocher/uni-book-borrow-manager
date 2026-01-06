<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { storage, Role } from './services/storage'
import { computed } from 'vue'
import { isAuthorized } from './services/helpers'

const router = useRouter()
const route = useRoute()

const menuItems = computed(() => {
  const items = []

  if (isAuthorized.value) {
    items.push({ path: '/authors', label: 'Authors' }, { path: '/books', label: 'Books' })
  }

  if (storage.role.value && [Role.admin, Role.manager].includes(storage.role.value)) {
    items.push({ path: '/users', label: 'Users' })
  }

  if (isAuthorized.value) {
    items.push({ path: '/borrowings', label: 'Borrowings' })
  }

  if (storage.access_token.value) {
    items.push({
      label: 'Logout',
      path: '/logout',
    })
  } else {
    items.push({ path: '/login', label: 'Login' })
  }

  return items
})

const handleSelect = (index: string) => {
  if (index === '/logout') {
    storage.access_token.value = ''
    router.push('/login')
  }
}
</script>

<template>
  <div id="app">
    <el-container>
      <el-header>
        <div class="header-content">
          <h1>Library Management System</h1>

          <el-space>
            <el-menu
              :default-active="route.path"
              :ellipsis="false"
              mode="horizontal"
              router
              class="header-menu"
              @select="handleSelect"
            >
              <el-menu-item v-for="item in menuItems" :key="item.path" :index="item.path">
                {{ item.label }}
              </el-menu-item>
            </el-menu>
          </el-space>
        </div>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
}

.el-container {
  min-height: 100vh;
}

.el-header {
  background-color: #409eff;
  color: white;
  padding: 0;
  display: flex;
  align-items: center;
}

.header-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.header-content h1 {
  margin: 0;
  font-size: 24px;
}

.header-menu {
  background-color: transparent;
  border-bottom: none;
}

.header-menu .el-menu-item {
  color: white;
  border-bottom: 2px solid transparent;
}

.header-menu .el-menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.header-menu .el-menu-item.is-active {
  color: white;
  border-bottom-color: white;
  background-color: rgba(255, 255, 255, 0.1);
}

.el-main {
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
}
</style>
