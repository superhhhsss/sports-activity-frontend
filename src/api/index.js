// src/api/index.js

import axios from 'axios';
import store from '../store';
import router from '../router';

// 从环境变量中获取API基础URL
const baseURL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 请求拦截器：在每个请求头中添加token
apiClient.interceptors.request.use(config => {
    const token = store.state.token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// 响应拦截器：处理401等错误
apiClient.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response && error.response.status === 401) {
        // Token失效或未授权
        store.logout(); // 清除本地用户数据
        router.push('/login'); // 跳转到登录页
    }
    return Promise.reject(error);
});

// 导出所有API函数

// --- 用户认证 ---
export const register = (userData) => apiClient.post('/users/register', userData);
export const login = (credentials) => apiClient.post('/users/login', credentials);
export const getProfile = () => apiClient.get('/users/profile'); // 获取当前登录用户信息

// --- 体育活动 ---
export const getActivities = (params) => apiClient.get('/activities', { params }); // params可以包含搜索词 ?q=...
export const getActivityById = (id) => apiClient.get(`/activities/${id}`);
// (Admin) 创建活动
export const createActivity = (activityData) => apiClient.post('/activities', activityData);

// --- 报名/订单 ---
export const enrollActivity = (activityId) => apiClient.post(`/activities/${activityId}/enroll`);
export const getMyOrders = () => apiClient.get('/orders/my');

// --- 评论 ---
export const getComments = (activityId) => apiClient.get(`/activities/${activityId}/comments`);
export const postComment = (activityId, commentData) => apiClient.post(`/activities/${activityId}/comments`, commentData);