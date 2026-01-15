import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

async function initAdmin() {
  let connection;
  try {
    // Parse DATABASE_URL
    const url = new URL(DATABASE_URL);
    const config = {
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      port: url.port || 3306,
      ssl: 'amazon',
    };

    connection = await mysql.createConnection(config);
    console.log('✓ Connected to database');

    // Create admin user with a test openId
    const adminOpenId = 'admin-' + Date.now();
    const adminEmail = 'admin@zuodi.com';
    const adminName = 'Admin';

    const query = `
      INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn)
      VALUES (?, ?, ?, ?, ?, NOW(), NOW(), NOW())
      ON DUPLICATE KEY UPDATE
      role = 'admin',
      updatedAt = NOW(),
      lastSignedIn = NOW()
    `;

    const [result] = await connection.execute(query, [
      adminOpenId,
      adminName,
      adminEmail,
      'manual',
    ]);

    console.log('✓ Admin user created/updated');
    console.log('\n📋 Admin Account Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`OpenId: ${adminOpenId}`);
    console.log(`Email: ${adminEmail}`);
    console.log(`Name: ${adminName}`);
    console.log(`Role: admin`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Also create some sample product series
    const seriesData = [
      { name: '黎明', nameEn: 'Dawn', code: 'DAWN', slug: 'dawn', description: '现代办公座椅系列' },
      { name: '杰瑞', nameEn: 'Jerry', code: 'JERRY', slug: 'jerry', description: '人体工学办公椅' },
      { name: '光芒', nameEn: 'Sunshine', code: 'SUNSHINE', slug: 'sunshine', description: '会议桌系列' },
      { name: '诺拉', nameEn: 'Neola', code: 'NEOLA', slug: 'neola', description: '学生课桌系列' },
    ];

    for (const series of seriesData) {
      const seriesQuery = `
        INSERT INTO product_series (name, nameEn, code, slug, description, sortOrder, isActive, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, 1, NOW(), NOW())
        ON DUPLICATE KEY UPDATE
        name = ?,
        nameEn = ?,
        description = ?,
        updatedAt = NOW()
      `;

      await connection.execute(seriesQuery, [
        series.name,
        series.nameEn,
        series.code,
        series.slug,
        series.description,
        seriesData.indexOf(series),
        series.name,
        series.nameEn,
        series.description,
      ]);
    }

    console.log('✓ Sample product series created');

    // Create sample categories
    const categoriesData = [
      { name: '座椅', slug: 'seating', type: 'office', description: '办公座椅' },
      { name: '办公会议桌', slug: 'desks-tables', type: 'office', description: '办公桌和会议桌' },
      { name: '存储', slug: 'storage', type: 'office', description: '存储柜和架子' },
      { name: '空间支持', slug: 'space-solutions', type: 'office', description: '空间解决方案' },
    ];

    for (const category of categoriesData) {
      const categoryQuery = `
        INSERT INTO product_categories (name, slug, type, description, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, NOW(), NOW())
        ON DUPLICATE KEY UPDATE
        name = ?,
        description = ?,
        updatedAt = NOW()
      `;

      await connection.execute(categoryQuery, [
        category.name,
        category.slug,
        category.type,
        category.description,
        category.name,
        category.description,
      ]);
    }

    console.log('✓ Sample product categories created');
    console.log('\n✨ Admin initialization complete!');
    console.log('You can now log in with the admin account and manage products.\n');

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initAdmin();
