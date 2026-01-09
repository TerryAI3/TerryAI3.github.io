import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { productSeries } from '../drizzle/schema.js';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

const seriesData = [
  {
    name: '黎明 Dawn',
    nameEn: 'Dawn',
    code: '2801D',
    slug: 'dawn',
    description: '黎明系列办公家具，简约现代设计，适合各类办公空间',
    sortOrder: 1,
    isActive: 1,
  },
  {
    name: '杰瑞 Jerry',
    nameEn: 'Jerry',
    code: '2802J',
    slug: 'jerry',
    description: '杰瑞系列办公家具，经典设计与现代功能完美结合',
    sortOrder: 2,
    isActive: 1,
  },
  {
    name: '光芒 Sunshine',
    nameEn: 'Sunshine',
    code: '2806G',
    slug: 'sunshine',
    description: '光芒系列办公家具，明亮温暖的设计理念',
    sortOrder: 3,
    isActive: 1,
  },
  {
    name: '欣喜 Fres',
    nameEn: 'Fres',
    code: '2809H',
    slug: 'fres',
    description: '欣喜系列办公家具，为工作空间带来活力',
    sortOrder: 4,
    isActive: 1,
  },
  {
    name: '诺拉 Neola',
    nameEn: 'Neola',
    code: '2810N',
    slug: 'neola',
    description: '诺拉系列办公家具，优雅与实用的完美平衡',
    sortOrder: 5,
    isActive: 1,
  },
  {
    name: '励美 Limei',
    nameEn: 'Limei',
    code: '2815L',
    slug: 'limei',
    description: '励美系列办公家具，激励美好工作环境',
    sortOrder: 6,
    isActive: 1,
  },
  {
    name: '凯特 Kate',
    nameEn: 'Kate',
    code: '2816K',
    slug: 'kate',
    description: '凯特系列办公家具，时尚简约的办公解决方案',
    sortOrder: 7,
    isActive: 1,
  },
  {
    name: '德芙 DOVE',
    nameEn: 'DOVE',
    code: 'DOVE',
    slug: 'dove',
    description: '德芙系列办公家具，高端品质的象征',
    sortOrder: 8,
    isActive: 1,
  },
];

console.log('开始初始化产品系列数据...');

try {
  for (const series of seriesData) {
    await db.insert(productSeries).values(series);
    console.log(`✓ 已添加系列: ${series.name}`);
  }
  console.log('\n✓ 产品系列数据初始化完成！');
} catch (error) {
  console.error('初始化失败:', error);
} finally {
  await connection.end();
}
