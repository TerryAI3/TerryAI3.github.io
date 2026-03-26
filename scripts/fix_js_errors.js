#!/usr/bin/env node
/**
 * 佐迪智能网站JavaScript错误自动修复脚本
 * 自动检测、分析和修复Invalid URL错误
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置
const CONFIG = {
  websiteUrl: 'https://zuodii.com',
  errorFile: 'index-T7eFSBbb.js',
  backupDir: '/tmp/zodi_js_backups',
  fixStrategies: [
    'url_validation',
    'error_handling',
    'resource_paths',
    'cache_headers',
  ],
  maxRetries: 3,
  timeout: 15000,
};

// 创建备份目录
function createBackupDir() {
  if (!fs.existsSync(CONFIG.backupDir)) {
    fs.mkdirSync(CONFIG.backupDir, { recursive: true });
  }
}

// 下载有问题的JavaScript文件
async function downloadProblematicFile() {
  const fileUrl = `${CONFIG.websiteUrl}/assets/${CONFIG.errorFile}`;
  const backupPath = path.join(CONFIG.backupDir, `${CONFIG.errorFile}.${Date.now()}.backup`);
  
  return new Promise((resolve, reject) => {
    console.log(`📥 下载问题文件: ${fileUrl}`);
    
    const req = https.get(fileUrl, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`下载失败，状态码: ${res.statusCode}`));
        return;
      }
      
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const content = Buffer.concat(chunks);
        
        // 保存备份
        fs.writeFileSync(backupPath, content);
        console.log(`✅ 文件已备份到: ${backupPath}`);
        
        resolve({
          content: content.toString('utf8'),
          backupPath,
          size: content.length,
        });
      });
    });
    
    req.on('error', reject);
    req.setTimeout(CONFIG.timeout, () => {
      req.destroy();
      reject(new Error('下载超时'));
    });
  });
}

// 分析JavaScript文件，查找Invalid URL问题
function analyzeJsFile(content) {
  console.log('🔍 分析JavaScript文件...');
  
  const issues = [];
  const lines = content.split('\n');
  
  // 查找可能的URL处理代码
  const urlPatterns = [
    /new\s+URL\(/g,
    /fetch\(/g,
    /\.src\s*=/g,
    /\.href\s*=/g,
    /window\.location/g,
    /\.pushState\(/g,
    /\.replaceState\(/g,
  ];
  
  // 查找try-catch块
  const tryCatchPattern = /try\s*{[\s\S]*?}\s*catch/g;
  
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    
    // 检查URL相关代码
    urlPatterns.forEach((pattern, patternIndex) => {
      const matches = line.match(pattern);
      if (matches) {
        issues.push({
          type: 'url_operation',
          line: lineNumber,
          content: line.trim(),
          pattern: patternIndex,
          severity: 'medium',
        });
      }
    });
    
    // 检查缺少错误处理的URL操作
    if (line.includes('new URL(') && !line.includes('try') && !line.includes('catch')) {
      // 检查前后几行是否有try-catch
      const context = lines.slice(Math.max(0, index - 3), Math.min(lines.length, index + 4));
      const hasTryCatch = context.some(ctxLine => ctxLine.includes('try') || ctxLine.includes('catch'));
      
      if (!hasTryCatch) {
        issues.push({
          type: 'missing_error_handling',
          line: lineNumber,
          content: line.trim(),
          severity: 'high',
          recommendation: '添加try-catch错误处理',
        });
      }
    }
    
    // 检查可能的无效URL字符串
    const urlStringPattern = /['"](https?:\/\/[^'"]*|\.\.?\/[^'"]*)['"]/g;
    const urlMatches = line.match(urlStringPattern);
    
    if (urlMatches) {
      urlMatches.forEach(url => {
        // 检查URL格式
        const cleanUrl = url.slice(1, -1); // 去掉引号
        
        if (cleanUrl.includes('..') || cleanUrl.includes('//') && !cleanUrl.startsWith('http')) {
          issues.push({
            type: 'suspicious_url',
            line: lineNumber,
            url: cleanUrl,
            content: line.trim(),
            severity: 'low',
            recommendation: '检查URL格式是否正确',
          });
        }
      });
    }
  });
  
  // 统计
  console.log(`📊 分析完成，发现 ${issues.length} 个潜在问题`);
  
  return {
    totalLines: lines.length,
    issues,
    issueSummary: {
      high: issues.filter(i => i.severity === 'high').length,
      medium: issues.filter(i => i.severity === 'medium').length,
      low: issues.filter(i => i.severity === 'low').length,
    },
  };
}

// 生成修复建议
function generateFixSuggestions(analysis) {
  const suggestions = [];
  
  // 根据问题类型生成修复建议
  analysis.issues.forEach(issue => {
    switch (issue.type) {
      case 'missing_error_handling':
        suggestions.push({
          type: 'code_fix',
          line: issue.line,
          original: issue.content,
          fix: generateTryCatchFix(issue.content),
          description: '添加URL验证的错误处理',
          priority: 'high',
        });
        break;
        
      case 'suspicious_url':
        suggestions.push({
          type: 'url_fix',
          line: issue.line,
          original: issue.url,
          fix: normalizeUrl(issue.url),
          description: '规范化URL格式',
          priority: 'medium',
        });
        break;
        
      case 'url_operation':
        suggestions.push({
          type: 'validation_wrapper',
          line: issue.line,
          original: issue.content,
          fix: wrapWithValidation(issue.content),
          description: '包装URL操作增加验证',
          priority: 'medium',
        });
        break;
    }
  });
  
  // 添加通用修复建议
  suggestions.push({
    type: 'utility_function',
    line: 'global',
    fix: generateUrlValidationUtility(),
    description: '添加URL验证工具函数',
    priority: 'high',
  });
  
  suggestions.push({
    type: 'global_error_handler',
    line: 'global',
    fix: generateGlobalErrorHandler(),
    description: '添加全局错误处理器',
    priority: 'medium',
  });
  
  return suggestions;
}

// 生成try-catch修复代码
function generateTryCatchFix(originalCode) {
  return `try {
  ${originalCode}
} catch (error) {
  console.error('URL处理错误:', error);
  // 这里可以添加错误恢复逻辑
  return null;
}`;
}

// 规范化URL
function normalizeUrl(url) {
  if (url.startsWith('//')) {
    return `https:${url}`;
  }
  if (url.startsWith('./') || url.startsWith('../')) {
    // 保持相对路径，但确保格式正确
    return url.replace(/\/\//g, '/');
  }
  return url;
}

// 包装URL操作增加验证
function wrapWithValidation(code) {
  if (code.includes('new URL(')) {
    const urlMatch = code.match(/new URL\(([^)]+)\)/);
    if (urlMatch) {
      const urlParam = urlMatch[1];
      return `isValidUrl(${urlParam}) ? new URL(${urlParam}) : null`;
    }
  }
  return code;
}

// 生成URL验证工具函数
function generateUrlValidationUtility() {
  return `
/**
 * URL验证工具函数
 * 修复Invalid URL错误的核心工具
 */

