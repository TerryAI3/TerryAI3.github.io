#!/usr/bin/env node
/**
 * 佐迪智能网站JavaScript错误监控脚本
 * 用于检测和报告网站前端错误
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  websiteUrl: 'https://zuodii.com',
  checkInterval: 300000, // 5分钟检查一次
  errorLogFile: '/tmp/zodi_js_errors.log',
  maxErrorsPerDay: 10,
  alertThreshold: 3, // 连续3次错误触发告警
};

// 错误统计
let errorStats = {
  totalErrors: 0,
  todayErrors: 0,
  lastErrorTime: null,
  consecutiveErrors: 0,
  errorTypes: new Map(),
};

// 初始化日志文件
function initLogFile() {
  const logDir = path.dirname(CONFIG.errorLogFile);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  if (!fs.existsSync(CONFIG.errorLogFile)) {
    fs.writeFileSync(CONFIG.errorLogFile, '');
  }
}

// 记录错误日志
function logError(error) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    url: CONFIG.websiteUrl,
    error: {
      type: error.type || 'Unknown',
      message: error.message || 'No message',
      stack: error.stack || 'No stack trace',
    },
    userAgent: 'WebsiteMonitorBot/1.0',
  };
  
  // 写入日志文件
  const logLine = JSON.stringify(logEntry) + '\n';
  fs.appendFileSync(CONFIG.errorLogFile, logLine);
  
  // 更新统计
  errorStats.totalErrors++;
  errorStats.todayErrors++;
  errorStats.lastErrorTime = timestamp;
  errorStats.consecutiveErrors++;
  
  // 更新错误类型统计
  const errorType = error.type || 'Unknown';
  errorStats.errorTypes.set(errorType, (errorStats.errorTypes.get(errorType) || 0) + 1);
  
  console.log(`[${timestamp}] 检测到JavaScript错误: ${error.message}`);
  
  // 检查是否需要告警
  if (errorStats.consecutiveErrors >= CONFIG.alertThreshold) {
    sendAlert(error);
  }
  
  // 重置每日计数（如果过了一天）
  const now = new Date();
  const lastErrorDate = errorStats.lastErrorTime ? new Date(errorStats.lastErrorTime) : null;
  if (lastErrorDate && now.getDate() !== lastErrorDate.getDate()) {
    errorStats.todayErrors = 0;
    errorStats.consecutiveErrors = 0;
  }
}

// 发送告警
function sendAlert(error) {
  const alertMessage = {
    type: 'javascript_error_alert',
    website: CONFIG.websiteUrl,
    errorCount: errorStats.consecutiveErrors,
    lastError: {
      type: error.type,
      message: error.message,
      timestamp: new Date().toISOString(),
    },
    stats: {
      totalErrors: errorStats.totalErrors,
      todayErrors: errorStats.todayErrors,
      errorTypes: Object.fromEntries(errorStats.errorTypes),
    },
    recommendation: '请检查网站JavaScript代码，特别是URL验证相关的逻辑',
  };
  
  console.log('🚨 发送JavaScript错误告警:', JSON.stringify(alertMessage, null, 2));
  
  // 这里可以集成到实际的告警系统，如：
  // 1. 发送邮件
  // 2. 发送Slack/钉钉消息
  // 3. 调用Webhook
  // 4. 记录到监控系统
}

// 模拟浏览器访问并检测JavaScript错误
async function checkForJSErrors() {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      },
      timeout: 10000,
    };
    
    const req = https.get(CONFIG.websiteUrl, options, (res) => {
      let html = '';
      
      res.on('data', (chunk) => {
        html += chunk;
      });
      
      res.on('end', () => {
        // 分析HTML内容，查找可能的JavaScript问题
        analyzeHTMLForIssues(html);
        
        // 检查特定的JavaScript文件
        checkJavaScriptFiles(html);
        
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          htmlLength: html.length,
        });
      });
    });
    
    req.on('error', (err) => {
      console.error('请求失败:', err.message);
      reject(err);
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('请求超时'));
    });
  });
}

// 分析HTML内容查找问题
function analyzeHTMLForIssues(html) {
  // 检查script标签
  const scriptRegex = /<script[^>]*src=["']([^"']+)["'][^>]*>/gi;
  let match;
  const scripts = [];
  
  while ((match = scriptRegex.exec(html)) !== null) {
    scripts.push(match[1]);
  }
  
  // 检查相对路径的script
  const relativeScripts = scripts.filter(src => !src.startsWith('http'));
  
  if (relativeScripts.length > 0) {
    console.log('发现相对路径的script标签:', relativeScripts);
    
    // 检查是否有无效的路径
    relativeScripts.forEach(src => {
      if (src.includes('..') || src.includes('//')) {
        logError({
          type: 'InvalidScriptPath',
          message: `发现可能的无效script路径: ${src}`,
          stack: 'HTML分析',
        });
      }
    });
  }
  
  // 检查img标签的src
  const imgRegex = /<img[^>]*src=["']([^"']+)["'][^>]*>/gi;
  const images = [];
  
  while ((match = imgRegex.exec(html)) !== null) {
    images.push(match[1]);
  }
  
  // 检查可能的无效图片路径
  images.forEach(src => {
    if (src && !src.startsWith('http') && !src.startsWith('/') && !src.startsWith('data:')) {
      logError({
        type: 'InvalidImagePath',
        message: `发现可能的无效图片路径: ${src}`,
        stack: 'HTML分析',
      });
    }
  });
}

// 检查JavaScript文件
function checkJavaScriptFiles(html) {
  // 提取主要的JavaScript文件
  const jsFileRegex = /<script[^>]*src=["']([^"']+\.js(?:\?[^"']*)?)["'][^>]*>/gi;
  let match;
  const jsFiles = [];
  
  while ((match = jsFileRegex.exec(html)) !== null) {
    const src = match[1];
    if (src.includes('index-') && src.includes('.js')) {
      jsFiles.push(src);
    }
  }
  
  // 检查报告的错误文件
  const errorFile = 'index-T7eFSBbb.js';
  if (jsFiles.some(file => file.includes(errorFile))) {
    console.log(`发现报告的错误文件: ${errorFile}`);
    
    logError({
      type: 'ReportedErrorFile',
      message: `网站使用了报告有错误的JavaScript文件: ${errorFile}`,
      stack: '文件检查',
      recommendation: '建议检查该文件的URL验证逻辑，特别是第354658字符位置附近的代码',
    });
  }
}

// 生成错误报告
function generateErrorReport() {
  const report = {
    generatedAt: new Date().toISOString(),
    website: CONFIG.websiteUrl,
    monitoringPeriod: {
      start: errorStats.lastErrorTime || 'N/A',
      end: new Date().toISOString(),
    },
    statistics: {
      totalErrors: errorStats.totalErrors,
      todayErrors: errorStats.todayErrors,
      consecutiveErrors: errorStats.consecutiveErrors,
      errorTypes: Object.fromEntries(errorStats.errorTypes),
    },
    recommendations: [
      '1. 检查JavaScript代码中的URL验证逻辑',
      '2. 确保所有资源路径都是有效的',
      '3. 添加try-catch错误处理',
      '4. 验证API端点配置',
      '5. 更新缓存策略避免旧版本问题',
    ],
    recentErrors: getRecentErrors(10),
  };
  
  return report;
}

// 获取最近的错误
function getRecentErrors(count) {
  try {
    if (!fs.existsSync(CONFIG.errorLogFile)) {
      return [];
    }
    
    const logContent = fs.readFileSync(CONFIG.errorLogFile, 'utf8');
    const lines = logContent.trim().split('\n').filter(line => line);
    const recentLines = lines.slice(-count);
    
    return recentLines.map(line => {
      try {
        return JSON.parse(line);
      } catch {
        return { raw: line };
      }
    });
  } catch (error) {
    console.error('读取错误日志失败:', error.message);
    return [];
  }
}

// 主监控循环
async function startMonitoring() {
  console.log('🚀 启动佐迪智能网站JavaScript错误监控');
  console.log(`📊 监控网站: ${CONFIG.websiteUrl}`);
  console.log(`⏰ 检查间隔: ${CONFIG.checkInterval / 1000}秒`);
  console.log('---');
  
  initLogFile();
  
  // 立即执行一次检查
  await performCheck();
  
  // 设置定时检查
  setInterval(async () => {
    await performCheck();
  }, CONFIG.checkInterval);
  
  // 每小时生成一次报告
  setInterval(() => {
    const report = generateErrorReport();
    console.log('\n📋 每小时错误报告:');
    console.log(JSON.stringify(report, null, 2));
  }, 3600000);
}

// 执行检查
async function performCheck() {
  try {
    console.log(`[${new Date().toISOString()}] 开始检查网站...`);
    
    const result = await checkForJSErrors();
    
    if (result.statusCode === 200) {
      console.log(`✅ 网站访问正常 (状态码: ${result.statusCode})`);
      
      // 如果之前有连续错误，现在恢复了，重置计数器
      if (errorStats.consecutiveErrors > 0) {
        console.log('🔄 网站恢复正常，重置连续错误计数器');
        errorStats.consecutiveErrors = 0;
      }
    } else {
      console.log(`⚠️ 网站返回非200状态码: ${result.statusCode}`);
    }
    
  } catch (error) {
    console.error(`❌ 检查失败: ${error.message}`);
    
    logError({
      type: 'MonitorCheckFailed',
      message: `网站监控检查失败: ${error.message}`,
      stack: error.stack,
    });
  }
}

// 命令行接口
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'start':
      startMonitoring();
      break;
      
    case 'report':
      const report = generateErrorReport();
      console.log(JSON.stringify(report, null, 2));
      break;
      
    case 'check':
      performCheck().then(() => {
        process.exit(0);
      }).catch(error => {
        console.error('检查失败:', error);
        process.exit(1);
      });
      break;
      
    case 'stats':
      console.log('📊 错误统计:');
      console.log(JSON.stringify({
        totalErrors: errorStats.totalErrors,
        todayErrors: errorStats.todayErrors,
        consecutiveErrors: errorStats.consecutiveErrors,
        lastErrorTime: errorStats.lastErrorTime,
        errorTypes: Object.fromEntries(errorStats.errorTypes),
      }, null, 2));
      break;
      
    case 'clear':
      if (fs.existsSync(CONFIG.errorLogFile)) {
        fs.writeFileSync(CONFIG.errorLogFile, '');
        errorStats = {
          totalErrors: 0,
          todayErrors: 0,
          lastErrorTime: null,
          consecutiveErrors: 0,
          errorTypes: new Map(),
        };
        console.log('✅ 已清除错误日志和统计');
      }
      break;
      
    default:
      console.log('佐迪智能网站JavaScript错误监控工具');
      console.log('使用方法:');
      console.log('  node website_error_monitor.js start    # 启动监控');
      console.log('  node website_error_monitor.js check    # 执行一次检查');
      console.log('  node website_error_monitor.js report   # 生成错误报告');
      console.log('  node website_error_monitor.js stats    # 查看统计信息');
      console.log('  node website_error_monitor.js clear    # 清除日志和统计');
      break;
  }
}

module.exports = {
  startMonitoring,
  generateErrorReport,
  getRecentErrors,
  errorStats,
};