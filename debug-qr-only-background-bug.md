# Debug Session: qr-only-background-bug

## Status: [OPEN]
## Created: 2026-06-04

## Bug Description
"只加入二维码"模式下，海报背景显示异常（显示为二维码而非背景图）

## Reproduction Steps
1. 访问 http://localhost:3001/ui
2. 选择"只加入二维码"版本
3. 填写海报背景图 URL（如 https://...bJPdZ9.jpg）
4. 填写二维码内容 URL
5. 生成海报

## Expected Behavior
海报显示正确的背景图 + 二维码

## Actual Behavior
海报背景显示为二维码图片

## Environment
- OS: Windows
- Node.js: (version)
- Browser: Playwright Chromium (headless)
- Server: http://localhost:3001

## Hypotheses
1. **H1**: 后端 `renderPoster` 函数中，`qrCode` 字段被错误地当作背景图使用
2. **H2**: 前端 `PosterDoctor.tsx` 中，`posterImage` 变量未正确传递或渲染
3. **H3**: `qr-only` 模式下，`qrOnlyVariables` 构造时字段名或值有误
4. **H4**: 前端 `App.tsx` 中，`getRenderData()` 对 `qr-only` 模式的数据处理有逻辑错误
5. **H5**: Playwright 截图时，DOM 渲染顺序或层级导致背景图被覆盖

## Instrumentation Plan
- 在后端 `renderPoster` 函数中添加日志，记录接收到的 variables
- 在前端 `PosterDoctor.tsx` 中添加日志，记录实际渲染的 posterImage 和 qrCode 值
- 在 `App.tsx` 中添加日志，记录 `getRenderData()` 返回的数据

## Evidence Log
(Will be populated during debugging)

## Fix
(Pending evidence)

## Verification
(Pending)
