import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
  
  const admin = await prisma.admin.upsert({
    where: { id: 'admin' },
    update: { passwordHash: adminPassword },
    create: {
      id: 'admin',
      passwordHash: adminPassword,
    },
  });

  console.log('✅ Admin user created/updated');

  // Create default profile
  const profile = await prisma.profile.upsert({
    where: { username: 'john' },
    update: {},
    create: {
      username: 'john',
      bio: 'Software developer & tech enthusiast. Building cool stuff on the internet.',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      theme: {
        primaryColor: '#3b82f6',
        backgroundColor: '#f8fafc',
      },
      layout: 'LIST',
    },
  });

  console.log('✅ Profile created/updated');

  // Create sample links
  const links = [
    {
      title: 'GitHub',
      url: 'https://github.com/johndoe',
      orderIndex: 0,
      profileId: profile.id,
    },
    {
      title: 'Twitter',
      url: 'https://twitter.com/johndoe',
      orderIndex: 1,
      profileId: profile.id,
    },
    {
      title: 'LinkedIn',
      url: 'https://linkedin.com/in/johndoe',
      orderIndex: 2,
      profileId: profile.id,
    },
    {
      title: 'Portfolio',
      url: 'https://johndoe.dev',
      orderIndex: 3,
      profileId: profile.id,
    },
    {
      title: 'Blog',
      url: 'https://blog.johndoe.dev',
      orderIndex: 4,
      profileId: profile.id,
    },
  ];

  for (const link of links) {
    await prisma.link.create({
      data: link,
    });
  }

  console.log('✅ Links created/updated');

  // Create sample short URLs
  const shortUrls = [
    {
      slug: 'github',
      targetUrl: 'https://github.com/johndoe',
    },
    {
      slug: 'portfolio',
      targetUrl: 'https://johndoe.dev',
    },
    {
      slug: 'blog',
      targetUrl: 'https://blog.johndoe.dev',
    },
  ];

  for (const shortUrl of shortUrls) {
    await prisma.shortUrl.upsert({
      where: { slug: shortUrl.slug },
      update: shortUrl,
      create: shortUrl,
    });
  }

  console.log('✅ Short URLs created/updated');
  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
