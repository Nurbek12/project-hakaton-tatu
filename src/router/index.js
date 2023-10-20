import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/admin/Dashboard.vue'
import Login from '../views/Login.vue'
import Post from '../views/Post.vue'
import Posts from '../views/admin/Posts.vue'
import Create from '../views/user/Create.vue'
import Settings from '../views/Settings.vue'
import Edit from '../views/user/Edit.vue'
import UserPosts from '../views/user/Posts.vue'
import Users from '../views/admin/Users.vue'
import store from '../store'

const beforeEnter = (to, __, next) => {
    if (!store.getters.logged) next('/login')
    else if (to.meta.role === 'all') next()
    else if (to.meta.role !== store.getters.role) next(store.getters.role==="staff"?'/staff':'/admin')
    else next()
}

const beforeEnterIndex = (to, __, next) => {
    if (!store.getters.logged) next('/login')
    else next(store.getters.role==="staff"?'/staff':'/admin')
}

export default createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: Dashboard, beforeEnter: beforeEnterIndex, },
        { path: '/admin', component: Dashboard, beforeEnter, meta: { role: "superuser" } },
        { path: '/login', component: Login },
        { path: '/posts', component: Posts, beforeEnter, meta: { role: "superuser" } },
        { path: '/settings', component: Settings, beforeEnter, meta: { role: "all" } },
        { path: '/post/:id', component: Post, beforeEnter, meta: { role: "all" } },
        { path: '/edit/:id', component: Edit, beforeEnter, meta: { role: "all" } },
        { path: '/newpost', component: Create, beforeEnter, meta: { role: "staff" }  },
        { path: '/staff', component: UserPosts, beforeEnter, meta: { role: "staff" } },
        { path: '/users', component: Users, beforeEnter, meta: { role: "superuser" } },
    ]
})