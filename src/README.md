# 海报生成系统

这是一个用于生成科研项目海报的系统，支持两种样式：博士版和教授版。

## 项目结构

```
/
├── types/
│   └── poster.ts          # 共享的海报数据类型定义
├── components/
│   ├── PosterDoctor.tsx    # 博士版海报组件
│   └── PosterProfessor.tsx # 教授版海报组件
├── App.tsx                 # 博士版页面入口
└── Professor.tsx           # 教授版页面入口
```

## 共享变量结构

两个版本的海报共享相同的数据结构（`PosterData`），包含以下变量：

### 图片变量（2个）
- `posterImage` - 海报底图
- `qrCode` - 二维码图片

### 文本变量（4个）
- `subjectCategory` - 学科大类（支持换行符 `\n`）
- `projectTitle` - 项目/课题主题（支持换行符 `\n`）
- `suitableMajor` - 适合专业（支持换行符 `\n`）
- `tutorBackground` - 导师背景（支持换行符 `\n`）

**注意：所有文本变量都支持使用 `\n` 换行符来实现多行显示**

## 使用方法

### 1. 直接使用页面组件

**博士版（App.tsx）**
```typescript
import img from "figma:asset/...";
import img1 from "figma:asset/...";
import { PosterData } from "./types/poster";
import { PosterDoctor } from "./components/PosterDoctor";

const data: PosterData = {
  posterImage: img,
  qrCode: img1,
  subjectCategory: "材料\n科学",
  projectTitle: "新能源电池材料与技术\n研究",
  suitableMajor: "物理类 | 化学类\n材料科学",
  tutorBackground: "国内高校博士\n研究经验"
};

export default function App() {
  return <PosterDoctor data={data} />;
}
```

**教授版（Professor.tsx）**
```typescript
import img from "figma:asset/...";
import img1 from "figma:asset/...";
import { PosterData } from "./types/poster";
import { PosterProfessor } from "./components/PosterProfessor";

const data: PosterData = {
  posterImage: img,
  qrCode: img1,
  subjectCategory: "学科\n大类",
  projectTitle: "课题名称\n研究",
  suitableMajor: "适合专业\n研究方向",
  tutorBackground: "导师背景\n研究经验"
};

export default function Professor() {
  return <PosterProfessor data={data} />;
}
```

### 2. 在其他组件中使用

你可以在任何地方导入并使用这两个海报组件：

```typescript
import { PosterDoctor } from "./components/PosterDoctor";
import { PosterProfessor } from "./components/PosterProfessor";
import { PosterData } from "./types/poster";

function MyComponent() {
  const posterData: PosterData = {
    // ... 你的数据
  };

  return (
    <div>
      {/* 根据需要选择渲染哪个版本 */}
      <PosterDoctor data={posterData} />
      {/* 或 */}
      <PosterProfessor data={posterData} />
    </div>
  );
}
```

## 设计特点

- **固定尺寸**：两个版本都是 1080×1920px
- **保留原设计**：所有元素的大小、位置、字体、字号都保持原设计
- **样式差异**：
  - 博士版：深色背景，白色文字
  - 教授版：白色底板，带模糊遮罩效果
- **共享变量**：使用相同的数据结构，便于切换和管理