# 技术栈选择

## 概述
本文档详细记录了佐迪智能家具官网项目采用的技术栈，包括选择理由、版本信息、配置要点和最佳实践。

## 技术栈总览
### 前端技术栈
- **框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **样式方案**: Tailwind CSS + CSS Modules
- **状态管理**: React Context + Zustand（计划中）
- **路由**: React Router DOM 6
- **UI组件**: Radix UI Primitives
- **图标**: Lucide React
- **HTTP客户端**: Axios
- **数据获取**: React Query（计划中）
- **表单处理**: React Hook Form（计划中）
- **测试**: Vitest + React Testing Library

### 后端技术栈
- **运行时**: Node.js 20+
- **框架**: Express.js（计划中）
- **API风格**: RESTful + tRPC（计划中）
- **数据库**: PostgreSQL + Drizzle ORM
- **认证**: JWT + OAuth2（计划中）
- **文件存储**: AWS S3（计划中）
- **实时通信**: WebSocket（计划中）

### 开发工具
- **包管理器**: npm
- **代码格式化**: Prettier
- **代码检查**: ESLint
- **类型检查**: TypeScript
- **版本控制**: Git + GitHub
- **CI/CD**: GitHub Actions（计划中）
- **容器化**: Docker（计划中）

### 基础设施
- **托管**: GitHub Pages（当前）+ Vercel（计划中）
- **CDN**: Cloudflare
- **域名**: zuodii.com
- **监控**: Cloudflare Analytics + 自定义监控
- **安全**: Cloudflare WAF + 安全头

## 技术选择理由
### React + TypeScript
**选择理由**:
1. **成熟稳定**: React生态成熟，社区活跃，有大量最佳实践
2. **类型安全**: TypeScript提供编译时类型检查，减少运行时错误
3. **开发体验**: 优秀的开发工具支持，如VSCode智能提示
4. **团队熟悉**: 团队对React和TypeScript有丰富经验
5. **招聘市场**: 技术人才充足，便于团队扩展

**版本选择**:
- React: 18.x（支持并发特性）
- TypeScript: 5.x（最新稳定版）

### Vite
**选择理由**:
1. **构建速度**: 极快的冷启动和热更新，提升开发体验
2. **现代标准**: 基于ESM，支持现代浏览器特性
3. **配置简单**: 开箱即用，配置简洁明了
4. **生态丰富**: 插件生态逐渐成熟
5. **未来趋势**: 逐渐成为社区标准

**优化配置**:
- 生产环境移除console.log
- 智能代码分割
- CDN基础路径支持
- 长期缓存策略

### Tailwind CSS
**选择理由**:
1. **开发效率**: 实用优先，快速构建UI
2. **一致性**: 设计系统一致，减少样式冲突
3. **性能优化**: 生产环境自动移除未使用样式
4. **响应式**: 内置响应式设计支持
5. **可维护性**: 样式与组件紧密耦合，易于维护

### Radix UI
**选择理由**:
1. **无障碍**: 严格遵循WAI-ARIA标准
2. **无样式**: 提供功能完备的无样式组件
3. **组合性**: 组件设计灵活，易于组合
4. **质量保证**: 经过严格测试，质量可靠
5. **维护活跃**: 团队维护积极，更新及时

## 架构设计原则
### 1. 组件化设计
- **原子设计**: 遵循原子设计方法论
- **单一职责**: 每个组件职责单一明确
- **可复用性**: 设计可复用的通用组件
- **可测试性**: 组件易于单元测试

### 2. 状态管理
- **本地状态**: 使用React useState/useReducer
- **全局状态**: 使用React Context（简单场景）
- **复杂状态**: 计划引入Zustand（轻量级）
- **服务器状态**: 计划使用React Query

### 3. 数据流设计
- **单向数据流**: 遵循React单向数据流原则
- **Props向下传递**: 数据通过props向下传递
- **事件向上冒泡**: 事件通过回调向上传递
- **状态提升**: 共享状态提升到最近共同祖先

### 4. 性能优化
- **代码分割**: 路由级和组件级代码分割
- **懒加载**: 非关键资源懒加载
- **图片优化**: WebP格式，响应式图片
- **缓存策略**: CDN缓存，浏览器缓存

## 开发规范
### 代码规范
1. **命名规范**
   - 组件: PascalCase（如 `ProductCard.tsx`）
   - 函数/变量: camelCase
   - 常量: UPPER_SNAKE_CASE
   - 文件: kebab-case（如 `product-card.tsx`）

2. **导入顺序**
   ```typescript
   // 1. 第三方库
   import React from 'react';
   import { useRouter } from 'next/router';
   
   // 2. 项目内部模块
   import { Product } from '@/types';
   import ProductCard from '@/components/ProductCard';
   
   // 3. 样式
   import styles from './ProductPage.module.css';
   ```

