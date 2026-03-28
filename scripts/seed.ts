import mongoose from 'mongoose';
import { connectDB } from '../src/lib/db';
import Product from '../src/models/Product';
import User from '../src/models/User';

async function seedDatabase() {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Legacy DBs may have a unique index on `sku` that blocks multiple docs without sku
    try {
      await Product.collection.dropIndex('sku_1');
      console.log('🧹 Dropped legacy sku index');
    } catch {
      /* index missing */
    }

    // Create admin user
    await User.create({
      name: 'Admin User',
      email: 'admin@petshop.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('👤 Created admin user (admin@petshop.com / admin123)');

    // Create sample products (schema: variants are { name, sku, price, stock }; checkout without variant uses product.stock)
    const products = [
      {
        catalogId: 'p1',
        name: 'Premium Royal Canin Dog Food',
        description: 'High-quality nutrition for adult dogs with balanced proteins and essential vitamins for optimal health.',
        price: 3499,
        category: 'food',
        images: [
          'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?q=80&w=600&auto=format&fit=crop'
        ],
        stock: 50,
        lowStockThreshold: 10,
        rating: 4.8,
        reviewCount: 124,
        variants: [],
      },
      {
        catalogId: 'p2',
        name: 'Orthopedic Pet Bed',
        description: 'Memory foam bed for ultimate comfort and joint support. Perfect for senior pets or those with arthritis.',
        price: 6499,
        category: 'accessories',
        images: [
          'https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=600&auto=format&fit=crop'
        ],
        stock: 25,
        lowStockThreshold: 5,
        rating: 4.9,
        reviewCount: 89,
        variants: [],
      },
      {
        catalogId: 'p3',
        name: 'Interactive Cat Toy',
        description: 'Keep your feline friend entertained for hours with this engaging interactive toy. Battery operated.',
        price: 1199,
        category: 'toys',
        images: [
          'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=600&auto=format&fit=crop'
        ],
        stock: 100,
        lowStockThreshold: 20,
        rating: 4.5,
        reviewCount: 210,
        variants: [],
      },
      {
        catalogId: 'p4',
        name: 'Adjustable Nylon Harness',
        description: 'Comfortable and secure harness for daily walks. Reflective stitching for night visibility.',
        price: 1899,
        category: 'accessories',
        images: [
          'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?q=80&w=600&auto=format&fit=crop'
        ],
        stock: 75,
        lowStockThreshold: 15,
        rating: 4.7,
        reviewCount: 56,
        variants: [],
      },
      {
        name: 'Natural Dog Treats',
        description: 'Healthy and delicious treats made with natural ingredients. No artificial preservatives or colors.',
        price: 599,
        category: 'food',
        images: [
          'https://images.unsplash.com/photo-1582798358481-d199fb7347bb?q=80&w=600&auto=format&fit=crop'
        ],
        stock: 200,
        lowStockThreshold: 50,
        rating: 4.6,
        reviewCount: 342,
        variants: [],
      },
      {
        name: 'Pet Grooming Kit',
        description: 'Complete grooming kit with clippers, scissors, comb, and brush. Professional quality for home use.',
        price: 2999,
        category: 'grooming',
        images: [
          'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=600&auto=format&fit=crop'
        ],
        stock: 30,
        lowStockThreshold: 8,
        rating: 4.4,
        reviewCount: 78,
        variants: [],
      },
      {
        name: 'Luxury Cat Tower',
        description: 'Multi-level cat tower with scratching posts, hiding spots, and perches. Perfect for multiple cats.',
        price: 12999,
        category: 'accessories',
        images: [
          'https://images.unsplash.com/photo-1545249390-6bdfa286032f?q=80&w=600&auto=format&fit=crop'
        ],
        stock: 8,
        lowStockThreshold: 3,
        rating: 4.9,
        reviewCount: 45,
        variants: [],
      },
      {
        name: 'Automatic Pet Feeder',
        description: 'Smart automatic feeder with programmable meal times and portion control. WiFi enabled.',
        price: 8999,
        category: 'accessories',
        images: [
          'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=600&auto=format&fit=crop'
        ],
        stock: 15,
        lowStockThreshold: 5,
        rating: 4.7,
        reviewCount: 92,
        variants: [],
      },
      {
        name: 'Organic Shampoo for Dogs',
        description: 'Gentle organic shampoo with oatmeal and aloe vera. Hypoallergenic formula for sensitive skin.',
        price: 899,
        category: 'grooming',
        images: [
          'https://images.unsplash.com/photo-1585837575652-2c90698b7f31?q=80&w=600&auto=format&fit=crop'
        ],
        stock: 60,
        lowStockThreshold: 15,
        rating: 4.5,
        reviewCount: 156,
        variants: [],
      },
      {
        name: 'Rope Toy Set',
        description: 'Durable rope toys for tug-of-war and chewing. Helps clean teeth and massage gums.',
        price: 799,
        category: 'toys',
        images: [
          'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=80&w=600&auto=format&fit=crop'
        ],
        stock: 5,
        lowStockThreshold: 20,
        rating: 4.3,
        reviewCount: 287,
        variants: [],
      }
    ];

    await Product.insertMany(products);
    console.log('📦 Created sample products');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('   Admin: admin@petshop.com / admin123');
    console.log('\n🚀 Run "npm run dev" to start the development server');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
