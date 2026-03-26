#!/usr/bin/env node
/**
 * 佐迪智能网站内容版块优化工具
 * 自动执行网站内容优化方案
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// 配置
const CONFIG = {
  websiteUrl: 'https://zuodii.com',
  workspaceDir: '/root/.openclaw/workspace',
  backupDir: '/tmp/zodi_content_backups',
  optimizationPhases: [
    'analysis',
    'structure',
    'seo',
    'content',
    'performance',
    'monitoring'
  ],
  timeout: 30000,
};

// 日志系统
class OptimizerLogger {
  constructor(logFile) {
    this.logFile = logFile;
    this.ensureLogFile();
  }
  
  ensureLogFile() {
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }
  
  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message}\n`;
    
    console.log(logEntry.trim());
    fs.appendFileSync(this.logFile, logEntry);
  }
  
  error(message) {
    this.log(message, 'ERROR');
  }
  
  success(message) {
    this.log(message, 'SUCCESS');
  }
  
  section(title) {
    this.log(`\n${'='.repeat(50)}`, 'SECTION');
    this.log(` ${title}`, 'SECTION');
    this.log(`${'='.repeat(50)}\n`, 'SECTION');
  }
}

const logger = new OptimizerLogger(path.join(CONFIG.backupDir, 'optimization.log'));

// 创建备份目录
function createBackupDir() {
  if (!fs.existsSync(CONFIG.backupDir)) {
    fs.mkdirSync(CONFIG.backupDir, { recursive: true });
  }
}

// 分析网站当前状态
async function analyzeWebsite() {
  logger.section('网站分析阶段');
  
  const analysis = {
    url: CONFIG.websiteUrl,
    timestamp: new Date().toISOString(),
    status: {},
    structure: {},
    performance: {},
    seo: {},
    content: {},
  };
  
  // 1. 检查网站状态
  logger.log('检查网站状态...');
  try {
    const status = await checkWebsiteStatus();
    analysis.status = status;
    logger.success(`网站状态: ${status.code} ${status.status}`);
  } catch (error) {
    analysis.status = { error: error.message };
    logger.error(`网站状态检查失败: ${error.message}`);
  }
  
  // 2. 分析页面结构
  logger.log('分析页面结构...');
  try {
    const structure = await analyzePageStructure();
    analysis.structure = structure;
    logger.success(`页面结构分析完成: ${structure.elements} 个元素`);
  } catch (error) {
    analysis.structure = { error: error.message };
    logger.error(`页面结构分析失败: ${error.message}`);
  }
  
  // 3. 分析SEO基础
  logger.log('分析SEO基础...');
  try {
    const seo = await analyzeSEO();
    analysis.seo = seo;
    logger.success(`SEO分析完成: ${seo.metaTags} 个meta标签`);
  } catch (error) {
    analysis.seo = { error: error.message };
    logger.error(`SEO分析失败: ${error.message}`);
  }
  
  // 4. 分析内容质量
  logger.log('分析内容质量...');
  try {
    const content = await analyzeContent();
    analysis.content = content;
    logger.success(`内容分析完成: ${content.wordCount} 字`);
  } catch (error) {
    analysis.content = { error: error.message };
    logger.error(`内容分析失败: ${error.message}`);
  }
  
  // 保存分析报告
  const reportFile = path.join(CONFIG.backupDir, 'website_analysis.json');
  fs.writeFileSync(reportFile, JSON.stringify(analysis, null, 2));
  logger.success(`分析报告已保存: ${reportFile}`);
  
  return analysis;
}

// 检查网站状态
function checkWebsiteStatus() {
  return new Promise((resolve, reject) => {
    const req = https.get(CONFIG.websiteUrl, (res) => {
      resolve({
        code: res.statusCode,
        status: res.statusMessage,
        headers: res.headers,
        timestamp: new Date().toISOString(),
      });
    });
    
    req.on('error', reject);
    req.setTimeout(CONFIG.timeout, () => {
      req.destroy();
      reject(new Error('网站状态检查超时'));
    });
  });
}

// 分析页面结构
async function analyzePageStructure() {
  return new Promise((resolve, reject) => {
    const req = https.get(CONFIG.websiteUrl, (res) => {
      let html = '';
      
      res.on('data', (chunk) => {
        html += chunk;
      });
      
      res.on('end', () => {
        try {
          const analysis = {
            totalSize: html.length,
            elements: {
              headings: countElements(html, /<h[1-6]/gi),
              paragraphs: countElements(html, /<p>/gi),
              links: countElements(html, /<a\s+href=/gi),
              images: countElements(html, /<img/gi),
              scripts: countElements(html, /<script/gi),
              styles: countElements(html, /<style/gi),
            },
            structure: {
              hasHeader: /<header|<nav/gi.test(html),
              hasMain: /<main/gi.test(html),
              hasFooter: /<footer/gi.test(html),
              hasHero: /hero|banner/gi.test(html),
            },
            framework: {
              isReact: /react|React/gi.test(html),
              isVue: /vue|Vue/gi.test(html),
              isAngular: /angular|Angular/gi.test(html),
            },
            technology: {
              hasTailwind: /tailwind/gi.test(html),
              hasBootstrap: /bootstrap/gi.test(html),
              hasJQuery: /jquery/gi.test(html),
            },
          };
          
          resolve(analysis);
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', reject);
    req.setTimeout(CONFIG.timeout, () => {
      req.destroy();
      reject(new Error('页面结构分析超时'));
    });
  });
}

// 统计元素数量
function countElements(html, regex) {
  const matches = html.match(regex);
  return matches ? matches.length : 0;
}

// 分析SEO基础
async function analyzeSEO() {
  return new Promise((resolve, reject) => {
    const req = https.get(CONFIG.websiteUrl, (res) => {
      let html = '';
      
      res.on('data', (chunk) => {
        html += chunk;
      });
      
      res.on('end', () => {
        try {
          const analysis = {
            metaTags: {
              title: extractMetaTag(html, 'title'),
              description: extractMetaTag(html, 'description'),
              keywords: extractMetaTag(html, 'keywords'),
              viewport: extractMetaTag(html, 'viewport'),
              robots: extractMetaTag(html, 'robots'),
            },
            openGraph: {
              ogTitle: extractMetaProperty(html, 'og:title'),
              ogDescription: extractMetaProperty(html, 'og:description'),
              ogImage: extractMetaProperty(html, 'og:image'),
              ogUrl: extractMetaProperty(html, 'og:url'),
            },
            structuredData: {
              hasSchema: /schema\.org|application\/ld\+json/gi.test(html),
              hasJSONLD: /<script[^>]*type="application\/ld\+json"[^>]*>/gi.test(html),
            },
            technicalSEO: {
              hasCanonical: /<link[^>]*rel="canonical"/gi.test(html),
              hasSitemap: /sitemap\.xml/gi.test(html),
              hasRobotsTxt: /robots\.txt/gi.test(html),
              hasH1: /<h1/gi.test(html),
              hasAltText: /alt="[^"]*"/gi.test(html),
            },
          };
          
          resolve(analysis);
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', reject);
    req.setTimeout(CONFIG.timeout, () => {
      req.destroy();
      reject(new Error('SEO分析超时'));
    });
  });
}

// 提取meta标签内容
function extractMetaTag(html, name) {
  const regex = new RegExp(`<meta[^>]*name="${name}"[^>]*content="([^"]*)"`, 'i');
  const match = html.match(regex);
  return match ? match[1] : null;
}

// 提取Open Graph属性
function extractMetaProperty(html, property) {
  const regex = new RegExp(`<meta[^>]*property="${property}"[^>]*content="([^"]*)"`, 'i');
  const match = html.match(regex);
  return match ? match[1] : null;
}

// 分析内容质量
async function analyzeContent() {
  return new Promise((resolve, reject) => {
    const req = https.get(CONFIG.websiteUrl, (res) => {
      let html = '';
      
      res.on('data', (chunk) => {
        html += chunk;
      });
      
      res.on('end', () => {
        try {
          // 提取文本内容
          const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
          
          const analysis = {
            wordCount: countWords(text),
            characterCount: text.length,
            readability: {
              avgWordLength: calculateAverageWordLength(text),
              sentenceCount: countSentences(text),
              paragraphCount: countParagraphs(html),
            },
            contentStructure: {
              hasIntroduction: /介绍|概述|关于/gi.test(text),
              hasProducts: /产品|服务|方案/gi.test(text),
              hasCases: /案例|项目|客户/gi.test(text),
              hasContact: /联系|电话|邮箱/gi.test(text),
            },
            multimedia: {
              imageCount: countElements(html, /<img/gi),
              videoCount: countElements(html, /<video/gi),
              hasSlideshow: /slider|carousel|轮播/gi.test(html),
            },
          };
          
          resolve(analysis);
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', reject);
    req.setTimeout(CONFIG.timeout, () => {
      req.destroy();
      reject(new Error('内容分析超时'));
    });
  });
}

// 统计单词数
function countWords(text) {
  return text.split(/\s+/).filter(word => word.length > 0).length;
}

// 计算平均单词长度
function calculateAverageWordLength(text) {
  const words = text.split(/\s+/).filter(word => word.length > 0);
  if (words.length === 0) return 0;
  
  const totalLength = words.reduce((sum, word) => sum + word.length, 0);
  return (totalLength / words.length).toFixed(2);
}

// 统计句子数
function countSentences(text) {
  return text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
}

// 统计段落数
function countParagraphs(html) {
  return countElements(html, /<p>/gi);
}

// 生成优化建议
function generateOptimizationSuggestions(analysis) {
  logger.section('优化建议生成');
  
  const suggestions = {
    structure: [],
    seo: [],
    content: [],
    performance: [],
    technical: [],
  };
  
  // 结构优化建议
  if (!analysis.structure.structure?.hasHeader) {
    suggestions.structure.push('添加清晰的头部导航区域');
  }
  if (!analysis.structure.structure?.hasHero) {
    suggestions.structure.push('添加英雄展示区（Hero Section）');
  }
  if (!analysis.structure.structure?.hasFooter) {
    suggestions.structure.push('添加完整的页脚区域');
  }
  
  // SEO优化建议
  if (!analysis.seo.metaTags?.title) {
    suggestions.seo.push('添加页面标题（Title）');
  }
  if (!analysis.seo.metaTags?.description) {
    suggestions.seo.push('添加页面描述（Description）');
  }
  if (!analysis.seo.technicalSEO?.hasH1) {
    suggestions.seo.push('添加H1标题');
  }
  if (!analysis.seo.structuredData?.hasSchema) {
    suggestions.seo.push('添加结构化数据（Schema.org）');
  }
  
  // 内容优化建议
  if (analysis.content.wordCount < 300) {
    suggestions.content.push('增加页面内容，目标300字以上');
  }
  if (!analysis.content.contentStructure?.hasProducts) {
    suggestions.content.push('添加产品介绍内容');
  }
  if (!analysis.content.contentStructure?.hasCases) {
    suggestions.content.push('添加案例展示内容');
  }
  
  // 性能优化建议
  if (analysis.structure.elements?.scripts > 5) {
    suggestions.performance.push('减少JavaScript文件数量，考虑合并');
  }
  if (analysis.structure.elements?.styles > 3) {
    suggestions.performance.push('减少CSS文件数量，考虑合并');
  }
  
  // 技术优化建议
  if (!analysis.seo.technicalSEO?.hasCanonical) {
    suggestions.technical.push('添加Canonical标签');
  }
  if (!analysis.seo.technicalSEO?.hasAltText) {
    suggestions.technical.push('为所有图片添加alt文本');
  }
  
  // 保存建议
  const suggestionsFile = path.join(CONFIG.backupDir, 'optimization_suggestions.json');
  fs.writeFileSync(suggestionsFile, JSON.stringify(suggestions, null, 2));
  
  logger.success(`生成 ${Object.values(suggestions).flat().length} 条优化建议`);
  logger.success(`建议文件已保存: ${suggestionsFile}`);
  
  return suggestions;
}

// 创建优化实施计划
function createOptimizationPlan(analysis, suggestions) {
  logger.section('创建优化实施计划');
  
  const plan = {
    version: '1.0.0',
    created: new Date().toISOString(),
    website: CONFIG.websiteUrl,
    phases: [
      {
        name: '基础结构优化',
        duration: '1-2周',
        tasks: suggestions.structure.map((task, index) => ({
          id: `structure-${index + 1}`,
          task,
          priority: 'high',
          estimatedTime: '2-4小时',
        })),
      },
      {
        name: 'SEO优化',
        duration: '1周',
        tasks: suggestions.seo.map((task, index) => ({
          id: `seo-${index + 1}`,
          task,
          priority: 'high',
          estimatedTime: '1-3小时',
        })),
      },
      {
        name: '内容优化',
        duration: '2-3周',
        tasks: suggestions.content.map((task, index) => ({
          id: `content-${index + 1}`,
          task,
          priority: 'medium',
          estimatedTime: '2-8小时',
        })),
      },
      {
        name: '性能优化',
        duration: '1周',
        tasks: suggestions.performance.map((task, index) => ({
          id: `performance-${index + 1}`,
          task,
          priority: 'medium',
          estimatedTime: '2-4小时',
        })),
      },
      {
        name: '技术优化',
        duration: '1周',
        tasks: suggestions.technical.map((task, index) => ({
          id: `technical-${index + 1}`,
          task,
          priority: 'low',
          estimatedTime: '1-2小时',
        })),
      },
    ],
    resources: {
      templates: [
        'SEO基础模板',
        '内容结构模板',
        '产品展示模板',
        '案例展示模板',
      ],
      tools: [
        'SEO分析工具',
        '性能测试工具',
        '内容管理系统',
        '监控系统',
      ],
      documentation: [
        '优化方案文档',
        '实施指南',
        '测试计划',
        '维护手册',
      ],
    },
    successMetrics: {
      structure: '页面结构完整度 > 90%',
      seo: '核心关键词排名提升',
      content: '内容质量评分 > 80分',
      performance: '页面加载速度 < 3秒',
      technical: '技术合规性 > 95%',
    },
  };
  
  // 保存计划
  const planFile = path.join(CONFIG.backupDir, 'optimization_plan.json');
  fs.writeFileSync(planFile, JSON.stringify(plan, null, 2));
  
  logger.success(`优化计划已创建: ${planFile}`);
  logger.log(`总计 ${plan.phases.reduce((sum, phase) => sum + phase.tasks.length, 0)} 个任务`);
  
  return plan;
}

// 生成实施模板
function generateImplementationTemplates(plan) {
  logger.section('生成实施模板');
  
  const templatesDir = path.join(CONFIG.backupDir, 'templates');
  if (!fs.existsSync(templatesDir)) {
    fs.mkdirSync(templatesDir, { recursive: true });
  }
  
  // 1. SEO基础模板
  const seoTemplate = `<!-- SEO基础优化模板 -->
<!-- 文件名: seo-base.html -->
<!-- 生成时间: ${new Date().toISOString()} -->

<!-- 页面标题 -->
<title>佐迪智能 - 专业办公家具与学校家具解决方案</title>

<!-- Meta描述 -->
<meta name="description" content="佐迪智能提供高品质办公家具、学校家具及智能家具解决方案。专业定制，优质服务，打造舒适高效的工作学习环境。">

<!-- 关键词 -->
<meta name="keywords" content="办公家具,学校家具,智能家具,家具定制,课桌椅,办公桌椅">

<!-- Viewport -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- Open Graph -->
<meta property="og:title" content="佐迪智能 - 专业办公家具与学校家具解决方案">
<meta property="og:description" content="提供高品质办公家具、学校家具及智能家具解决方案">
<meta property="og:image" content="https://zuodii.com/og-image.jpg">
<meta property="og:url" content="https://zuodii.com">

<!-- Canonical -->
<link rel="canonical" href="https://zuodii.com">

<!-- 结构化数据 -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "佐迪智能",
  "url": "https://zuodii.com",
  "logo": "https://zuodii.com/logo.png",
  "description": "专业办公家具与学校家具解决方案提供商",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "佛山",
    "addressRegion": "广东",
    "addressCountry": "CN"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+86-xxx-xxxx-xxxx",
    "contactType": "customer service"
  }
}
</script>`;

  fs.writeFileSync(path.join(templatesDir, 'seo-base.html'), seoTemplate);
  
  // 2. 页面结构模板
  const structureTemplate = `<!-- 页面结构优化模板 -->
<!-- 文件名: page-structure.html -->
<!-- 生成时间: ${new Date().toISOString()} -->

<!-- 头部导航 -->
<header class="site-header">
  <nav class="main-navigation">
    <!-- Logo -->
    <a href="/" class="logo">佐迪智能</a>
    
    <!-- 主导航 -->
    <ul class="nav-menu">
      <li><a href="/">首页</a></li>
      <li><a href="/products">产品中心</a></li>
      <li><a href="/solutions">解决方案</a></li>
      <li><a href="/cases">案例展示</a></li>
      <li><a href="/about">关于我们</a></li>
      <li><a href="/contact">联系我们</a></li>
    </ul>
    
    <!-- 联系方式 -->
    <div class="contact-info">
      <span>电话: xxx-xxxx-xxxx</span>
    </div>
  </nav>
</header>

<!-- 英雄展示区 -->
<section class="hero-section">
  <div class="hero-content">
    <h1>专业办公家具与学校家具解决方案</h1>
    <p class="hero-description">
      佐迪智能提供高品质、定制化的家具解决方案，<br>
      打造舒适、高效、智能的工作与学习环境。
    </p>
    <div class="hero-actions">
      <a href="/products" class="btn btn-primary">查看产品</a>
      <a href="/contact" class="btn btn-secondary">联系我们</a>
    </div>
  </div>
  <div class="hero-image">
    <!-- 背景图片 -->
  </div>
</section>

<!-- 产品分类区 -->
<section class="product-categories">
  <h2>产品分类</h2>
  <div class="categories-grid">
    <div class="category-card">
      <h3>办公家具</h3>
      <p>专业办公桌椅、会议家具、接待区家具等</p>
      <a href="/products/office">了解更多</a>
    </div>
    <div class="category-card">
      <h3>学校家具</h3>
      <p>课桌椅、实验室家具、图书馆家具等</p>
      <a href="/products/school">了解更多</a>
    </div>
    <div class="category-card">
      <h3>智能家具</h3>
      <p>智能办公系统、智能教室方案等</p>
      <a href="/products/smart">了解更多</a>
    </div>
  </div>
</section>

<!-- 页脚 -->
<footer class="site-footer">
  <div class="footer-content">
    <div class="footer-section">
      <h3>佐迪智能</h3>
      <p>专业办公家具与学校家具解决方案提供商</p>
    </div>
    <div class="footer-section">
      <h3>联系我们</h3>
      <p>电话: xxx-xxxx-xxxx</p>
      <p>邮箱: contact@zuodii.com</p>
      <p>地址: 广东省佛山市</p>
    </div>
    <div class="footer-section">
      <h3>快速链接</h3>
      <ul>
        <li><a href="/">首页</a></li>
        <li><a href="/products">产品中心</a></li>
        <li><a href="/contact">联系我们</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <p>&copy; 2026 佐迪智能. 保留所有权利.</p>
  </div>
</footer>`;

  fs.writeFileSync(path.join(templatesDir, 'page-structure.html'), structureTemplate);
  
  // 3. 内容模板
  const contentTemplate = `# 内容优化模板
# 文件名: content-template.md
# 生成时间: ${new Date().toISOString()}

## 产品内容模板

### 基本信息
- **产品名称**: [产品名称]
- **产品分类**: [办公家具/学校家具/智能家具]
- **适用场景**: [办公室/教室/实验室/会议室等]

### 产品特点
1. [特点1：例如：人体工学设计]
2. [特点2：例如：环保材料]
3. [特点3：例如：智能功能]
4. [特点4：例如：易于安装]

### 技术参数
- **材质**: [例如：实木/金属/复合材料]
- **尺寸**: [例如：长宽高规格]
- **颜色**: [例如：多种颜色可选]
- **重量**: [例如：产品重量]
- **承重**: [例如：最大承重能力]

### 使用场景
描述产品适用的具体场景和优势：
- [场景1：例如：办公室工作区]
- [场景2：例如：学校教室]
- [场景3：例如：会议室]

### 客户评价
收集和展示客户评价：
- "评价内容1" - 客户A
- "评价内容2" - 客户B
- "评价内容3" - 客户C

---

## 案例展示模板

### 项目概述
- **客户名称**: [客户名称]
- **项目类型**: [办公空间/学校教室/实验室等]
- **项目地点**: [项目具体地点]
- **项目规模**: [例如：1000平方米]
- **完成时间**: [项目完成时间]

### 客户需求
描述客户的具体需求和挑战：
- [需求1：例如：需要现代化办公环境]
- [需求2：例如：需要符合教育标准]
- [需求3：例如：需要智能集成]

### 解决方案
描述提供的解决方案：
- [方案1：例如：定制办公家具]
- [方案2：例如：智能控制系统]
- [方案3：例如：空间优化设计]

### 实施过程
项目实施的关键步骤：
1. [步骤1：需求分析]
2. [步骤2：方案设计]
3. [步骤3：生产制造]
4. [步骤4：安装调试]

### 成果展示
项目成果的展示：
- **图片展示**: [项目完成图片]
- **数据成果**: [例如：空间利用率提升30%]
- **客户反馈**: [客户满意度评价]

### 项目价值
项目带来的价值：
- **效率提升**: [例如：工作效率提升20%]
- **成本节约**: [例如：长期维护成本降低]
- **体验改善**: [例如：员工满意度提升]

---

## 公司介绍模板

### 品牌故事
[讲述品牌创立的故事和理念]

### 核心价值
1. **专业**: [专业价值描述]
2. **创新**: [创新价值描述]
3. **品质**: [品质价值描述]
4. **服务**: [服务价值描述]

### 团队介绍
[介绍核心团队和专业能力]

### 发展历程
- [年份]: [重要事件]
- [年份]: [重要事件]
- [年份]: [重要事件]

### 合作伙伴
[展示合作伙伴和客户]

---

## SEO内容优化指南

### 关键词策略
1. **核心关键词**: 办公家具、学校家具、智能家具
2. **长尾关键词**: 定制办公桌椅、学校课桌椅价格、智能办公解决方案
3. **地域关键词**: 佛山办公家具、广东学校家具、华南家具定制

### 内容质量要求
1. **原创性**: 确保内容原创，避免抄袭
2. **专业性**: 提供专业、准确的信息
3. **完整性**: 内容全面，信息完整
4. **可读性**: 语言流畅，易于理解

### 更新频率
- **产品内容**: 每月更新2-3个新产品
- **案例内容**: 每月新增1-2个案例
- **资讯内容**: 每周发布1-2篇行业资讯
- **技术文章**: 每月发布1-2篇技术文章

### 多媒体内容
- **图片**: 高质量产品图片，尺寸统一
- **视频**: 产品使用视频，案例展示视频
- **图表**: 技术参数图表，对比图表
- **3D展示**: 产品3D模型展示

---

## 内容发布检查清单

### 发布前检查
- [ ] 内容准确性验证
- [ ] SEO优化检查
- [ ] 图片质量检查
- [ ] 链接有效性检查
- [ ] 移动端适配检查

### 发布后检查
- [ ] 页面加载速度测试
- [ ] 功能完整性测试
- [ ] 用户访问测试
- [ ] SEO收录检查
- [ ] 用户反馈收集

---

**模板版本**: 1.0.0
**最后更新**: ${new Date().toISOString()}
**维护者**: 网站内容优化系统`;

  fs.writeFileSync(path.join(templatesDir, 'content-template.md'), contentTemplate);
  
  logger.success(`生成 ${fs.readdirSync(templatesDir).length} 个模板文件`);
  logger.success(`模板目录: ${templatesDir}`);
  
  return templatesDir;
}

// 执行优化流程
async function executeOptimization() {
  logger.section('开始网站内容优化流程');
  
  try {
    // 1. 创建备份目录
    createBackupDir();
    
    // 2. 分析网站
    const analysis = await analyzeWebsite();
    
    // 3. 生成优化建议
    const suggestions = generateOptimizationSuggestions(analysis);
    
    // 4. 创建优化计划
    const plan = createOptimizationPlan(analysis, suggestions);
    
    // 5. 生成实施模板
    const templatesDir = generateImplementationTemplates(plan);
    
    // 6. 生成总结报告
    const summary = {
      status: 'completed',
      timestamp: new Date().toISOString(),
      analysis: {
        url: analysis.url,
        status: analysis.status.code,
        structureElements: analysis.structure.elements?.headings || 0,
        wordCount: analysis.content.wordCount || 0,
        seoScore: calculateSEOScore(analysis.seo),
      },
      optimization: {
        totalSuggestions: Object.values(suggestions).flat().length,
        highPriority: suggestions.structure.length + suggestions.seo.length,
        estimatedTime: '4-8周',
      },
      generatedFiles: {
        analysis: path.join(CONFIG.backupDir, 'website_analysis.json'),
        suggestions: path.join(CONFIG.backupDir, 'optimization_suggestions.json'),
        plan: path.join(CONFIG.backupDir, 'optimization_plan.json'),
        templates: templatesDir,
      },
      nextSteps: [
        '1. 审查优化建议和计划',
        '2. 开始实施基础结构优化',
        '3. 逐步实施SEO和内容优化',
        '4. 监控优化效果并调整',
      ],
    };
    
    const summaryFile = path.join(CONFIG.backupDir, 'optimization_summary.json');
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
    
    logger.section('优化流程完成');
    logger.success(`优化分析完成！`);
    logger.log(`📊 分析结果:`);
    logger.log(`  网站状态: ${summary.analysis.status}`);
    logger.log(`  页面元素: ${summary.analysis.structureElements} 个`);
    logger.log(`  内容字数: ${summary.analysis.wordCount} 字`);
    logger.log(`  SEO评分: ${summary.analysis.seoScore}/100`);
    logger.log(`\n🎯 优化建议:`);
    logger.log(`  总计建议: ${summary.optimization.totalSuggestions} 条`);
    logger.log(`  高优先级: ${summary.optimization.highPriority} 条`);
    logger.log(`  预计时间: ${summary.optimization.estimatedTime}`);
    logger.log(`\n📁 生成文件:`);
    logger.log(`  分析报告: ${summary.generatedFiles.analysis}`);
    logger.log(`  优化计划: ${summary.generatedFiles.plan}`);
    logger.log(`  实施模板: ${summary.generatedFiles.templates}`);
    
    return summary;
    
  } catch (error) {
    logger.error(`优化流程失败: ${error.message}`);
    return {
      status: 'failed',
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
}

// 计算SEO评分
function calculateSEOScore(seoAnalysis) {
  let score = 0;
  const maxScore = 100;
  
  // Meta标签 (30分)
  if (seoAnalysis.metaTags?.title) score += 10;
  if (seoAnalysis.metaTags?.description) score += 10;
  if (seoAnalysis.metaTags?.keywords) score += 5;
  if (seoAnalysis.metaTags?.viewport) score += 5;
  
  // Open Graph (20分)
  if (seoAnalysis.openGraph?.ogTitle) score += 5;
  if (seoAnalysis.openGraph?.ogDescription) score += 5;
  if (seoAnalysis.openGraph?.ogImage) score += 5;
  if (seoAnalysis.openGraph?.ogUrl) score += 5;
  
  // 结构化数据 (20分)
  if (seoAnalysis.structuredData?.hasSchema) score += 10;
  if (seoAnalysis.structuredData?.hasJSONLD) score += 10;
  
  // 技术SEO (30分)
  if (seoAnalysis.technicalSEO?.hasCanonical) score += 10;
  if (seoAnalysis.technicalSEO?.hasH1) score += 10;
  if (seoAnalysis.technicalSEO?.hasAltText) score += 10;
  
  return score;
}

// 主函数
async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'optimize':
      await executeOptimization();
      break;
      
    case 'analyze':
      createBackupDir();
      const analysis = await analyzeWebsite();
      console.log(JSON.stringify(analysis, null, 2));
      break;
      
    case 'templates':
      createBackupDir();
      const templatesDir = generateImplementationTemplates({});
      console.log(`模板已生成到: ${templatesDir}`);
      break;
      
    default:
      console.log('佐迪智能网站内容优化工具');
      console.log('使用方法:');
      console.log('  node website_content_optimizer.js optimize  # 执行完整优化流程');
      console.log('  node website_content_optimizer.js analyze   # 仅分析网站');
      console.log('  node website_content_optimizer.js templates # 生成模板文件');
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
  executeOptimization,
  analyzeWebsite,
  generateOptimizationSuggestions,
};