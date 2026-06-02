# 海报渲染服务 v2.0

支持 **博士版** / **教授版** 双版式的海报渲染 API 服务。

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 安装 Playwright 浏览器

```bash
npx playwright install chromium
```

### 3. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件，设置 API_AUTH_TOKEN
```

### 4. 构建前端

```bash
npm run build
```

### 5. 启动服务

```bash
npm start
```

服务将在 `http://localhost:3001` 启动。

## 📋 API 接口

### 健康检查

```bash
GET /health
```

### 获取变量说明

```bash
GET /api/variables
# 需要 API 鉴权
```

### 渲染海报

```bash
POST /api/render
Content-Type: application/json
X-API-Key: YOUR_API_TOKEN

{
  "filename": "poster_001",
  "posterVersion": "doctor",
  "variables": {
    "posterImage": "https://example.com/bg.jpg",
    "qrCode": "https://example.com/link",
    "subjectCategory": "材料\n科学",
    "projectTitle": "新能源电池材料与技术",
    "suitableMajor": "物理类 | 化学类",
    "tutorBackground": "国内高校博士"
  }
}
```

### 完整变量 API 请求示例

#### 博士版完整请求

```bash
curl -X POST http://localhost:3001/api/render \
  -H "X-API-Key: YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "doctor_poster_001",
    "posterVersion": "doctor",
    "variables": {
      "posterImage": "https://example.com/bg.jpg",
      "qrCode": "https://example.com/qr-link",
      "subjectCategory": "材料\n科学",
      "projectTitle": "新能源电池材料与技术研究",
      "suitableMajor": "物理类 | 化学类",
      "tutorBackground": "国内高校博士",
      "mainTitle": "1V1",
      "researchBenefit": "专属导师推荐信",
      "paperBenefit": "国际会议论文",
      "projectLabel": "国内高校科研项目[1V1]",
      "projectSubtitle": "远程线上科研 | 全年滚动招生",
      "qrCaption": "扫码了解课题详情",
      "tutorBackgroundLabel": "导师背景",
      "suitableMajorLabel": "适合专业"
    }
  }'
```

#### 教授版完整请求

```bash
curl -X POST http://localhost:3001/api/render \
  -H "X-API-Key: YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "professor_poster_001",
    "posterVersion": "professor",
    "variables": {
      "posterImage": "https://example.com/bg.jpg",
      "qrCode": "https://example.com/qr-link",
      "subjectCategory": "材料\n科学",
      "projectTitle": "新能源电池材料与技术研究",
      "suitableMajor": "物理类 | 化学类",
      "tutorBackground": "国内高校博士",
      "mainTitle": "1V1",
      "researchBenefit": "专属导师推荐信",
      "paperBenefit": "国际会议论文",
      "projectLabel": "国内高校科研项目[1V1]",
      "projectSubtitle": "远程线上科研 | 全年滚动招生",
      "qrCaption": "扫码了解课题详情",
      "tutorBackgroundLabel": "参考导师背景",
      "suitableMajorLabel": "适合专业"
    }
  }'
```

#### 最小必填请求示例

```bash
curl -X POST http://localhost:3001/api/render \
  -H "X-API-Key: YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "minimal_poster",
    "posterVersion": "doctor",
    "variables": {
      "posterImage": "https://example.com/bg.jpg",
      "qrCode": "https://example.com/qr-link",
      "subjectCategory": "材料\n科学",
      "projectTitle": "新能源电池材料与技术研究",
      "suitableMajor": "物理类 | 化学类",
      "tutorBackground": "国内高校博士"
    }
  }'
```

### 获取生成的图片

```bash
GET /images/:filename.png
# 无需鉴权
```

## 🎨 海报版本

| 版本 | posterVersion | 说明 |
|------|---------------|------|
| 博士版 | `doctor` | 深色全幅背景，白色文字 |
| 教授版 | `professor` | 白色顶部区域，深色主体背景 |

## 📝 变量说明

### 请求体结构

