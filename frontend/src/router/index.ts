import { createRouter, createWebHistory } from 'vue-router'
import AuthorsList from '@/views/authors/AuthorsList.vue'
import AuthorDetail from '@/views/authors/AuthorDetail.vue'
import AuthorEdit from '@/views/authors/AuthorEdit.vue'
import BooksList from '@/views/books/BooksList.vue'
import BookDetail from '@/views/books/BookDetail.vue'
import BookEdit from '@/views/books/BookEdit.vue'
import BorrowingsList from '@/views/borrowings/BorrowingsList.vue'
import BorrowingDetail from '@/views/borrowings/BorrowingDetail.vue'
import BorrowingAdd from '@/views/borrowings/BorrowingAdd.vue'
import BorrowingReturn from '@/views/borrowings/BorrowingReturn.vue'
import UsersList from '@/views/users/UsersList.vue'
import UserDetail from '@/views/users/UserDetail.vue'
import UserEdit from '@/views/users/UserEdit.vue'
import Login from '@/views/auth/Login.vue'
import Register from '@/views/auth/Register.vue'
import { isAuthorized } from '@/services/helpers'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/authors',
    },
    // Authors routes
    {
      path: '/authors',
      name: 'authors',
      component: AuthorsList,
    },
    {
      path: '/authors/create',
      name: 'author-create',
      component: AuthorEdit,
    },
    {
      path: '/authors/:id',
      name: 'author-detail',
      component: AuthorDetail,
    },
    {
      path: '/authors/:id/edit',
      name: 'author-edit',
      component: AuthorEdit,
    },
    // Books routes
    {
      path: '/books',
      name: 'books',
      component: BooksList,
    },
    {
      path: '/books/create',
      name: 'book-create',
      component: BookEdit,
    },
    {
      path: '/books/:id',
      name: 'book-detail',
      component: BookDetail,
    },
    {
      path: '/books/:id/edit',
      name: 'book-edit',
      component: BookEdit,
    },
    // Borrowings routes
    {
      path: '/borrowings',
      name: 'borrowings',
      component: BorrowingsList,
    },
    {
      path: '/borrowings/add',
      name: 'borrowing-add',
      component: BorrowingAdd,
    },
    {
      path: '/borrowings/return',
      name: 'borrowing-return',
      component: BorrowingReturn,
    },
    {
      path: '/borrowings/:id',
      name: 'borrowing-detail',
      component: BorrowingDetail,
    },
    // Users routes
    {
      path: '/users',
      name: 'users',
      component: UsersList,
    },
    {
      path: '/users/create',
      name: 'user-create',
      component: UserEdit,
    },
    {
      path: '/users/:id',
      name: 'user-detail',
      component: UserDetail,
    },
    {
      path: '/users/:id/edit',
      name: 'user-edit',
      component: UserEdit,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    }
  ],
})

router.beforeEach((to, from) => {
  if (!isAuthorized.value) {
    if (typeof to.name === 'string' && !['login', 'register'].includes(to.name)) {
      router.push('/login')
    }
  }
})

export default router