// 验证URL是否有效
function isValidUrl(string) {
  if (!string || typeof string !== 'string') {
    return false;
  }
  
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// 安全的URL创建函数
function safeCreateUrl(url, base) {
  if (!isValidUrl(url)) {
    console.warn('无效的URL:', url);
    
    // 尝试修复常见的URL问题
    const fixedUrl = tryFixUrl(url);
    if (fixedUrl && isValidUrl(fixedUrl)) {
      return new URL(fixedUrl, base);
    }
    
    // 返回安全的默认值或null
    return null;
  }
  
  return new URL(url, base);
}

// 尝试修复常见的URL问题
function tryFixUrl(url) {
  if (!url || typeof url !== 'string') {
    return null;
  }
  
  // 修复双斜杠问题
  if (url.startsWith('//')) {
    return 'https:' + url;
  }
  
  // 修复缺少协议的问题
  if (url.includes('://') && !url.startsWith('http')) {
    const parts = url.split('://');
    if (parts.length === 2) {
      return 'https://' + parts[1];
    }
  }
  
  // 修复相对路径问题
  if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
    // 相对路径，需要结合base URL
    return url;
  }
  
  return null;
}

// 安全的fetch包装器
async function safeFetch(url, options) {
  if (!isValidUrl(url)) {
    console.error('无效的fetch URL:', url);
    throw new Error('Invalid URL');
  }
  
  try {
    const response = await fetch(url, options);
    return response;
  } catch (error) {
    console.error('Fetch失败:', error);
    throw error;
  }
}

// 导出工具函数
if (typeof window !== 'undefined') {
  window.urlUtils = {
    isValidUrl,
    safeCreateUrl,
    safeFetch,
    tryFixUrl,
  };
}
`;
}

// 生成全局错误处理器
function generateGlobalErrorHandler() {
  return `
/**
 * 全局错误处理器
 * 捕获并处理JavaScript错误
 */

