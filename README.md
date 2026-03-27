# New API Frontend UI Redesign

基于 Semi UI + Tailwind CSS 的 New API 前端界面重设计，包含深色 Hero 区域、渐变光球动画、定价卡片等组件。

> 本项目为前端界面代码，需要配合 [New API](https://github.com/sft-666/new-api) 后端一起使用。

---

## 📦 目录

- [快速部署](#-快速部署)
- [配置说明](#-配置说明)
- [页面自定义](#-页面自定义)
- [订阅链接配置](#-订阅链接配置)
- [文件结构](#-文件结构)
- [常见问题](#-常见问题)

---

## 🚀 快速部署

### 方式一：独立部署（推荐）

适用于已有 New API 后端，想单独更新前端界面的场景。

```bash
# 1. 克隆本仓库
git clone https://github.com/sst666/new-api-redesign.git
cd new-api-redesign

# 2. 安装依赖
npm install
# 或使用 bun
bun install

# 3. 构建生产版本
npm run build
# 输出目录: dist/

# 4. 将 dist/ 下的所有文件上传到你的 Web 服务器
# 或使用 Nginx/Caddy 等反向代理
```

### 方式二：替换现有 new-api-web

适用于将本界面直接替换到 `new-api` 项目中。

```bash
# 在 new-api-web 项目中
cp -r /path/to/new-api-redesign/src/* /path/to/new-api/web/src/
cp /path/to/new-api-redesign/tailwind.config.js /path/to/new-api/web/

# 然后重新构建
cd /path/to/new-api/web
npm run build
```

### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/new-api-redesign/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 代理到后端
    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## ⚙️ 配置说明

### 后端 API 对接

前端通过 `/api/status` 接口获取系统配置，**无需在前端硬编码**。后端返回的 status 对象包含以下字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| `server_address` | string | 服务器地址，用于拼接 API 调用 |
| `demo_site_enabled` | boolean | 是否启用演示站点模式 |
| `docs_link` | string | 文档链接 |
| `version` | string | 系统版本号 |
| `enable_online_topup` | boolean | 是否启用在线充值 |
| `home_page_content` | string | 自定义首页内容（支持 Markdown 或 URL） |

> 完整的 status 字段由后端控制，修改后端配置即可生效。

### 环境变量

本项目使用 Vite 构建，支持以下环境变量：

```env
VITE_APP_TITLE=New API
# API 基础地址（留空则使用相对路径）
VITE_API_BASE_URL=
```

### 修改 API 地址

如果需要指定后端 API 地址，修改以下位置：

1. **相对路径模式**（默认）：API 请求会使用当前域名 + `/api/`
2. **绝对路径模式**：在 `vite.config.js` 中配置 proxy

```js
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'https://your-backend-domain.com',
      changeOrigin: true,
    },
  },
},
```

---

## 🎨 页面自定义

### 修改 Hero 区域文字

文件：`src/pages/Home/index.jsx`

```jsx
// Hero 大标题
<Title heading={2}>{t('重构您的 AI 编程体验')}</Title>

// 副标题
<Paragraph className="text-lg">{t('尽享卓越的 API 体验')}</Paragraph>

// CTA 按钮
<Button size="large" theme="solid" onClick={...}>
  {t('立即开始')}
</Button>
```

### 修改定价套餐

文件：`src/pages/Home/index.jsx`（约第 290-380 行）

```jsx
// 套餐数据结构
const plans = [
  {
    name: '体验款',
    price: '¥199',
    period: '/月',
    description: '适合个人开发测试',
    features: ['100元额度', '客服支持', '...'],
    buttonText: '获取密钥',
    buttonVariant: 'secondary',
  },
  // ...
];
```

修改套餐步骤：
1. 编辑 `plans` 数组中的套餐信息
2. 对应调整 `features` 数组中的功能列表
3. 修改 `price` 和 `period` 调整价格显示

### 修改主题颜色

文件：`tailwind.config.js`

```js
colors: {
  // Hero 渐变色
  'hero-purple': '#6366f1',  // 主紫色
  'hero-blue': '#3b82f6',     // 辅助蓝色
},
```

文件：`src/index.css`（光球样式）

```css
.hero-orb-purple {
  background: radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, transparent 70%);
}

.hero-orb-blue {
  background: radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, transparent 70%);
}
```

### 修改光球动画

文件：`src/index.css`

```css
@keyframes heroOrbFloat {
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-20px) scale(1.05); }
}
```

调整参数：
- `translateY(-20px)` — 上下浮动幅度
- `scale(1.05)` — 缩放比例变化
- `8s` — 动画周期（在 tailwind.config.js 中）

### 修改页脚信息

文件：`src/components/layout/Footer.jsx`

---

## 🔗 订阅链接配置

### 订阅管理页面

订阅功能由后端驱动，前端路径：`/subscription`

用户可在该页面：
- 查看现有订阅
- 创建新订阅（对接支付链接）
- 续费/取消订阅

### 订阅数据来源

订阅信息通过以下 API 获取：

```
GET /api/subscriptions
```

返回订阅列表，每个订阅包含：
- `id` — 订阅 ID
- `name` — 订阅名称
- `link` — 支付/订阅链接（用户点击后跳转）
- `status` — 订阅状态

### 配置订阅链接

订阅链接由**后端**管理，在 New API 后台的「订阅管理」页面进行配置：

1. 进入后台管理 → 订阅管理
2. 添加/编辑订阅计划
3. 填写支付链接（如 Stripe、收款码等）
4. 前端自动读取并展示

### 前端订阅展示逻辑

文件：`src/components/table/subscriptions/SubscriptionsTable.jsx`

订阅链接的展示由后端返回的 `link` 字段决定，前端直接渲染为可点击链接：

```jsx
// 点击订阅链接
window.open(subscription.link, '_blank');
```

### 在线充值配置

在线充值功能由后端控制，前端通过 status 中的 `enable_online_topup` 字段判断是否显示充值入口。

---

## 📁 文件结构

```
new-api-redesign/
├── src/
│   ├── pages/
│   │   └── Home/
│   │       └── index.jsx      # 首页（含 Hero、定价、FAQ 等）
│   ├── components/             # 公共组件
│   ├── constants/              # 常量定义
│   ├── context/                # React Context（状态管理）
│   ├── hooks/                  # 自定义 Hooks
│   ├── helpers/                # 工具函数
│   ├── services/               # API 服务层
│   └── index.css               # 全局样式 + 动画
├── tailwind.config.js          # Tailwind 主题配置
├── vite.config.js              # Vite 构建配置
└── package.json
```

### 核心文件说明

| 文件 | 说明 |
|------|------|
| `src/pages/Home/index.jsx` | 首页主文件，包含 Hero、定价、特性、FAQ |
| `src/index.css` | 全局样式，包含 Hero 光球动画、FAQ 折叠面板样式 |
| `tailwind.config.js` | Tailwind 主题扩展，定义了 hero-purple/hero-blue 颜色 |
| `src/context/Status/` | 系统状态 Context，从后端 `/api/status` 获取配置 |
| `src/components/table/subscriptions/` | 订阅管理组件 |

---

## ❓ 常见问题

### Q: 页面显示空白或 API 请求失败

检查后端是否正常运行，确保 `/api/status` 接口可访问。

```bash
# 本地测试后端接口
curl http://localhost:3000/api/status
```

### Q: 如何禁用深色主题？

本项目使用 `darkMode: 'class'`，深色模式由系统或手动切换触发。如需修改默认主题，搜索 `dark` 相关 CSS 类进行调整。

### Q: Hero 动画在移动端性能差

可以在 `src/index.css` 中为移动端禁用动画：

```css
@media (max-width: 768px) {
  .hero-orb {
    animation: none !important;
  }
}
```

### Q: 如何添加新的模型供应商图标？

1. 从 [@lobehub/icons](https://github.com/lobehub/lobe-icons) 导入图标组件
2. 在 `src/pages/Home/index.jsx` 的导入列表中添加
3. 在模型展示区域添加对应的 `<图标 />` 组件

```jsx
import { NewProvider } from '@lobehub/icons';

// 在 JSX 中使用
<NewProvider size={32} />
```

### Q: 订阅链接点击无反应

检查浏览器控制台是否有跨域错误。如果前端部署在独立域名，需要后端配置 CORS 允许该域名访问。

---

## 📄 License

本项目基于 [GNU AGPLv3](./LICENSE) 开源。
