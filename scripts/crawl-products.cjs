const fs = require('fs');
const path = require('path');
const http = require('http');

const urls = [
  "http://www.seewin-edu.com/rengongzhineng2/784.html", // 守恒组合桌
  "http://www.seewin-edu.com/yuelanshafa/903.html", // 米切索沙发
  "http://www.seewin-edu.com/jisuanjijiaoshi/842.html", // 巴克斯考试桌
  "http://www.seewin-edu.com/jiaoshijiangtai/751.html", // 科威特智慧讲台
  "http://www.seewin-edu.com/shubaogui/755.html", // 凡尔赛储物柜
  "http://www.seewin-edu.com/tushugui/883.html", // 西塞罗双面柜
  "http://www.seewin-edu.com/sushejiaju/802.html", // 海纳上床下桌
  "http://www.seewin-edu.com/cantingjiaju/822.html", // 达拉斯餐桌椅
  "http://www.seewin-edu.com/meishujiaoshi/849.html", // 梵高绘画桌
  "http://www.seewin-edu.com/sidun/915.html", // 斯顿办公桌
  "http://www.seewin-edu.com/wangbuyi/951.html" // 办公椅6018
];

const results = {
  categories: [
    { id: "seating", name: "座椅系列", description: "舒适的人体工学座椅与休闲沙发" },
    { id: "desks", name: "办公与课桌", description: "适合办公、教室、培训的多功能桌" },
    { id: "storage", name: "储物柜", description: "书包柜、图书馆书柜、办公文件柜" },
    { id: "special", name: "专用空间家具", description: "宿舍床、餐厅桌椅、讲台、美术桌" }
  ],
  products: []
};

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function extractProductData(html, url) {
  // Title
  const titleMatch = html.match(/<title>(.*?)-.*<\/title>/);
  let title = titleMatch ? titleMatch[1].trim() : "未知产品";
  
  // 提取大图
  const imgMatches = [];
  const imgRegex = /src="([^"]+uploadfile\/Product-OK\/[^"]+)"/g;
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    if (!match[1].includes('lunbo')) {
      let imgSrc = match[1];
      if (!imgSrc.startsWith('http')) {
         imgSrc = 'http://www.seewin-edu.com' + imgSrc;
      }
      if (!imgMatches.includes(imgSrc)) imgMatches.push(imgSrc);
    }
  }
  
  // 提取描述 (粗略提取)
  let desc = "";
  const descRegex = /<p[^>]*>([^<]{20,})<\/p>/;
  const descMatch = html.match(descRegex);
  if (descMatch) {
     desc = descMatch[1].replace(/&nbsp;/g, ' ').trim();
  } else {
     desc = "采用环保材料制造，整体结构稳定，设计符合人体工学，坚固耐用。";
  }

  // Determine category
  let category = "办公与课桌";
  if (url.includes('shafa') || url.includes('wangbuyi') || url.includes('yi')) category = "座椅系列";
  else if (url.includes('gui')) category = "储物柜";
  else if (url.includes('sushe') || url.includes('canting') || url.includes('jiangtai') || url.includes('meishu')) category = "专用空间家具";

  return {
    id: `prod-${Date.now()}-${Math.floor(Math.random()*1000)}`,
    name: title,
    category: category,
    description: desc,
    image: imgMatches.length > 0 ? imgMatches[0] : "",
    images: imgMatches,
    features: [
      "环保材料制造",
      "符合人体工学设计",
      "坚固耐用，安全可靠",
      "诗敏教学设备官方出品"
    ]
  };
}

async function run() {
  console.log("Starting to crawl products...");
  
  for (const url of urls) {
    console.log(`Fetching ${url}...`);
    try {
      const html = await fetchUrl(url);
      const product = extractProductData(html, url);
      
      console.log(`Found product: ${product.name} with ${product.images.length} images`);
      results.products.push(product);
      
    } catch (e) {
      console.error(`Failed to fetch ${url}:`, e.message);
    }
  }
  
  const outputPath = path.join(__dirname, '../client/src/data-products.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`Saved ${results.products.length} products to ${outputPath}`);
}

run();
