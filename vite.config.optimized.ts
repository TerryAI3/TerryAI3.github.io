import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// CDN配置 - 生产环境使用CDN，开发环境使用本地
const isProduction = process.env.NODE_ENV === 'production';
const cdnBaseUrl = isProduction ? 'https://cdn.terryai3.com' : '';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // CDN基础路径配置
  base: cdnBaseUrl,
  
  // 构建优化配置
  build: {
    // 提高chunk大小警告阈值
    chunkSizeWarningLimit: 1000,
    
    // 不报告压缩大小（减少构建输出噪音）
    reportCompressedSize: false,
    
    // 生产环境关闭sourcemap以减小构建产物
    sourcemap: false,
    
    // 使用terser进行更激进的压缩
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,      // 生产环境移除console.log
        drop_debugger: true,     // 移除debugger
        pure_funcs: ['console.info', 'console.debug', 'console.warn'], // 移除特定console函数
      },
      format: {
        comments: false,         // 移除所有注释
      },
    },
    
    // Rollup配置优化
    rollupOptions: {
      output: {
        // 自定义代码分割策略 - 根据实际依赖动态生成
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // 将React相关库打包到一起
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            // Radix UI组件库
            if (id.includes('@radix-ui')) {
              return 'vendor-radix';
            }
            // 工具库
            if (id.includes('date-fns') || id.includes('zod') || id.includes('clsx') || id.includes('tailwind-merge')) {
              return 'vendor-utils';
            }
            // 其他较大的库
            if (id.includes('lucide-react') || id.includes('axios') || id.includes('@tanstack')) {
              return 'vendor-other';
            }
            // 默认vendor包
            return 'vendor';
          }
        },
        
        // 文件命名策略，支持长期缓存和CDN
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    
    // 启用CSS代码分割
    cssCodeSplit: true,
    
    // 构建目标（现代浏览器）
    target: 'es2020',
    
    // 启用rollup的tree shaking
    treeshake: true,
  },
  
  // 开发服务器优化
  server: {
    port: 3000,
    host: true,
    // 启用HMR热重载
    hmr: {
      overlay: true,
    },
  },
  
  // 解析配置
  resolve: {
    alias: {
      '@': resolve(__dirname, './client/src'),
      '@components': resolve(__dirname, './client/src/components'),
      '@pages': resolve(__dirname, './client/src/pages'),
      '@utils': resolve(__dirname, './client/src/utils'),
    },
  },
  
  // 预构建优化
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['@builder.io/vite-plugin-jsx-loc'], // 排除有问题的插件
  },
});