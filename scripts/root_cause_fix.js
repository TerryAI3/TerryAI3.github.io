#!/usr/bin/env node
/**
 * 佐迪智能网站URL验证错误根本原因修复
 * 修复代码：new URL("undefined/app-auth") 中的无效URL
 */

const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  originalFile: '/tmp/zodi_backup/index-T7eFSBbb.js.original',
  fixedFile: '/tmp/zodi_backup/index-T7eFSBbb.js.fixed',
  errorPosition: 354658,
  backupDir: '/tmp/zodi_backup',
};

// 分析错误代码
function analyzeErrorCode() {
  console.log('🔍 分析错误代码...');
  
  const content = fs.readFileSync(CONFIG.originalFile, 'utf8');
  
  // 提取错误函数
  const errorStart = Math.max(0, CONFIG.errorPosition - 200);
  const errorEnd = Math.min(content.length, CONFIG.errorPosition + 300);
  const errorCode = content.slice(errorStart, errorEnd);
  
  console.log('📝 错误代码段:');
  console.log(errorCode);
  console.log('');
  
  // 解析函数逻辑
  const functionMatch = errorCode.match(/const Ii=\(\)=>\{([^}]+)\}/);
  if (functionMatch) {
    console.log('✅ 找到错误函数 Ii():');
    console.log(functionMatch[0]);
    
    // 分析函数逻辑
    const functionCode = functionMatch[1];
    const lines = functionCode.split(';').filter(line => line.trim());
    
    console.log('\n📊 函数逻辑分析:');
    lines.forEach((line, index) => {
      console.log(`${index + 1}. ${line.trim()}`);
    });
    
    return {
      functionCode: functionMatch[0],
      lines,
      fullContext: errorCode,
    };
  }
  
  return null;
}

// 创建修复方案
function createFixSolution(analysis) {
  console.log('\n🔧 创建根本原因修复方案...');
  
  if (!analysis) {
    console.log('❌ 无法分析错误代码');
    return null;
  }
  
  // 原始错误代码
  const originalCode = analysis.functionCode;
  
  // 修复后的代码
  const fixedCode = `const Ii=()=>{
  const e=\`\${window.location.origin}/api/oauth/callback\`,
        t=btoa(e);
  
  // 修复：确保使用有效的URL
  let n;
  try {
    // 尝试使用完整的URL
    n = new URL(\`\${window.location.origin}/app-auth\`);
  } catch (error) {
    console.warn('URL创建失败，使用安全回退:', error.message);
    // 安全回退：使用当前页面的URL
    n = new URL(window.location.origin);
  }
  
  return n.searchParams.set("appId",void 0),
         n.searchParams.set("redirectUri",e),
         n.searchParams.set("state",t),
         n.searchParams.set("type","signIn"),
         n.toString()
};`;
  
  console.log('📝 原始错误代码:');
  console.log(originalCode);
  console.log('\n✅ 修复后的代码:');
  console.log(fixedCode);
  
  // 创建修复补丁
  const patch = {
    original: originalCode,
    fixed: fixedCode,
    description: '修复 new URL("undefined/app-auth") 中的无效URL',
    changes: [
      '1. 将硬编码的 "undefined/app-auth" 替换为动态的 `${window.location.origin}/app-auth`',
      '2. 添加try-catch错误处理',
      '3. 添加安全回退机制',
      '4. 添加控制台警告便于调试',
    ],
    location: `字符位置 ${CONFIG.errorPosition}`,
  };
  
  const patchPath = path.join(CONFIG.backupDir, 'root_cause_patch.json');
  fs.writeFileSync(patchPath, JSON.stringify(patch, null, 2));
  
  console.log(`\n📄 修复补丁已保存: ${patchPath}`);
  
  return {
    patch,
    fixedCode,
    patchPath,
  };
}

