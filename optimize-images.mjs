import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function optimizeImages() {
  console.log('🖼️  开始优化图片...\n');

  const imagesDir = path.join(__dirname, 'client/public/images');
  
  try {
    const files = fs.readdirSync(imagesDir, { recursive: true });
    let optimizedCount = 0;
    let totalOriginalSize = 0;
    let totalOptimizedSize = 0;

    for (const file of files) {
      const filePath = path.join(imagesDir, file);
      const stat = fs.statSync(filePath);
      
      if (!stat.isFile()) continue;
      
      // 跳过已经是 WebP 的文件和 logo
      if (/\.webp$/i.test(file) || /logo/i.test(file)) continue;
      
      if (/\.(jpg|jpeg|png)$/i.test(file)) {
        try {
          const fileName = path.parse(file).name;
          const dirName = path.dirname(filePath);
          
          // 获取原始文件大小
          const originalSize = stat.size;
          totalOriginalSize += originalSize;
          
          // 创建优化后的 WebP 版本
          const webpPath = path.join(dirName, `${fileName}.webp`);
          await sharp(filePath)
            .webp({ quality: 75 })
            .toFile(webpPath);
          
          // 获取优化后的大小
          const optimizedStat = fs.statSync(webpPath);
          const optimizedSize = optimizedStat.size;
          totalOptimizedSize += optimizedSize;
          
          const reduction = ((1 - optimizedSize / originalSize) * 100).toFixed(1);
          console.log(`  ✓ ${file}`);
          console.log(`    原始: ${(originalSize / 1024).toFixed(1)}KB → WebP: ${(optimizedSize / 1024).toFixed(1)}KB (减少 ${reduction}%)\n`);
          
          optimizedCount++;
        } catch (err) {
          console.error(`  ✗ 处理 ${file} 失败:`, err.message);
        }
      }
    }

    console.log('📊 优化结果统计:\n');
    console.log(`  处理文件数: ${optimizedCount}`);
    console.log(`  原始总大小: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  优化后总大小: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  总体减少: ${((1 - totalOptimizedSize / totalOriginalSize) * 100).toFixed(1)}%\n`);
    console.log('✨ 图片优化完成！');
    
  } catch (error) {
    console.error('❌ 优化失败:', error);
    process.exit(1);
  }
}

optimizeImages();