// 初始化全局错误监控
function initErrorMonitoring() {
  // 捕获未处理的Promise错误
  window.addEventListener('unhandledrejection', (event) => {
    console.error('未处理的Promise错误:', event.reason);
    reportErrorToServer({
      type: 'unhandled_rejection',
      error: event.reason,
      timestamp: new Date().toISOString(),
    });
  });
  
  // 捕获全局JavaScript错误
  window.addEventListener('error', (event) => {
    console.error('全局JavaScript错误:', event.error);
    
    // 特别处理Invalid URL错误
    if (event.error && event.error.message && event.error.message.includes('Invalid URL')) {
      console.warn('检测到Invalid URL错误，建议检查URL验证逻辑');
      
      // 记录详细的错误信息
      reportErrorToServer({
        type: 'invalid_url_error',
        error: event.error,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      });
    }
    
    // 防止错误传播到控制台
    event.preventDefault();
  });
  
  // 捕获控制台错误
  const originalConsoleError = console.error;
  console.error = function(...args) {
    originalConsoleError.apply(console, args);
    
    // 检查是否有Invalid URL相关错误
    args.forEach(arg => {
      if (typeof arg === 'string' && arg.includes('Invalid URL')) {
        reportErrorToServer({
          type: 'console_invalid_url',
          message: arg,
          stack: new Error().stack,
          timestamp: new Date().toISOString(),
        });
      }
    });
  };
}

// 错误报告函数（需要后端支持）
function reportErrorToServer(errorData) {
  // 这里可以集成到错误监控系统
  // 例如：发送到Sentry、LogRocket或自定义后端
  
  try {
    // 简单的localStorage记录
    const errorLog = JSON.parse(localStorage.getItem('js_errors') || '[]');
    errorLog.push({
      ...errorData,
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
    });
    
    // 只保留最近的100个错误
    if (errorLog.length > 100) {
      errorLog.splice(0, errorLog.length - 100);
    }
    
    localStorage.setItem('js_errors', JSON.stringify(errorLog));
    
    // 可以在这里添加实际的服务器上报逻辑
    // fetch('/api/error-report', { method: 'POST', body: JSON.stringify(errorData) });
    
  } catch (storageError) {
    console.warn('无法保存错误日志:', storageError);
  }
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initErrorMonitoring);
} else {
  initErrorMonitoring();
}
`;
}

// 创建修复补丁文件
function createFixPatch(analysis, suggestions) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const patchFile = path.join(CONFIG.backupDir, `fix_patch_${timestamp}.js`);
  
  const patchContent = {
    metadata: {
      generatedAt: new Date().toISOString(),
      website: CONFIG.websiteUrl,
      errorFile: CONFIG.errorFile,
      analysis: analysis.issueSummary,
    },
    issues: analysis.issues,
    suggestions,
    fixCode: {
      utilityFunctions: generateUrlValidationUtility(),
      errorHandler: generateGlobalErrorHandler(),
    },
    instructions: `
如何应用修复：

1. 紧急修复（立即生效）：
   - 将 utilityFunctions 代码添加到网站的主JavaScript文件中
   - 将 errorHandler 代码添加到页面加载脚本中

2. 具体问题修复：
   ${suggestions.map(s => `   - 第${s.line}行: ${s.description}`).join('\n')}

3. 验证修复：
   - 清除浏览器缓存后测试
   - 监控控制台错误
   - 验证网站功能正常

4. 预防措施：
   - 部署后持续监控错误
   - 定期更新URL验证逻辑
   - 添加自动化测试
`,
  };
  
  fs.writeFileSync(patchFile, JSON.stringify(patchContent, null, 2));
  console.log(`✅ 修复补丁已生成: ${patchFile}`);
  
  return patchFile;
}

// 生成HTML修复注入脚本
function generateHtmlInjectionScript() {
  const injectionScript = `
