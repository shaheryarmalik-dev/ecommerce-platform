import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany(); // Clear existing products for demo
  await prisma.product.createMany({
    data: [
      {
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation.',
        imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
        price: 99.99,
        category: 'Electronics',
        stock: 50,
      },
      {
        name: 'Smart Watch',
        description: 'Track your fitness and notifications on the go.',
        imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
        price: 149.99,
        category: 'Wearables',
        stock: 30,
      },
      {
        name: 'Bluetooth Speaker',
        description: 'Portable speaker with deep bass and long battery life.',
        imageUrl: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
        price: 59.99,
        category: 'Audio',
        stock: 40,
      },
      {
        name: 'VR Headset',
        description: 'Immersive virtual reality experience for gaming and more.',
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
        price: 299.99,
        category: 'Electronics',
        stock: 20,
      },
      {
        name: 'Robot Vacuum',
        description: 'Automatic vacuum cleaner for effortless cleaning.',
        imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80',
        price: 199.99,
        category: 'Home',
        stock: 15,
      },
      {
        name: 'Fitness Tracker',
        description: 'Monitor your health and activity 24/7.',
        imageUrl: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=400&q=80',
        price: 79.99,
        category: 'Wearables',
        stock: 60,
      },
      {
        name: 'Smart Home Hub',
        description: 'Control all your smart devices from one place.',
        imageUrl: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=400&q=80',
        price: 129.99,
        category: 'Home',
        stock: 25,
      },
      {
        name: 'Noise Cancelling Earbuds',
        description: 'Compact earbuds with active noise cancellation.',
        imageUrl: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=400&q=80',
        price: 89.99,
        category: 'Audio',
        stock: 35,
      },
      {
        name: 'Smart Light Bulb',
        description: 'Energy-efficient LED bulb with app control.',
        imageUrl: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
        price: 19.99,
        category: 'Home',
        stock: 100,
      },
      {
        name: 'Wireless Charger',
        description: 'Fast wireless charging pad for all devices.',
        imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80',
        price: 29.99,
        category: 'Electronics',
        stock: 80,
      },
      {
        name: 'Portable Gaming Console',
        description: 'Play your favorite games anywhere with this portable console.',
        imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=400&q=80',
        price: 249.99,
        category: 'Electronics',
        stock: 40,
      },
      {
        name: 'Smart Glasses',
        description: 'Augmented reality smart glasses for hands-free information.',
        imageUrl: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
        price: 199.99,
        category: 'Wearables',
        stock: 25,
      },
      {
        name: 'Wireless Earbuds',
        description: 'True wireless earbuds with long battery life and great sound.',
        imageUrl: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=400&q=80',
        price: 89.99,
        category: 'Audio',
        stock: 50,
      },
    ],
  });
  console.log('Seeded products!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 