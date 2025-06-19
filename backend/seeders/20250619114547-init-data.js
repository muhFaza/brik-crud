'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('password123', 12);

    const existingUser = await queryInterface.sequelize.query(
      'SELECT id FROM users WHERE email = ?',
      {
        replacements: ['john.doe@example.com'],
        type: Sequelize.QueryTypes.SELECT
      }
    );

    if (existingUser.length === 0) {
      await queryInterface.bulkInsert('users', [
        {
          email: 'john.doe@example.com',
          name: 'John Doe',
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], {});
      console.log('✓ User seeded successfully');
    } else {
      console.log('⚠ User already exists, skipping user creation');
    }

    const productsToSeed = [
      {
        name: 'Beras Premium 5kg',
        description: 'Beras premium kualitas terbaik dari petani lokal, cocok untuk kebutuhan sehari-hari keluarga.',
        price: 65000,
        stock: 100,
        imageUrl: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//94/MTA-55063344/sania_sania-beras--5-kg-_full02.jpg',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Minyak Goreng Kelapa Sawit 2L',
        description: 'Minyak goreng berkualitas tinggi dari kelapa sawit pilihan, aman untuk menggoreng dan memasak.',
        price: 28000,
        stock: 75,
        imageUrl: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full/catalog-image/MTA-17978583/tropical_tropical_minyak_goreng_kelapa_sawit_botol_2_l_full04_trtu4902.jpeg',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Gula Pasir 1kg',
        description: 'Gula pasir putih kristal halus, manis alami untuk kebutuhan dapur dan minuman sehari-hari.',
        price: 15000,
        stock: 120,
        imageUrl: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//90/MTA-3408533/gulaku_gula-pasir-gulaku-1kg-kuning_full02.jpg',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Telur Ayam Kampung 1kg',
        description: 'Telur ayam kampung segar dan bergizi tinggi, langsung dari peternak lokal terpercaya.',
        price: 32000,
        stock: 60,
        imageUrl: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full/catalog-image/112/MTA-170896935/tidak_ada_merk_telur_ayam_negeri_1000g_1_kg_full01_nlra4nsq.jpg',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Kopi Bubuk Robusta 500gr',
        description: 'Kopi bubuk robusta asli Indonesia dengan aroma khas dan rasa yang nikmat untuk pecinta kopi.',
        price: 45000,
        stock: 40,
        imageUrl: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//catalog-image/103/MTA-96570650/brd-44261_machiato-biji-kopi-bubuk-robusta-500-gr-biji-kopi-machiato_full01.jpg',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const existingProducts = await queryInterface.sequelize.query(
      'SELECT name FROM products WHERE name IN (?)',
      {
        replacements: [productsToSeed.map(p => p.name)],
        type: Sequelize.QueryTypes.SELECT
      }
    );

    const existingProductNames = existingProducts.map(p => p.name);
    const newProducts = productsToSeed.filter(product => 
      !existingProductNames.includes(product.name)
    );

    if (newProducts.length > 0) {
      await queryInterface.bulkInsert('products', newProducts, {});
      console.log(`✓ ${newProducts.length} new products seeded successfully`);
      newProducts.forEach(product => {
        console.log(`  - ${product.name}`);
      });
    } else {
      console.log('⚠ All products already exist, skipping product creation');
    }

    if (existingProductNames.length > 0) {
      console.log(`⚠ ${existingProductNames.length} products already existed:`);
      existingProductNames.forEach(name => {
        console.log(`  - ${name}`);
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};