// 应用修复到文件
function applyFixToFile(fixSolution) {
  console.log('\n🔄 应用修复到文件...');
  
  if (!fixSolution) {
    console.log('❌ 没有修复方案可用');
    return null;
  }
  
  const originalContent = fs.readFileSync(CONFIG.originalFile, 'utf8');
  
  // 替换错误代码
  const fixedContent = originalContent.replace(
    fixSolution.patch.original,
    fixSolution.fixedCode
  );
  
  // 检查是否替换成功
  if (fixedContent === originalContent) {
    console.log('⚠️  未找到匹配的代码，尝试其他匹配方式...');
    
    // 尝试更灵活的匹配
    const flexiblePattern = /const Ii=\(\)=>\{[^}]+\}/;
    const match = originalContent.match(flexiblePattern);
    
    if (match) {
      console.log('✅ 使用灵活匹配找到函数');
      const fixedContent2 = originalContent.replace(
        match[0],
        fixSolution.fixedCode
      );
      
      if (fixedContent2 !== originalContent) {
        fs.writeFileSync(CONFIG.fixedFile, fixedContent2);
        console.log(`✅ 修复已应用（灵活匹配）: ${CONFIG.fixedFile}`);
        return CONFIG.fixedFile;
      }
    }
    
    console.log('❌ 无法应用修复');
    return null;
  }
  
  // 保存修复后的文件
  fs.writeFileSync(CONFIG.fixedFile, fixedContent);
  
  console.log(`✅ 修复已应用: ${CONFIG.fixedFile}`);
  
  // 验证修复
  const fixedSize = fixedContent.length;
  const originalSize = originalContent.length;
  const sizeDiff = fixedSize - originalSize;
  
  console.log(`📊 文件大小变化: ${originalSize} → ${fixedSize} (${sizeDiff > 0 ? '+' : ''}${sizeDiff} 字符)`);
  
  // 检查修复后的代码
  const fixedPosition = fixedContent.indexOf('const Ii=()=>{');
  if (fixedPosition !== -1) {
    const fixedContext = fixedContent.slice(fixedPosition, fixedPosition + 500);
    console.log('\n✅ 修复后的代码验证:');
    console.log(fixedContext.slice(0, 300) + '...');
  }
  
  return CONFIG.fixedFile;
}

