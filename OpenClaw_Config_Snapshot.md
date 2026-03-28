# OpenClaw 系统调优快照 (2026-03-25)

## 1. 核心模型分工 (大模型管线化)
- **主脑 (日常沟通)**: `google/gemini-flash-latest` (极速响应，已关闭 reasoning/think 模式)
- **眼睛 (视觉分析)**: `google/gemini-3.1-pro-preview` (最强多模态，分析图文视频)
- **进化引擎 (复杂任务)**: `google/gemini-3.1-pro-preview` (用于 OpenSpace 自动修复代码)

## 2. 响应速度优化
- **传输模式**: 已开启 `streaming: true` (蹦字模式/流式输出)
- **隐形思考**: 已关闭 `<think>` 标签输出，实现“秒回”体验。

## 3. 定时任务 (HEARTBEAT.md)
- **新闻简报**: 北京时间 07:00 (早报) / 13:30 (午报)
- **内容范畴**: 国际政治、战争冲突、务实 AI 进展。

## 4. 关键组件安装
- **OpenSpace**: 集成在 `/root/.openclaw/workspace/OpenSpace`。
- **环境变量**: `.env` 文件已配置 `GEMINI_API_KEY`, `DEEPSEEK_API_KEY`, `OPENSPACE_MODEL`。

## 5. 网站维护配置
- **仓库地址**: TerryAI3.github.io
- **域名关联**: zuodii.com / www.zuodii.com (通过 Namecheap DNS 解析 A记录/CNAME)。
- **安全加固**: 已强制开启 Enforce HTTPS。

---
*此文档由东来哥自动生成，作为系统配置备份。*