```json
{
  "filename": "string",           // 必填：输出文件名（不含后缀）
  "posterVersion": "doctor | professor",  // 必填：海报版本
  "variables": {
    // 必填变量
    "posterImage": "string",      // 海报背景图 URL
    "qrCode": "string",           // 二维码内容 URL（自动生成二维码）
    "subjectCategory": "string",  // 学科大类（支持 \n 换行）
    "projectTitle": "string",     // 课题名称
    "suitableMajor": "string",    // 适合专业
    "tutorBackground": "string",  // 导师背景
    
    // 可选变量（有默认值）
    "mainTitle": "string",            // 主标题
    "researchBenefit": "string",      // 科研权益
    "paperBenefit": "string",         // 论文权益
    "projectLabel": "string",         // 项目标题
    "projectSubtitle": "string",      // 项目副标题
    "qrCaption": "string",            // 二维码说明文字
    "tutorBackgroundLabel": "string", // 导师背景标签
    "suitableMajorLabel": "string"    // 适合专业标签
  }
}
```

### 必填变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `posterImage` | 海报背景图 URL | `https://...` |
| `qrCode` | 二维码内容 URL | `https://...` |
| `subjectCategory` | 学科大类（支持 `\n` 换行） | `材料\n科学` |
| `projectTitle` | 课题名称 | `新能源电池材料与技术` |
| `suitableMajor` | 适合专业 | `物理类 \| 化学类` |
| `tutorBackground` | 导师背景 | `国内高校博士` |

### 可选变量（固定内容，有默认值）

| 变量名 | 博士版默认值 | 教授版默认值 |
|--------|-------------|-------------|
| `mainTitle` | `1V1` | `1V1` |
| `researchBenefit` | `专属导师推荐信` | `专属导师推荐信` |
| `paperBenefit` | `国际会议论文` | `国际会议论文` |
| `projectLabel` | `国内高校科研项目[1V1]` | `国内高校科研项目[1V1]` |
| `projectSubtitle` | `远程线上科研 \| 全年滚动招生` | `远程线上科研 \| 全年滚动招生` |
| `qrCaption` | `扫码了解课题详情` | `扫码了解课题详情` |
| `tutorBackgroundLabel` | `导师背景` | `参考导师背景` |
| `suitableMajorLabel` | `适合专业` | `适合专业` |

### 响应格式

#### 成功响应

```json
{
  "success": true,
  "message": "渲染完成",
  "data": {
    "fileName": "poster_001.png",
    "filePath": "/path/to/images/poster_001.png",
    "imageUrl": "http://localhost:3001/images/poster_001.png",
    "posterVersion": "doctor"
  }
}
```

#### 错误响应

```json
{
  "success": false,
  "error": "错误信息"
}
```

## 🔐 鉴权说明

### API 鉴权

`/api/*` 接口需要以下任一方式鉴权：

```bash
# 方式1: Authorization Header
Authorization: Bearer YOUR_API_TOKEN

# 方式2: X-API-Key Header
X-API-Key: YOUR_API_TOKEN
```

### UI 控制台鉴权

访问 `/ui` 时使用浏览器基础认证：

- 账户：`zkyc`
- 密码：`Zkyc@565758`

## 🛠 开发模式

```bash
# 启动前端开发服务器
npm run dev:frontend

# 启动后端服务（开发模式）
npm run dev
```

## 📁 项目结构

```
new_figma_poster/
├── src/
│   ├── components/
│   │   ├── PosterDoctor.tsx    # 博士版海报组件
│   │   ├── PosterProfessor.tsx # 教授版海报组件
│   │   └── ui/                 # UI 组件库
│   ├── types/
│   │   └── poster.ts           # 类型定义
│   ├── assets/                 # 静态资源
│   ├── App.tsx                 # 主应用
│   └── main.tsx                # 入口文件
├── public/
│   └── ui/
│       └── index.html          # UI 控制台
├── server.js                   # 后端 API 服务
├── package.json
├── vite.config.ts
└── .env.example
```

## 📌 注意事项

1. 首次运行前必须执行 `npm run build` 构建前端
2. 确保已安装 Playwright Chromium 浏览器
3. 生成的图片保存在 `images/` 目录
4. 支持的图片格式为 PNG，尺寸 1080x1920
5. 二维码会根据 `qrCode` URL 自动生成，无需提供二维码图片