<!-- 佐迪智能网站JavaScript错误修复脚本 -->
<!-- 生成时间: ${new Date().toISOString()} -->
<script>
(function() {
  'use strict';
  
  // URL验证工具函数
  function isValidUrl(string) {
    if (!string || typeof string !== 'string') return false;
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }
  
  // 修复常见的Invalid URL错误
  function patchUrlValidation() {
    // 重写可能出问题的URL构造函数
    const OriginalURL = window.URL;
    
    window.URL = function(url, base) {
      if (!isValidUrl(url)) {
        console.warn('修复: 无效的URL参数', url);
        
        // 尝试修复
        if (url && typeof url === 'string') {
          if (url.startsWith('//')) {
            url = 'https:' + url;
          } else if (url.startsWith('/')) {
            // 相对路径，需要base
            if (base && isValidUrl(base)) {
              try {
                return new OriginalURL(url, base);
              } catch (e) {
                console.error('修复失败:', e);
              }
            }
          }
        }
        
        // 如果还是无效，返回一个安全的URL对象或抛出更友好的错误
        if (base && isValidUrl(base)) {
          return new OriginalURL(base);
        }
        
        // 最后的手段：返回当前页面的URL
        return new OriginalURL(window.location.href);
      }
      
      return new OriginalURL(url, base);
    };
    
    // 保持原型链
    window.URL.prototype = OriginalURL.prototype;
  }
  
  // 监控并修复fetch调用
  function patchFetch() {
    const originalFetch = window.fetch;
    
    window.fetch = function(resource, init) {
      if (typeof resource === 'string' && !isValidUrl(resource)) {
        console.warn('修复: 无效的fetch URL', resource);
        
        // 尝试修复URL
        if (resource.startsWith('//')) {
          resource = 'https:' + resource;
        } else if (resource.startsWith('/')) {
          resource = window.location.origin + resource;
        }
        
        // 如果修复后仍然无效，返回一个拒绝的Promise
        if (!isValidUrl(resource)) {
          return Promise.reject(new Error('Invalid URL after repair attempt'));
        }
      }
      
      return originalFetch.call(this, resource, init);
    };
  }
  
  // 初始化修复
  function initFixes() {
    try {
      patchUrlValidation();
      patchFetch();
      
      console.log('✅ JavaScript错误修复已应用');
      
      // 监控后续错误
      window.addEventListener('error', function(event) {
        if (event.error && event.error.message && event.error.message.includes('Invalid URL')) {
          console.log('🛠️ 检测到URL错误，修复系统已激活');
        }
      });
      
    } catch (error) {
      console.error('修复初始化失败:', error);
    }
  }
  
  // 页面加载后应用修复
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFixes);
  } else {
    initFixes();
  }
})();
</script>
`;
  
  const injectionFile = path.join(CONFIG.backupDir, 'html_injection_fix.html');
  
  fs.writeFileSync(injectionFile, injectionScript);
  console.log(`✅ HTML注入脚本已生成: ${injectionFile}`);
  
  return injectionFile;
}

// 执行完整的修复流程
async function executeFullFix() {
  console.log('🚀 开始执行JavaScript错误完整修复流程');
  console.log('='.repeat(50));
  
  try {
    // 1. 创建备份目录
    createBackupDir();
    
    // 2. 下载问题文件
    const fileInfo = await downloadProblematicFile();
    
    // 3. 分析文件
    const analysis = analyzeJsFile(fileInfo.content);
    
    // 4. 生成修复建议
    const suggestions = generateFixSuggestions(analysis);
    
    // 5. 创建修复补丁
    const patchFile = createFixPatch(analysis, suggestions);
    
    // 6. 生成HTML注入脚本
    const injectionFile = generateHtmlInjectionScript();
    
    // 7. 生成部署指令
    generateDeploymentInstructions(patchFile, injectionFile, analysis);
    
    console.log('='.repeat(50));
    console.log('✅ 修复流程完成！');
    console.log(`📁 所有文件保存在: ${CONFIG.backupDir}`);
    
    return {
      success: true,
      backupPath: fileInfo.backupPath,
      patchFile,
      injectionFile,
      analysis,
      suggestions,
    };
    
  } catch (error) {
    console.error('❌ 修复流程失败:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

// 生成部署指令
function generateDeploymentInstructions(patchFile, injectionFile, analysis) {
  const instructionsFile = path.join(CONFIG.backupDir, 'deployment_instructions.md');
  
  const instructions = `# 佐迪智能网站JavaScript错误修复部署指南

## 问题概述
- **错误类型**: Invalid URL
- **影响文件**: ${CONFIG.errorFile}
- **检测时间**: ${new Date().toISOString()}
- **问题统计**: 高优先级 ${analysis.issueSummary.high} 个，中优先级 ${analysis.issueSummary.medium} 个

## 生成的修复文件
1. **分析报告**: ${patchFile}
2. **HTML注入脚本**: ${injectionFile}
3. **原始文件备份**: 在备份目录中

## 部署方案

### 方案A：快速修复（推荐）
将以下代码添加到网站的HTML文件中（在</body>标签之前）：

