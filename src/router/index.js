// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';

// 导入页面组件
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import ActivityList from '../views/ActivityList.vue';
import ActivityDetail from '../views/ActivityDetail.vue';
import MyOrders from '../views/MyOrders.vue';
import AdminDashboard from '../views/AdminDashboard.vue'; // 管理员页面

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home, // 首页可以重定向或作为活动列表的别名
        redirect: '/activities',
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { guestOnly: true } // 登录后不应再访问
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
        meta: { guestOnly: true }
    },
    {
        path: '/activities',
        name: 'ActivityList',
        component: ActivityList,
    },
    {
        path: '/activities/:id', // 动态路由，:id是活动ID
        name: 'ActivityDetail',
        component: ActivityDetail,
        props: true, // 将路由参数作为props传递给组件
    },
    {
        path: '/my-orders',
        name: 'MyOrders',
        component: MyOrders,
        meta: { requiresAuth: true } // 需要登录才能访问
    },
    {
        path: '/admin/dashboard',
        name: 'AdminDashboard',
        component: AdminDashboard,
        meta: { requiresAuth: true, requiresAdmin: true } // 需要管理员权限
    },
    // 可以添加一个404页面
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('../views/NotFound.vue')
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
    const token = store.state.token;

    // 如果没有用户信息但有token，尝试获取用户信息
    if (token && !store.state.user) {
        try {
            const response = await import('../api').then(api => api.getProfile());
            store.setUser(response.data);
        } catch (error) {
            console.error("Failed to fetch user profile, logging out.", error);
            store.logout();
        }
    }

    const user = store.state.user;

    if (to.meta.requiresAuth && !token) {
        // 需要登录但未登录
        next('/login');
    } else if (to.meta.requiresAdmin && (!user || user.role !== 'admin')) {
        // 需要管理员权限但不是管理员
        alert('无权访问此页面！');
        next(from.path || '/'); // 从哪来回哪去，或返回首页
    } else if (to.meta.guestOnly && token) {
        // 已登录用户访问登录/注册页，重定向到首页
        next('/');
    }
    else {
        // 其他情况，正常放行
        next();
    }
});

export default router;