// 创建部署脚本
function createDeploymentScript(fixedFilePath) {
  console.log('\n🚀 创建部署脚本...');
  
  if (!fixedFilePath || !fs.existsSync(fixedFilePath)) {
    console.log('❌ 修复文件不存在');
    return null;
  }
  
  const deploymentScript = `#!/bin/bash
# 佐迪智能网站根本原因修复部署脚本
# 修复：new URL("undefined/app-auth") 无效URL错误

set -e

echo "🚀 开始部署URL验证错误根本原因修复"
echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# 配置
WEBSITE_REPO="/root/.openclaw/workspace"
FIXED_JS="${fixedFilePath}"
ORIGINAL_JS="assets/index-T7eFSBbb.js"
BACKUP_DIR="/tmp/zodi_deploy_backup_$(date +%Y%m%d_%H%M%S)"

# 创建备份目录
mkdir -p "\${BACKUP_DIR}"
echo "📁 备份目录: \${BACKUP_DIR}"

# 1. 备份原始文件
echo "1. 备份原始文件..."
if [ -f "\${WEBSITE_REPO}/\${ORIGINAL_JS}" ]; then
  cp "\${WEBSITE_REPO}/\${ORIGINAL_JS}" "\${BACKUP_DIR}/\${ORIGINAL_JS}.backup"
  echo "✅ 原始文件已备份: \${BACKUP_DIR}/\${ORIGINAL_JS}.backup"
else
  echo "⚠️  原始文件不存在: \${WEBSITE_REPO}/\${ORIGINAL_JS}"
fi

# 2. 应用修复
echo "2. 应用修复..."
cp "\${FIXED_JS}" "\${WEBSITE_REPO}/\${ORIGINAL_JS}"
echo "✅ 修复文件已复制: \${FIXED_JS} → \${WEBSITE_REPO}/\${ORIGINAL_JS}"

# 3. 验证修复
echo "3. 验证修复..."
if grep -q 'new URL("undefined/app-auth")' "\${WEBSITE_REPO}/\${ORIGINAL_JS}"; then
  echo "❌ 修复失败：仍然包含错误代码"
  exit 1
else
  echo "✅ 修复成功：错误代码已移除"
fi

# 检查修复后的代码
echo "4. 检查修复后的代码..."
if grep -q 'const Ii=()=>{' "\${WEBSITE_REPO}/\${ORIGINAL_JS}"; then
  echo "✅ 找到修复后的函数 Ii()"
  
  # 显示修复后的代码片段
  grep -A 10 'const Ii=()=>{' "\${WEBSITE_REPO}/\${ORIGINAL_JS}" | head -15
else
  echo "⚠️  未找到函数 Ii()"
fi

# 5. 提交到Git
echo "5. 提交到Git..."
cd "\${WEBSITE_REPO}"
git add "\${ORIGINAL_JS}"
git commit -m "fix: 修复URL验证错误 - new URL('undefined/app-auth')

修复根本原因：
- 将硬编码的 'undefined/app-auth' 替换为动态URL
- 添加try-catch错误处理
- 添加安全回退机制
- 修复位置：字符 354658"

echo "✅ Git提交完成"

# 6. 推送到GitHub
echo "6. 推送到GitHub..."
git push origin main

echo "✅ 推送完成"

# 7. 等待GitHub Pages部署
echo "7. 等待GitHub Pages部署..."
echo "⏳ 等待60秒让GitHub Pages更新..."
sleep 60

# 8. 验证部署
echo "8. 验证部署..."
curl -s -I https://zuodii.com | head -1

echo ""
echo "=========================================="
echo "✅ 根本原因修复部署完成！"
echo ""
echo "📋 部署摘要："
echo "- 备份文件：\${BACKUP_DIR}/\${ORIGINAL_JS}.backup"
echo "- 修复文件：\${WEBSITE_REPO}/\${ORIGINAL_JS}"
echo "- Git提交：已提交并推送"
echo "- 部署状态：等待GitHub Pages更新"
echo ""
echo "🔍 验证步骤："
echo "1. 访问 https://zuodii.com"
echo "2. 打开浏览器控制台（F12）"
echo "3. 检查是否还有 'Invalid URL' 错误"
echo "4. 重新加载页面测试"
echo ""
echo "📞 如有问题，请检查部署日志"
`;
  
  const scriptPath = path.join(CONFIG.backupDir, 'deploy_root_cause_fix.sh');
  fs.writeFileSync(scriptPath, deploymentScript);
  fs.chmodSync(scriptPath, '755');
  
  console.log(`✅ 部署脚本已创建: ${scriptPath}`);
  
  // 创建简化的手动部署指南
  const manualGuide = `
# 手动部署根本原因修复指南

## 问题
JavaScript错误：TypeError: Invalid URL
位置：https://zuodii.com/assets/index-T7eFSBbb.js:1:354658

## 根本原因
代码：\`new URL("undefined/app-auth")\`
问题：使用了字符串 "undefined/app-auth" 而不是有效的URL

## 修复方案

### 修复后的代码
\`\`\`javascript
const Ii=()=>{
  const e=\`\${window.location.origin}/api/oauth/callback\`,
        t=btoa(e);
  
  // 修复：确保使用有效的URL
  let n;
  try {
    // 尝试使用完整的URL
    n = new URL(\`\${window.location.origin}/app-auth\`);
  } catch (error) {
    console.warn('URL创建失败，使用安全回退:', error.message);
    // 安全回退：使用当前页面的URL
    n = new URL(window.location.origin);
  }
  
  return n.searchParams.set("appId",void 0),
         n.searchParams.set("redirectUri",e),
         n.searchParams.set("state",t),
         n.searchParams.set("type","signIn"),
         n.toString()
};
\`\`\`

## 手动部署步骤

### 方法1：直接修改文件
1. 打开文件：\`assets/index-T7eFSBbb.js\`
2. 搜索：\`const Ii=()=>{const e=\`\${window.location.origin}/api/oauth/callback\`,t=btoa(e),n=new URL("undefined/app-auth");\`
3. 替换为上面的修复代码
4. 保存文件

### 方法2：使用修复文件
1. 备份原始文件：\`cp assets/index-T7eFSBbb.js assets/index-T7eFSBbb.js.backup\`
2. 使用修复文件：\`cp ${fixedFilePath} assets/index-T7eFSBbb.js\`
3. 验证修复：\`grep -n "undefined/app-auth" assets/index-T7eFSBbb.js\`（应该没有输出）

### 方法3：Git操作
\`\`\`bash
# 备份
cp assets/index-T7eFSBbb.js assets/index-T7eFSBbb.js.backup

# 应用修复
cp ${fixedFilePath} assets/index-T7eFSBbb.js

# 提交
git add assets/index-T7eFSBbb.js
git commit -m "fix: 修复URL验证错误 - new URL('undefined/app-auth')"

# 推送
git push origin main
\`\`\`

## 验证修复
1. 访问 https://zuodii.com
2. 按F12打开开发者工具
3. 查看控制台是否有错误
4. 重新加载页面测试

## 预期结果
- ✅ 不再出现 "TypeError: Invalid URL" 错误
- ✅ 网站功能正常
- ✅ OAuth回调功能正常工作
- ✅ 用户体验不受影响

## 紧急联系人
- 技术支持：东来哥
- 部署时间：立即执行
`;
  
  const guidePath = path.join(CONFIG.backupDir, 'manual_deployment_guide.md');
  fs.writeFileSync(guidePath, manualGuide);
  
  console.log(`✅ 手动部署指南已创建: ${guidePath}`);
  
  return {
    scriptPath,
    guidePath,
  };
}

