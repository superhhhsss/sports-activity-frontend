// src/store/index.js

import { reactive, readonly } from 'vue'

// 定义初始状态
const state = reactive({
    user: null, // 存储用户信息 { id, username, role }
    token: localStorage.getItem('token') || null, // 从localStorage初始化token
});

// 定义修改状态的方法
const mutations = {
    setUser(user) {
        state.user = user;
    },
    setToken(token) {
        state.token = token;
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    },
    logout() {
        this.setUser(null);
        this.setToken(null);
    }
};

export default {
    // 使用 readonly 防止外部直接修改 state
    state: readonly(state),
    ...mutations
};