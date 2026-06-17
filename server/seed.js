import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { Product, Admin, User } from './Schema.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ShopEZ';

const sampleProducts = [
  {
    title: 'Iphone 12',
    description: 'Apple Iphone with 8GB ram and 128GB storage, dual camera, OLED screen, A14 Bionic chip.',
    mainImg: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=500&auto=format&fit=crop',
    carousel: [
      'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=500&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&auto=format&fit=crop'
    ],
    sizes: ['128GB', '256GB'],
    category: 'Mobiles',
    gender: 'Unisex',
    price: 79999,
    discount: 15
  },
  {
    title: 'Samsung Galaxy S23',
    description: 'Samsung Galaxy S23 with 8GB RAM and 256GB storage, triple-camera system, 6.1-inch Dynamic AMOLED display.',
    mainImg: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop',
    carousel: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop'
    ],
    sizes: ['128GB', '256GB'],
    category: 'Mobiles',
    gender: 'Unisex',
    price: 74999,
    discount: 12
  },
  {
    title: 'Realme Buds',
    description: 'TWS buds with 10.2mm drivers, dynamic bass boost, IPX5 water resistant, up to 28 hours playback.',
    mainImg: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop',
    carousel: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop'
    ],
    sizes: ['Standard'],
    category: 'Electronics',
    gender: 'Unisex',
    price: 3999,
    discount: 35
  },
  {
    title: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise cancelling headphones with Auto NC Optimizer, 30-hour battery life, and crystal clear hands-free calling.',
    mainImg: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop',
    carousel: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop'
    ],
    sizes: ['Standard'],
    category: 'Electronics',
    gender: 'Unisex',
    price: 29990,
    discount: 20
  },
  {
    title: 'Dell Laptop 15',
    description: 'Dell Inspiron 15 with Intel Core i7, 16GB RAM, 512GB SSD, 15.6-inch FHD display, Windows 11 Home.',
    mainImg: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop',
    carousel: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop'
    ],
    sizes: ['i5 / 8GB', 'i7 / 16GB'],
    category: 'Electronics',
    gender: 'Unisex',
    price: 65000,
    discount: 18
  },
  {
    title: 'MRF Cricket Bat',
    description: 'Popular willow wood cricket bat from MRF. Suitable for all format plays in all conditions.',
    mainImg: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/A_Modern_Cricket_Bat.jpg',
    carousel: [
      'https://upload.wikimedia.org/wikipedia/commons/a/a5/A_Modern_Cricket_Bat.jpg'
    ],
    sizes: ['M', 'L'],
    category: 'Sports-Equipment',
    gender: 'Unisex',
    price: 1699,
    discount: 23
  },
  {
    title: 'Carrom Board',
    description: 'Quality carrom board along with necessary equipment to make your free time more joyful.',
    mainImg: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Carrom_board.jpg',
    carousel: [
      'https://upload.wikimedia.org/wikipedia/commons/4/4d/Carrom_board.jpg'
    ],
    sizes: ['M', 'L'],
    category: 'Sports-Equipment',
    gender: 'Unisex',
    price: 1499,
    discount: 38
  },
  {
    title: 'Kookaburra Cricket Bat',
    description: 'Imported cricket bat made with English willow wood. Premium bat to enhance your playing experience.',
    mainImg: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Cricket_Bats.jpg',
    carousel: [
      'https://upload.wikimedia.org/wikipedia/commons/a/a5/Cricket_Bats.jpg'
    ],
    sizes: ['M', 'L'],
    category: 'Sports-Equipment',
    gender: 'Unisex',
    price: 3299,
    discount: 28
  },
  {
    title: 'Running Shoes',
    description: 'Lightweight and breathable running shoes with advanced cushioning technology for long-distance comfort.',
    mainImg: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop',
    carousel: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop'
    ],
    sizes: ['7', '8', '9', '10', '11'],
    category: 'Sports-Equipment',
    gender: 'Unisex',
    price: 4999,
    discount: 30
  },
  {
    title: 'Formal Men Suit',
    description: 'Premium formal men suit, perfect for corporate events and weddings.',
    mainImg: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&auto=format&fit=crop',
    carousel: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&auto=format&fit=crop'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    category: 'Fashion',
    gender: 'Men',
    price: 4999,
    discount: 20
  },
  {
    title: 'Casual Dress Women',
    description: 'Comfortable casual summer dress for women, printed pattern.',
    mainImg: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format&fit=crop',
    carousel: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format&fit=crop'
    ],
    sizes: ['S', 'M', 'L'],
    category: 'Fashion',
    gender: 'Women',
    price: 1999,
    discount: 15
  },
  {
    title: "Men's Denim Jacket",
    description: "Classic denim jacket for men with a modern cut. Perfect for casual outings and everyday wear.",
    mainImg: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop',
    carousel: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    category: 'Fashion',
    gender: 'Men',
    price: 2499,
    discount: 25
  },
  {
    title: "Women's Handbag",
    description: "Stylish premium leather handbag for women. Spacious interior with multiple compartments.",
    mainImg: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&auto=format&fit=crop',
    carousel: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&auto=format&fit=crop'
    ],
    sizes: ['Standard'],
    category: 'Fashion',
    gender: 'Women',
    price: 3499,
    discount: 22
  },
  {
    title: 'Organic Almonds 1kg',
    description: '1kg premium raw California almonds, packed with protein and nutrients. Ideal for healthy snacking.',
    mainImg: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=500&auto=format&fit=crop',
    carousel: [
      'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=500&auto=format&fit=crop'
    ],
    sizes: ['500g', '1kg'],
    category: 'Groceries',
    gender: 'Unisex',
    price: 999,
    discount: 10
  },
  {
    title: 'Green Tea Box (50 bags)',
    description: 'Premium green tea with antioxidants. Zero calories, refreshing flavour. Pack of 50 tea bags.',
    mainImg: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop',
    carousel: [
      'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop'
    ],
    sizes: ['50 bags', '100 bags'],
    category: 'Groceries',
    gender: 'Unisex',
    price: 449,
    discount: 15
  },
  {
    title: 'Extra Virgin Olive Oil',
    description: 'Cold-pressed extra virgin olive oil, 1 litre. Rich in healthy fats and antioxidants, ideal for cooking.',
    mainImg: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop',
    carousel: [
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop'
    ],
    sizes: ['500ml', '1L'],
    category: 'Groceries',
    gender: 'Unisex',
    price: 799,
    discount: 12
  }
];


const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    await Product.deleteMany({});
    await Admin.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing products, admin settings, and users.');

    const adminSettings = new Admin({
      banner: '/shopez-banner.jpg',
      categories: ['Fashion', 'Electronics', 'Mobiles', 'Groceries', 'Sports-Equipment']
    });
    await adminSettings.save();
    console.log('Seeded admin settings.');

    await Product.insertMany(sampleProducts);
    console.log('Seeded sample products.');

    const salt = await bcrypt.genSalt(10);
    const hashedAdminPassword = await bcrypt.hash('admin123', salt);
    const hashedCustomerPassword = await bcrypt.hash('customer123', salt);

    const adminUser = new User({
      username: 'admin',
      email: 'admin@shopez.com',
      password: hashedAdminPassword,
      usertype: 'Admin'
    });

    const customerUser = new User({
      username: 'hola',
      email: 'hola@gmail.com',
      password: hashedCustomerPassword,
      usertype: 'Customer'
    });

    await adminUser.save();
    await customerUser.save();
    console.log('Seeded default users (Admin: admin@shopez.com / admin123, Customer: hola@gmail.com / customer123).');

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