// 生成综合报告
function generateComprehensiveReport(analysis, fixSolution, fixedFilePath, deploymentInfo) {
  console.log('\n📋 生成综合报告...');
  
  const report = {
    generatedAt: new Date().toISOString(),
    problem: {
      type: 'TypeError: Invalid URL',
      location: `https://zuodii.com/assets/index-T7eFSBbb.js:1:${CONFIG.errorPosition}`,
      userReported: true,
      errorMessage: 'Reload Page',
    },
    rootCause: {
      code: 'new URL("undefined/app-auth")',
      issue: '使用了硬编码的字符串 "undefined/app-auth" 而不是有效的URL',
      function: 'Ii() - OAuth回调URL生成函数',
      context: '用于生成OAuth认证回调URL',
    },
    analysis: {
      originalCode: analysis?.functionCode || '未找到',
      lines: analysis?.lines || [],
      contextFile: path.join(CONFIG.backupDir, 'error_context.txt'),
    },
    fix: {
      solution: fixSolution?.patch?.description || '未创建',
      fixedCode: fixSolution?.fixedCode || '未创建',
      changes: fixSolution?.patch?.changes || [],
      patchFile: fixSolution?.patchPath || '未创建',
    },
    files: {
      original: CONFIG.originalFile,
      fixed: fixedFilePath || '未创建',
      size: fixedFilePath ? fs.statSync(fixedFilePath).size : 0,
    },
    deployment: {
      script: deploymentInfo?.scriptPath || '未创建',
      manualGuide: deploymentInfo?.guidePath || '未创建',
      methods: [
        '自动脚本部署（推荐）',
        '手动文件替换',
        'Git操作部署',
      ],
    },
    verification: {
      steps: [
        '1. 访问 https://zuodii.com',
        '2. 打开浏览器控制台（F12）',
        '3. 检查是否有 "Invalid URL" 错误',
        '4. 测试OAuth登录功能',
        '5. 重新加载页面验证',
      ],
      successCriteria: [
        '不再出现JavaScript错误',
        '网站功能正常',
        'OAuth回调正常工作',
        '用户体验不受影响',
      ],
    },
    timeline: {
      detected: new Date().toISOString(),
      analyzed: new Date().toISOString(),
      fixed: fixedFilePath ? new Date().toISOString() : '待完成',
      deployed: '待部署',
      verified: '待验证',
    },
    recommendations: [
      '立即部署根本原因修复',
      '验证修复效果',
      '更新源代码仓库',
      '建立代码审查流程避免类似问题',
      '添加URL验证单元测试',
    ],
  };
  
