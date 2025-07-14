## 体育活动室 Web 应用 - 前端

这是一个基于 Vue.js 框架构建的体育活动室 Web 应用前端项目。用户可以在这里浏览、搜索、报名参加体育活动，并对活动进行评论。项目还包含了完整的用户认证系统和管理员后台功能。

## ✨ 主要功能

- **用户系统**: 支持多用户注册和登录认证。
- **活动列表**: 分页或无限滚动展示所有体育活动，支持模糊搜索。
- **活动详情**: 查看单个活动的详细信息，包括地点、时间、剩余名额等。
- **活动报名**: 用户登录后可一键报名参加活动。
- **订单管理**: 用户可以查看自己所有已报名的活动订单。
- **活动评论**: 用户可以对活动发表自己的看法和评论。
- **管理员后台**: 管理员可以创建、管理新的体育活动。

## 🚀 技术栈

- **框架**: [Vue 3](https://v3.vuejs.org/) (使用 Composition API)
- **构建工具**: [Vite](https://vitejs.dev/)
- **路由**: [Vue Router 4](https://router.vuejs.org/)
- **状态管理**: Vue 3 `reactive` API (适用于中小型项目的轻量级方案)
- **HTTP客户端**: [Axios](https://axios-http.com/)
- **UI/样式**: 原生 CSS，遵循 BEM 命名规范，实现了组件化、模块化的设计。

## 📋 环境准备

在开始之前，请确保你的开发环境中安装了以下软件：

- [Node.js](https://nodejs.org/) (推荐 `v16.x` 或更高版本)
- [WebStorm](https://www.jetbrains.com/webstorm/) (或你喜欢的任何代码编辑器)
- 一个现代浏览器 (如 Chrome, Firefox, Edge)

## 📦 安装与启动

1.  **克隆项目**
    ```bash
    git clone <your-repository-url>
    cd sports-activity-frontend
    ```

2.  **安装依赖**
    在项目根目录下打开终端，运行以下命令：
    ```bash
    npm install
    ```

3.  **配置后端 API 地址**
    项目根目录下有一个 `.env.development` 文件，它指定了开发环境下后端服务的地址。请确保其内容与你的后端服务匹配。
    ```
    # .env.development
    VITE_API_BASE_URL=http://localhost:3000/api
    ```
    如果你的后端运行在不同的端口，请修改此文件。

4.  **启动开发服务器**
    运行以下命令来启动项目：
    ```bash
    npm run dev
    ```
    启动成功后，终端会显示应用的访问地址，通常是 `http://localhost:5173`。在浏览器中打开此地址即可访问。

## 📝 项目结构
src/
├── api/ # API 请求封装
├── assets/ # 全局静态资源 (如 CSS)
├── components/ # 可复用的 UI 组件
├── router/ # Vue Router 路由配置
├── store/ # 全局状态管理
├── views/ # 页面级组件
├── App.vue # 根组件
└── main.js # 应用入口
