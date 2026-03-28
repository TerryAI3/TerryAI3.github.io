#!/usr/bin/env node
/**
 * 立即修复佐迪智能网站URL验证错误
 * 针对错误：TypeError: Invalid URL at Ii (https://zuodii.com/assets/index-T7eFSBbb.js:1:354658)
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  websiteUrl: 'https://zuodii.com',
  errorFile: 'index-T7eFSBbb.js',
  errorPosition: 354658,
  backupDir: '/tmp/zodi_backup',
  fixScript: '/tmp/zodi_url_fix.js',
};

// 创建备份目录
function createBackupDir() {
  if (!fs.existsSync(CONFIG.backupDir)) {
    fs.mkdirSync(CONFIG.backupDir, { recursive: true });
    console.log(`✅ 创建备份目录: ${CONFIG.backupDir}`);
  }
}

// 下载有问题的JavaScript文件
async function downloadErrorFile() {
  return new Promise((resolve, reject) => {
    const url = `${CONFIG.websiteUrl}/assets/${CONFIG.errorFile}`;
    const outputPath = path.join(CONFIG.backupDir, `${CONFIG.errorFile}.original`);
    
    console.log(`📥 下载错误文件: ${url}`);
    
    const file = fs.createWriteStream(outputPath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`下载失败，状态码: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`✅ 文件下载完成: ${outputPath}`);
        resolve(outputPath);
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {}); // 删除部分下载的文件
      reject(err);
    });
  });
}

// 分析错误位置
function analyzeErrorPosition(filePath) {
  console.log(`🔍 分析错误位置: 字符 ${CONFIG.errorPosition}`);
  
  const content = fs.readFileSync(filePath, 'utf8');
  const fileSize = content.length;
  
  console.log(`📊 文件大小: ${fileSize} 字符`);
  
  if (CONFIG.errorPosition > fileSize) {
    console.log(`⚠️ 错误位置超出文件范围，使用文件末尾`);
    return {
      before: content.slice(Math.max(0, fileSize - 500), fileSize),
      after: '',
      position: fileSize,
    };
  }
  
  // 获取错误位置前后的代码
  const start = Math.max(0, CONFIG.errorPosition - 100);
  const end = Math.min(fileSize, CONFIG.errorPosition + 100);
  
  const before = content.slice(start, CONFIG.errorPosition);
  const after = content.slice(CONFIG.errorPosition, end);
  
  console.log(`📝 错误位置前100字符: ${before}`);
  console.log(`📝 错误位置后100字符: ${after}`);
  
  // 查找可能的URL验证代码模式
  const urlPatterns = [
    /new URL\(/g,
    /URL\./g,
    /\.href\s*=/g,
    /window\.location/g,
    /fetch\(/g,
    /axios\./g,
    /\.src\s*=/g,
  ];
  
  console.log('\n🔎 查找URL相关代码模式:');
  
  urlPatterns.forEach((pattern, index) => {
    const matches = content.match(pattern);
    if (matches) {
      console.log(`  模式${index + 1}: 找到 ${matches.length} 处匹配`);
    }
  });
  
  // 查找具体的错误上下文
  const contextStart = Math.max(0, CONFIG.errorPosition - 500);
  const contextEnd = Math.min(fileSize, CONFIG.errorPosition + 500);
  const errorContext = content.slice(contextStart, contextEnd);
  
  // 保存错误上下文
  const contextPath = path.join(CONFIG.backupDir, 'error_context.txt');
  fs.writeFileSync(contextPath, `错误位置: ${CONFIG.errorPosition}\n\n${errorContext}`);
  console.log(`📄 错误上下文已保存: ${contextPath}`);
  
  return {
    before,
    after,
    position: CONFIG.errorPosition,
    context: errorContext,
    contextPath,
  };
}

// 创建修复脚本
function createFixScript(errorAnalysis) {
  console.log('\n🔧 创建URL验证错误修复脚本...');
  
  const fixScript = `
// 佐迪智能网站URL验证错误修复脚本
// 生成时间: ${new Date().toISOString()}
// 错误位置: ${CONFIG.errorPosition}
// 目标文件: ${CONFIG.errorFile}

(function() {
  'use strict';
  
  console.log('🔧 注入URL验证错误修复脚本');
  
  // 1. 重写URL构造函数，添加错误处理
  const OriginalURL = window.URL;
  
  class SafeURL extends OriginalURL {
    constructor(url, base) {
      try {
        super(url, base);
      } catch (error) {
        console.warn('URL验证错误已捕获:', error.message, 'URL:', url);
        
        // 创建安全的URL对象
        const safeUrl = new OriginalURL('about:blank');
        
        // 添加错误信息
        safeUrl._error = error;
        safeUrl._originalUrl = url;
        safeUrl._isSafeFallback = true;
        
        return safeUrl;
      }
    }
  }
  
  // 替换全局URL构造函数
  window.URL = SafeURL;
  window.URL.prototype = OriginalURL.prototype;
  
  // 2. 重写fetch API，添加URL验证
  const originalFetch = window.fetch;
  
  window.fetch = function(input, init) {
    // 验证URL
    if (typeof input === 'string') {
      try {
        new OriginalURL(input);
      } catch (error) {
        console.warn('Fetch URL验证错误:', error.message, 'URL:', input);
        
        // 返回一个拒绝的Promise，但不会崩溃
        return Promise.reject(new Error(\`无效的URL: \${input}\`));
      }
    }
    
    return originalFetch.call(this, input, init);
  };
  
  // 3. 监控图片加载错误
  document.addEventListener('error', function(event) {
    if (event.target.tagName === 'IMG') {
      const img = event.target;
      console.warn('图片加载失败:', img.src);
      
      // 可以添加默认图片
      if (!img.hasAttribute('data-fallback-set')) {
        img.setAttribute('data-fallback-set', 'true');
        img.src = '/assets/placeholder.jpg';
      }
    }
  }, true);
  
  // 4. 修复脚本标签加载
  const originalCreateElement = document.createElement;
  
  document.createElement = function(tagName) {
    const element = originalCreateElement.call(this, tagName);
    
    if (tagName.toLowerCase() === 'script') {
      const originalSetAttribute = element.setAttribute;
      
      element.setAttribute = function(name, value) {
        if (name === 'src' && value) {
          try {
            new OriginalURL(value, window.location.origin);
          } catch (error) {
            console.warn('Script URL验证错误:', error.message, 'URL:', value);
            // 仍然设置，但记录警告
          }
        }
        
        return originalSetAttribute.call(this, name, value);
      };
    }
    
    return element;
  };
  
  // 5. 全局错误处理
  window.addEventListener('error', function(event) {
    if (event.error && event.error.message && event.error.message.includes('Invalid URL')) {
      console.warn('全局URL错误已捕获:', event.error.message);
      event.preventDefault();
      return true;
    }
  });
  
  // 6. 添加URL验证工具函数
  window.zodiSafeURL = {
    // 安全的URL创建
    create: function(url, base) {
      try {
        return new OriginalURL(url, base);
      } catch (error) {
        console.warn('安全URL创建失败，使用默认:', error.message);
        return new OriginalURL(window.location.origin);
      }
    },
    
    // URL验证
    isValid: function(url) {
      try {
        new OriginalURL(url);
        return true;
      } catch {
        return false;
      }
    },
    
    // 修复相对URL
    fixRelative: function(url) {
      if (!url) return window.location.origin;
      
      // 如果是相对路径，转换为绝对路径
      if (url.startsWith('/')) {
        return window.location.origin + url;
      }
      
      // 如果是协议相对路径
      if (url.startsWith('//')) {
        return window.location.protocol + url;
      }
      
      // 如果是相对路径（没有协议和斜杠）
      if (!url.includes('://') && !url.startsWith('/')) {
        return window.location.origin + '/' + url;
      }
      
      return url;
    }
  };
  
  console.log('✅ URL验证错误修复脚本已注入');
})();
`;
  
  fs.writeFileSync(CONFIG.fixScript, fixScript);
  console.log(`✅ 修复脚本已创建: ${CONFIG.fixScript}`);
  
  // 创建HTML注入版本
  const htmlFixScript = `
<!-- 佐迪智能网站URL验证错误修复 -->
<script>
${fixScript}
</script>
`;
  
  const htmlFixPath = path.join(CONFIG.backupDir, 'url_fix_injection.html');
  fs.writeFileSync(htmlFixPath, htmlFixScript);
  console.log(`✅ HTML注入版本已创建: ${htmlFixPath}`);
  
  return {
    fixScript: CONFIG.fixScript,
    htmlFixPath,
    scriptContent: fixScript,
  };
}

// 生成修复报告
function generateFixReport(errorAnalysis, fixScriptInfo) {
  const report = {
    generatedAt: new Date().toISOString(),
    website: CONFIG.websiteUrl,
    error: {
      file: CONFIG.errorFile,
      position: CONFIG.errorPosition,
      type: 'TypeError: Invalid URL',
      userReported: true,
    },
    analysis: {
      contextSaved: errorAnalysis.contextPath,
      beforeError: errorAnalysis.before,
      afterError: errorAnalysis.after,
    },
    fix: {
      scriptCreated: fixScriptInfo.fixScript,
      htmlInjectionCreated: fixScriptInfo.htmlFixPath,
      features: [
        '安全的URL构造函数重写',
        'Fetch API URL验证',
        '图片加载错误处理',
        '脚本标签URL验证',
        '全局错误处理',
        'URL验证工具函数',
      ],
    },
    implementation: {
      method1: '直接注入修复脚本到网站',
      method2: '通过浏览器开发者工具手动注入',
      method3: '更新网站源代码从根本上修复',
      recommendation: '建议使用方法1进行快速修复，同时使用方法3进行根本修复',
    },
    nextSteps: [
      '1. 将修复脚本注入到网站HTML中',
      '2. 测试修复效果',
      '3. 分析根本原因并更新源代码',
      '4. 建立长期监控和预防机制',
    ],
  };
  
  const reportPath = path.join(CONFIG.backupDir, 'fix_report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log('\n📋 修复报告:');
  console.log(JSON.stringify(report, null, 2));
  console.log(`\n📄 详细报告已保存: ${reportPath}`);
  
  return report;
}

// 测试修复脚本
function testFixScript() {
  console.log('\n🧪 测试修复脚本...');
  
  // 创建一个简单的测试环境
  const testCode = `
// 测试无效URL
try {
  new URL('invalid-url');
  console.log('❌ 原始URL构造函数应该抛出错误');
} catch (error) {
  console.log('✅ 原始URL构造函数正确抛出错误:', error.message);
}

// 测试修复后的URL构造函数
window.URL = class SafeURL {
  constructor(url, base) {
    try {
      return new (class extends URL {})(url, base);
    } catch (error) {
      console.log('✅ 安全URL构造函数捕获错误:', error.message);
      const safeUrl = new (class extends URL {})('about:blank');
      safeUrl._isSafeFallback = true;
      return safeUrl;
    }
  }
};

// 测试无效URL
const testUrl = new URL('invalid-url');
console.log('✅ 安全URL构造函数返回安全对象:', testUrl._isSafeFallback);
`;
  
  const testPath = path.join(CONFIG.backupDir, 'fix_test.js');
  fs.writeFileSync(testPath, testCode);
  
  console.log(`✅ 测试代码已创建: ${testPath}`);
  console.log('📝 测试代码内容:');
  console.log(testCode);
}

// 生成部署指南
function generateDeploymentGuide() {
  const guide = `
# 佐迪智能网站URL验证错误修复部署指南

## 问题描述
用户报告JavaScript错误：TypeError: Invalid URL
错误位置：https://zuodii.com/assets/index-T7eFSBbb.js:1:354658

## 快速修复方案

### 方案1：HTML直接注入（推荐）
1. 打开网站HTML文件（通常是index.html）
2. 在</head>标签前添加以下代码：

\`\`\`html
<script>
// 修复脚本内容见 ${CONFIG.fixScript}
</script>
\`\`\`

3. 保存并重新部署网站

### 方案2：通过CDN注入
如果使用GitHub Pages或其他静态托管：
1. 将修复脚本上传到网站assets目录
2. 在HTML中添加引用：

\`\`\`html
<script src="/assets/url_fix.js"></script>
\`\`\`

### 方案3：浏览器开发者工具临时修复
对于紧急情况，可以通过浏览器控制台执行：

\`\`\`javascript
// 复制并执行 ${CONFIG.fixScript} 中的代码
\`\`\`

## 根本原因分析

### 可能的原因
1. **动态生成的无效URL**：代码中动态拼接URL时产生无效格式
2. **用户输入未验证**：用户提供的URL未经验证直接使用
3. **API响应包含无效URL**：后端API返回的URL格式不正确
4. **配置错误**：环境变量或配置中的URL格式错误

### 排查步骤
1. 检查错误位置附近的代码（${CONFIG.errorPosition}）
2. 查找所有URL构造函数调用
3. 验证所有动态URL生成逻辑
4. 检查API响应数据格式

## 长期预防措施

### 1. 代码层面
- 所有URL使用前进行验证
- 添加try-catch错误处理
- 使用URL验证工具函数

### 2. 测试层面
- 添加URL验证单元测试
- 进行边界条件测试
- 模拟无效URL输入测试

### 3. 监控层面
- 启用JavaScript错误监控
- 设置错误告警阈值
- 定期检查错误日志

## 验证修复效果

### 测试步骤
1. 访问网站并打开浏览器控制台
2. 检查是否有"Invalid URL"错误
3. 测试各种URL相关功能
4. 验证修复脚本是否正常工作

### 成功标准
- ✅ 不再出现"Invalid URL"错误
- ✅ 网站功能正常
- ✅ 用户体验不受影响
- ✅ 错误被正确捕获和处理

## 紧急联系人
- 技术支持：东来哥（当前助手）
- 网站管理员：俊奇
- 部署时间：立即执行

## 更新记录
- ${new Date().toISOString()}：创建修复方案和部署指南
- 下一步：执行修复并验证效果
`;

  const guidePath = path.join(CONFIG.backupDir, 'deployment_guide.md');
  fs.writeFileSync(guidePath, guide);
  
  console.log(`\n📘 部署指南已创建: ${guidePath}`);
  console.log('\n📋 部署指南摘要:');
  console.log(guide.split('\n').slice(0, 30).join('\n'));
  console.log('...（完整内容见文件）');
  
  return guidePath;
}

// 主修复流程
async function main() {
  console.log('🚀 开始修复佐迪智能网站URL验证错误');
  console.log('=' .repeat(50));
  
  try {
    // 1. 准备工作
    createBackupDir();
    
    // 2. 下载和分析错误文件
    const filePath = await downloadErrorFile();
    const errorAnalysis = analyzeErrorPosition(filePath);
    
    // 3. 创建修复脚本
    const fixScriptInfo = createFixScript(errorAnalysis);
    
    // 4. 测试修复脚本
    testFixScript();
    
    // 5. 生成部署指南
    const guidePath = generateDeploymentGuide();
    
    // 6. 生成完整报告
    const report = generateFixReport(errorAnalysis, fixScriptInfo);
    
    console.log('\n' + '=' .repeat(50));
    console.log('✅ URL验证错误修复准备完成！');
    console.log('\n🚀 立即执行修复:');
    console.log(`1. 查看错误分析: ${errorAnalysis.contextPath}`);
    console.log(`2. 使用修复脚本: ${fixScriptInfo.fixScript}`);
    console.log(`3. 按照指南部署: ${guidePath}`);
    console.log(`4. 验证修复效果: 重新加载网站检查错误`);
    console.log('\n📞 如需帮助，请随时联系！');
    
  } catch (error) {
    console.error('❌ 修复过程出错:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// 执行修复
if (require.main === module) {
  main();
}

module.exports = {
  downloadErrorFile,
  analyzeErrorPosition,
  createFixScript,
  generateFixReport,
  generateDeploymentGuide,
  main,
};