\`\`\`html
<!-- 复制 ${injectionFile} 文件中的内容 -->
<!-- 添加到所有页面的底部 -->
\`\`\`

### 方案B：完整修复
1. 修改 ${CONFIG.errorFile} 文件：
   - 添加URL验证工具函数
   - 包装所有URL操作增加错误处理
   - 添加全局错误监控

2. 具体修改位置：
${analysis.issues.map(issue => `   - 第${issue.line}行: ${issue.type} (${issue.severity}优先级)`).join('\n')}

### 方案C：渐进式修复
1. 立即部署方案A（HTML注入）
2. 同时准备方案B（代码修改）
3. 测试验证后，用方案B替换方案A

## 测试验证步骤
1. **清除缓存测试**:
   \`\`\`bash
   # 测试网站可访问性
   curl -I ${CONFIG.websiteUrl}
   
   # 测试JavaScript文件
   curl -I ${CONFIG.websiteUrl}/assets/${CONFIG.errorFile}
   \`\`\`

2. **功能测试**:
   - 访问网站所有主要页面
   - 测试所有交互功能
   - 检查浏览器控制台错误

3. **监控验证**:
   - 运行错误监控脚本
   - 检查错误日志
   - 验证修复效果

## 回滚方案
如果修复导致问题，立即回滚：
1. 移除HTML注入脚本
2. 恢复原始JavaScript文件
3. 清除CDN和浏览器缓存

## 预防措施
1. **代码审查**: 所有URL相关代码必须经过审查
2. **自动化测试**: 添加URL验证测试用例
3. **错误监控**: 持续运行错误监控系统
4. **定期更新**: 每月检查并更新验证逻辑

## 紧急联系人
- 前端开发团队
- 运维团队
- 技术支持

## 状态更新
- [ ] 修复已部署
- [ ] 测试已完成
- [ ] 监控已确认
- [ ] 用户反馈收集

---
**生成时间**: ${new Date().toISOString()}
**修复系统版本**: 1.0.0
`;

  fs.writeFileSync(instructionsFile, instructions);
  console.log(`✅ 部署指南已生成: ${instructionsFile}`);
}

// 执行测试验证
function runTests() {
  console.log('🧪 运行测试验证...');
  
  const tests = [
    {
      name: '网站可访问性测试',
      command: `curl -s -o /dev/null -w "%{http_code}" ${CONFIG.websiteUrl}`,
      expected: '200',
    },
    {
      name: 'JavaScript文件测试',
      command: `curl -s -o /dev/null -w "%{http_code}" ${CONFIG.websiteUrl}/assets/${CONFIG.errorFile}`,
      expected: '200',
    },
    {
      name: '错误监控测试',
      command: `node ${__dirname}/website_error_monitor.js check`,
      expected: 'success',
    },
  ];
  
  let passed = 0;
  let failed = 0;
  
  tests.forEach(test => {
    try {
      console.log(`  运行: ${test.name}`);
      const result = execSync(test.command, { encoding: 'utf8', timeout: 10000 }).trim();
      
      if (test.expected === 'success' || result === test.expected) {
        console.log(`  ✅ 通过: ${result}`);
        passed++;
      } else {
        console.log(`  ❌ 失败: 期望 ${test.expected}, 实际 ${result}`);
        failed++;
      }
    } catch (error) {
      console.log(`  ❌ 异常: ${error.message}`);
      failed++;
    }
  });
  
  console.log(`📊 测试结果: ${passed} 通过, ${failed} 失败`);
  return { passed, failed };
}

// 主函数
async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'fix':
      const result = await executeFullFix();
      if (result.success) {
        console.log('\n🎯 修复完成！下一步：');
        console.log('1. 查看部署指南进行部署');
        console.log('2. 运行测试验证修复效果');
        console.log('3. 启动监控持续跟踪');
      }
      break;
      
    case 'test':
      runTests();
      break;
      
    case 'analyze':
      try {
        const fileInfo = await downloadProblematicFile();
        const analysis = analyzeJsFile(fileInfo.content);
        console.log(JSON.stringify(analysis, null, 2));
      } catch (error) {
        console.error('分析失败:', error.message);
      }
      break;
      
    case 'monitor':
      // 启动监控
      execSync(`node ${__dirname}/website_error_monitor.js start`, { stdio: 'inherit' });
      break;
      
    default:
      console.log('佐迪智能网站JavaScript错误修复工具');
      console.log('使用方法:');
      console.log('  node fix_js_errors.js fix      # 执行完整修复流程');
      console.log('  node fix_js_errors.js test     # 运行测试验证');
      console.log('  node fix_js_errors.js analyze  # 分析问题文件');
      console.log('  node fix_js_errors.js monitor  # 启动错误监控');
      break;
  }
}

// 执行主函数
if (require.main === module) {
  main().catch(error => {
    console.error('程序执行失败:', error);
    process.exit(1);
  });
}

module.exports = {
  executeFullFix,
  runTests,
  analyzeJsFile,
  generateFixSuggestions,
};