3. **组件规范**
   ```typescript
   // 1. 类型定义
   interface ProductCardProps {
     product: Product;
     onSelect?: (product: Product) => void;
   }
   
   // 2. 组件定义
   export const ProductCard: React.FC<ProductCardProps> = ({
     product,
     onSelect,
   }) => {
     // 3. 状态和副作用
     const [isHovered, setIsHovered] = useState(false);
     
     // 4. 事件处理
     const handleClick = () => {
       onSelect?.(product);
     };
     
     // 5. 渲染
     return (
       <div 
         className={styles.card}
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}
         onClick={handleClick}
       >
         {/* 组件内容 */}
       </div>
     );
   };
   ```

### 项目结构
```
client/
├── src/
│   ├── components/     # 通用组件
│   │   ├── ui/        # 基础UI组件
│   │   ├── layout/    # 布局组件
│   │   └── shared/    # 共享组件
│   ├── pages/         # 页面组件
│   ├── hooks/         # 自定义Hooks
│   ├── utils/         # 工具函数
│   ├── types/         # TypeScript类型定义
│   ├── constants/     # 常量定义
│   ├── styles/        # 全局样式
│   └── lib/           # 第三方库封装
├── public/            # 静态资源
└── tests/             # 测试文件
```

## 配置要点
### Vite配置优化
```typescript
// vite.config.optimized.ts 关键配置
export default defineConfig({
  base: isProduction ? 'https://cdn.zuodii.com' : '',
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,  // 生产环境移除console
      },
    },
    rollupOptions: {
      output: {
        manualChunks: manualChunksStrategy, // 智能代码分割
      },
    },
  },
});
```

### TypeScript配置
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./client/src/*"],
      "@components/*": ["./client/src/components/*"],
      "@pages/*": ["./client/src/pages/*"]
    }
  }
}
```

### Tailwind配置
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './client/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#0ea5e9',
          900: '#0c4a6e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

## 依赖管理
### 核心依赖版本
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@radix-ui/react-accordion": "^1.2.12",
    "lucide-react": "^0.309.0",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.55.0",
    "prettier": "^3.1.0",
    "vitest": "^1.0.0"
  }
}
```

### 依赖更新策略
1. **安全更新**: 立即更新安全补丁
2. **小版本更新**: 每月检查并更新
3. **大版本更新**: 评估影响后更新
4. **破坏性更新**: 制定迁移计划后更新

## 技术债务管理
### 已知技术债务
1. **测试覆盖率不足**: 当前测试覆盖率较低
2. **文档不完善**: 部分组件缺乏文档
3. **性能监控缺失**: 缺乏详细的性能监控
4. **CI/CD不完整**: 自动化部署流程不完善

### 偿还计划
1. **短期（1个月）**:
   - 补充核心组件测试
   - 完善项目文档
   - 建立基础监控

2. **中期（3个月）**:
   - 达到80%测试覆盖率
   - 建立完整文档体系
   - 实现自动化CI/CD

3. **长期（6个月）**:
   - 建立性能基准
   - 实施高级监控
   - 优化构建性能

## 技术演进路线
### 近期计划（2026年Q2）
1. ✅ 完成基础架构搭建
2. ✅ 实现核心页面
3. ✅ 配置CDN和优化
4. 🔲 建立测试体系

### 中期计划（2026年Q3）
1. 🔲 引入状态管理（Zustand）
2. 🔲 实现数据获取（React Query）
3. 🔲 建立组件库文档
4. 🔲 优化构建性能

### 远期计划（2026年Q4）
1. 🔲 引入微前端架构（如有需要）
2. 🔲 实现服务端渲染（SSR）
3. 🔲 建立设计系统
4. 🔲 优化用户体验

## 风险评估和缓解
### 技术风险
1. **依赖过时风险**
   - **风险**: 依赖库过时导致安全漏洞
   - **缓解**: 定期更新依赖，使用依赖扫描工具

2. **性能退化风险**
   - **风险**: 代码增加导致性能下降
   - **缓解**: 定期性能测试，建立性能预算

3. **技术锁定风险**
   - **风险**: 过度依赖特定技术栈
   - **缓解**: 保持架构灵活性，避免过度耦合

### 团队风险
1. **知识孤岛风险**
   - **风险**: 知识集中在少数人
   - **缓解**: 建立知识库，定期技术分享

2. **技能缺口风险**
   - **风险**: 团队缺乏特定技能
   - **缓解**: 制定培训计划，招聘补充

---

**最后更新**: 2026年4月12日  
**文档版本**: v1.0  
**维护者**: 极客 (Geek)  
**状态**: ✅ 已完成