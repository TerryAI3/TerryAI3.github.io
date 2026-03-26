# OpenCLI Integration Skill

集成OpenCLI命令行工具，让AI Agent直接控制网站和桌面应用。

## 支持平台

### 中文平台
- **小红书**：搜索、下载、用户内容
- **B站**：热门、搜索、视频下载  
- **知乎**：热榜、问题、文章导出
- **微博**：热搜、搜索
- **微信**：公众号文章下载

### 国际平台
- **Twitter/X**：趋势、搜索、发推
- **Reddit**：热门、子版块
- **YouTube**：搜索、字幕
- **Instagram**：探索、用户

### 桌面应用
- **Cursor**：控制IDE
- **Antigravity**：控制AI应用
- **Notion**：搜索、读写
- **ChatGPT**：桌面版控制

## 使用示例

```bash
# 查看所有命令
opencli list

# 小红书搜索
opencli xiaohongshu search "关键词" --limit 10

# B站热门视频
opencli bilibili hot --limit 5 -f json

# 知乎热榜
opencli zhihu hot

# Twitter趋势
opencli twitter trending

# 下载小红书内容
opencli xiaohongshu download 笔记ID --output ./downloads
```

## 配置要求

1. **Chrome扩展**：安装OpenCLI Browser Bridge
2. **登录状态**：在Chrome中登录目标网站
3. **视频下载**：需要`yt-dlp`（可选）

## AI Agent集成

AI可以通过以下方式发现和使用：
- `opencli list` 查看所有可用命令
- JSON/YAML输出格式便于AI解析
- 结构化数据适合自动化处理

## 业务应用

### 佐迪智能家具
- 小红书竞品分析
- B站家居内容趋势
- 知乎专业讨论跟踪

### 学术研究
- Twitter学术动态
- Reddit技术讨论
- 知乎专业问答

### 内容创作
- 多平台内容同步
- 热点话题追踪
- 竞品内容分析