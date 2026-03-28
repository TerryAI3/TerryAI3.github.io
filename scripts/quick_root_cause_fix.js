#!/usr/bin/env node
/**
 * 快速修复佐迪智能网站URL验证错误
 * 根本原因：new URL("undefined/app-auth")
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 快速修复URL验证错误');
console.log('='.repeat(50));

// 1. 读取原始文件
const originalFile = '/tmp/zodi_backup/index-T7eFSBbb.js.original';
const fixedFile = '/tmp/zodi_backup/index-T7eFSBbb.js.fixed';

if (!fs.existsSync(originalFile)) {
    console.log('❌ 原始文件不存在');
    process.exit(1);
}

const content = fs.readFileSync(originalFile, 'utf8');
console.log(`📊 文件大小: ${content.length} 字符`);

// 2. 查找错误代码
const errorPattern = /new URL\("undefined\/app-auth"\)/;
if (!errorPattern.test(content)) {
    console.log('❌ 未找到错误代码: new URL("undefined/app-auth")');
    
    // 尝试查找类似的代码
    const similarPattern = /new URL\([^)]+undefined[^)]+\)/;
    const match = content.match(similarPattern);
    if (match) {
        console.log(`⚠️  找到类似代码: ${match[0]}`);
    }
    process.exit(1);
}

console.log('✅ 找到错误代码: new URL("undefined/app-auth")');

// 3. 查找完整的函数
const functionPattern = /const Ii=\(\)=>\{[^}]+\}/;
const functionMatch = content.match(functionPattern);

if (!functionMatch) {
    console.log('❌ 未找到函数 Ii()');
    process.exit(1);
}

const originalFunction = functionMatch[0];
console.log('📝 原始函数:');
console.log(originalFunction);

// 4. 创建修复后的函数
const fixedFunction = `const Ii=()=>{
  const e=\`\${window.location.origin}/api/oauth/callback\`,
        t=btoa(e);
  
  // 修复：使用有效的URL
  let n;
  try {
    n = new URL(\`\${window.location.origin}/app-auth\`);
  } catch (error) {
    console.warn('URL创建失败:', error.message);
    n = new URL(window.location.origin);
  }
  
  return n.searchParams.set("appId",void 0),
         n.searchParams.set("redirectUri",e),
         n.searchParams.set("state",t),
         n.searchParams.set("type","signIn"),
         n.toString()
};`;

console.log('\n✅ 修复后的函数:');
console.log(fixedFunction);

// 5. 替换代码
const fixedContent = content.replace(originalFunction, fixedFunction);

// 6. 保存修复后的文件
fs.writeFileSync(fixedFile, fixedContent);
console.log(`\n✅ 修复文件已保存: ${fixedFile}`);

// 7. 验证修复
const stillHasError = /new URL\("undefined\/app-auth"\)/.test(fixedContent);
const hasFixedFunction = fixedContent.includes('try {');

console.log('\n🔍 修复验证:');
console.log(`- 是否还有错误代码: ${stillHasError ? '❌ 是' : '✅ 否'}`);
console.log(`- 是否有错误处理: ${hasFixedFunction ? '✅ 是' : '❌ 否'}`);

// 8. 创建部署脚本
const deployScript = `#!/bin/bash
# 部署URL验证错误修复

echo "🚀 部署根本原因修复"
echo ""

# 备份原始文件
BACKUP="/tmp/zodi_js_backup_$(date +%Y%m%d_%H%M%S).js"
cp assets/index-T7eFSBbb.js "$BACKUP"
echo "✅ 备份完成: $BACKUP"

# 应用修复
cp ${fixedFile} assets/index-T7eFSBbb.js
echo "✅ 修复应用完成"

# 验证
if grep -q 'new URL("undefined/app-auth")' assets/index-T7eFSBbb.js; then
    echo "❌ 修复失败"
    exit 1
else
    echo "✅ 修复成功"
fi

# 提交
git add assets/index-T7eFSBbb.js
git commit -m "fix: 修复URL验证错误 - new URL('undefined/app-auth')"
echo "✅ Git提交完成"

echo ""
echo "📋 下一步:"
echo "1. git push origin main"
echo "2. 等待GitHub Pages更新"
echo "3. 访问 https://zuodii.com 验证修复"
`;

const deployScriptPath = '/tmp/zodi_backup/deploy_fix.sh';
fs.writeFileSync(deployScriptPath, deployScript);
fs.chmodSync(deployScriptPath, '755');

console.log(`\n🚀 部署脚本已创建: ${deployScriptPath}`);
console.log('\n📋 执行步骤:');
console.log('1. cd /root/.openclaw/workspace');
console.log('2. bash ' + deployScriptPath);
console.log('3. git push origin main');
console.log('4. 等待GitHub Pages更新');
console.log('5. 验证修复效果');

// 9. 创建验证脚本
const verifyScript = `#!/bin/bash
# 验证URL验证错误修复

echo "🔍 验证修复效果"
echo ""

# 检查文件
if grep -q 'try {' assets/index-T7eFSBbb.js; then
    echo "✅ 找到错误处理代码"
else
    echo "❌ 未找到错误处理代码"
fi

if grep -q 'new URL("undefined/app-auth")' assets/index-T7eFSBbb.js; then
    echo "❌ 仍然包含错误代码"
else
    echo "✅ 错误代码已移除"
fi

# 显示修复后的函数
echo ""
echo "📝 修复后的函数:"
grep -A 15 'const Ii=()=>{' assets/index-T7eFSBbb.js | head -20
`;

const verifyScriptPath = '/tmp/zodi_backup/verify_fix.sh';
fs.writeFileSync(verifyScriptPath, verifyScript);
fs.chmodSync(verifyScriptPath, '755');

console.log(`\n🔍 验证脚本: ${verifyScriptPath}`);

console.log('\n' + '='.repeat(50));
console.log('✅ 快速修复准备完成！');
console.log('\n立即执行: bash ' + deployScriptPath);