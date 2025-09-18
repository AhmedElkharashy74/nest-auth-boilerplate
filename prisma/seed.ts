// import { faker } from '@faker-js/faker';
// import { PrismaClient } from '@prisma/client';
// const { faker } = require('@faker-js/faker');


// const prisma = new PrismaClient();

// // Type definitions for our seed data
// interface SeedUser {
//   email: string;
//   username: string; 
//   password: string;
//   name: string;
//   image?: string;
// }

// interface SeedAccount {
//   provider: string;
//   providerAccountId: string;
//   type: string;
//   accessToken?: string;
//   refreshToken?: string;
//   expiresAt?: Date;
// }

// interface SeedRole {
//   name: string;
// }

// interface SeedPermission {
//   action: string;
//   resource: string;
// }

// interface SeedCategory {
//   name: string;
//   description: string;
//   slug: string;
//   isActive: boolean;
// }

// interface SeedItem {
//   name: string;
//   description: string;
//   price: number;
//   isPhysical: boolean;
// }

// interface SeedPackage {
//   name: string;
//   description: string;
//   price: number;
//   categoryId: number;
// }

// interface SeedPackageItem {
//   packageId: number;
//   itemId: number;
// }

// async function main() {
//   console.log('🌱 Starting seed...');

//   // Clear existing data (be careful in production!)
//   await clearDatabase();

//   // Create roles and permissions
//   const { roles, permissions } = await seedRolesAndPermissions();

//   // Create users
//   const users = await seedUsers(roles);

//   // Create categories
//   const categories = await seedCategories();

//   // Create items and packages
//   const { items, packages, packageItems } = await seedProducts(categories);

//   // Create carts and orders
//   await seedCartsAndOrders(users, items, packages);

//   console.log('✅ Seed completed successfully!');
// }

// async function clearDatabase() {
//   console.log('🧹 Clearing existing data...');
  
//   // Delete in correct order to respect foreign key constraints
//   const tables = [
//     'Payment',
//     'OrderItem',
//     'Order',
//     'CartItem',
//     'Cart',
//     'PackageItem',
//     'Package',
//     'Item',
//     'Category',
//     'RolePermission',
//     'UserRole',
//     'Permission',
//     'Role',
//     'Session',
//     'Account',
//     'User'
//   ];

//   for (const table of tables) {
//     try {
//       await (prisma as any)[table.toLowerCase()].deleteMany();
//       console.log(`✅ Cleared ${table}`);
//     } catch (error) {
//       console.log(`⚠️ Could not clear ${table}:`, (error as Error).message);
//     }
//   }
// }

// async function seedRolesAndPermissions() {
//   console.log('👥 Creating roles and permissions...');

//   // Create roles
//   const roleData: SeedRole[] = [
//     { name: 'admin' },
//     { name: 'editor' },
//     { name: 'user' }
//   ];

//   const roles = await Promise.all(
//     roleData.map(role => prisma.role.create({ data: role }))
//   );

//   // Create permissions
//   const permissionData: SeedPermission[] = [
//     // Admin permissions
//     { action: 'manage', resource: 'all' },
    
//     // User permissions
//     { action: 'read', resource: 'item' },
//     { action: 'read', resource: 'package' },
//     { action: 'read', resource: 'category' },
//     { action: 'create', resource: 'order' },
//     { action: 'read', resource: 'order' },
    
//     // Editor permissions
//     { action: 'create', resource: 'item' },
//     { action: 'update', resource: 'item' },
//     { action: 'delete', resource: 'item' },
//     { action: 'create', resource: 'package' },
//     { action: 'update', resource: 'package' },
//     { action: 'delete', resource: 'package' },
//   ];

//   const permissions = await Promise.all(
//     permissionData.map(permission => prisma.permission.create({ data: permission }))
//   );

//   // Assign permissions to roles
//   const rolePermissions = [
//     // Admin gets all permissions
//     ...permissions.map(permission => ({
//       roleId: roles.find(r => r.name === 'admin')!.id,
//       permissionId: permission.id
//     })),
    
//     // User gets basic permissions
//     ...permissions
//       .filter(p => p.action === 'read' || (p.action === 'create' && p.resource === 'order'))
//       .map(permission => ({
//         roleId: roles.find(r => r.name === 'user')!.id,
//         permissionId: permission.id
//       })),
    
//     // Editor gets content management permissions
//     ...permissions
//       .filter(p => 
//         ['create', 'update', 'delete'].includes(p.action) && 
//         ['item', 'package'].includes(p.resource)
//       )
//       .map(permission => ({
//         roleId: roles.find(r => r.name === 'editor')!.id,
//         permissionId: permission.id
//       }))
//   ];

//   await Promise.all(
//     rolePermissions.map(rp => 
//       prisma.rolePermission.create({ data: rp })
//     )
//   );

//   return { roles, permissions };
// }

// async function seedUsers(roles: any[]) {
//   console.log('👤 Creating users...');

//   const userData: SeedUser[] = [
//     // Admin user
//     {
//       email: 'admin@example.com',
//       username: 'admin',
//       password: '$2b$10$ExampleHashForPassword123', // In real app, use bcrypt
//       name: 'Admin User',
//       image: faker.image.avatar()
//     },
//     // Editor user
//     {
//       email: 'editor@example.com',
//       username: 'editor',
//       password: '$2b$10$ExampleHashForPassword123',
//       name: 'Editor User',
//       image: faker.image.avatar()
//     },
//     // Regular users
//     ...Array.from({ length: 5 }, () => ({
//       email: faker.internet.email(),
//       username: faker.internet.userName(),
//       password: '$2b$10$ExampleHashForPassword123',
//       name: faker.person.fullName(),
//       image: faker.image.avatar()
//     }))
//   ];

//   const users = await Promise.all(
//     userData.map(user => prisma.user.create({ data: user }))
//   );

//   // Assign roles to users
//   const userRoles = [
//     // Admin role for first user
//     {
//       userId: users[0].id,
//       roleId: roles.find(r => r.name === 'admin')!.id
//     },
//     // Editor role for second user
//     {
//       userId: users[1].id,
//       roleId: roles.find(r => r.name === 'editor')!.id
//     },
//     // User role for all users
//     ...users.map(user => ({
//       userId: user.id,
//       roleId: roles.find(r => r.name === 'user')!.id
//     }))
//   ];

//   await Promise.all(
//     userRoles.map(ur => prisma.userRole.create({ data: ur }))
//   );

//   // Create accounts for users
//   const accounts: SeedAccount[] = users.map(user => ({
//     provider: 'local',
//     providerAccountId: user.id,
//     type: 'credentials',
//     accessToken: faker.string.alphanumeric(64),
//     refreshToken: faker.string.alphanumeric(64),
//     expiresAt: faker.date.future()
//   }));

//   await Promise.all(
//     accounts.map((account, index) => 
//       prisma.account.create({ 
//         data: { ...account, userId: users[index].id } 
//       })
//     )
//   );

//   return users;
// }

// async function seedCategories() {
//   console.log('📦 Creating categories...');

//   const categoryData: SeedCategory[] = [
//     {
//       name: 'Digital Products',
//       description: 'Software, ebooks, and digital downloads',
//       slug: 'digital-products',
//       isActive: true
//     },
//     {
//       name: 'Physical Goods',
//       description: 'Tangible products that require shipping',
//       slug: 'physical-goods',
//       isActive: true
//     },
//     {
//       name: 'Subscription Services',
//       description: 'Recurring monthly or yearly services',
//       slug: 'subscription-services',
//       isActive: false
//     }
//   ];

//   return await Promise.all(
//     categoryData.map(category => prisma.category.create({ data: category }))
//   );
// }

// async function seedProducts(categories: any[]) {
//   console.log('🛍️ Creating items and packages...');

//   // Create items
//   const itemData: SeedItem[] = [
//     // Digital items
//     ...Array.from({ length: 10 }, () => ({
//       name: faker.commerce.productName() + ' (Digital)',
//       description: faker.commerce.productDescription(),
//       price: parseFloat(faker.commerce.price({ min: 5, max: 100 })),
//       isPhysical: false
//     })),
//     // Physical items
//     ...Array.from({ length: 5 }, () => ({
//       name: faker.commerce.productName(),
//       description: faker.commerce.productDescription(),
//       price: parseFloat(faker.commerce.price({ min: 10, max: 200 })),
//       isPhysical: true
//     }))
//   ];

//   const items = await Promise.all(
//     itemData.map(item => prisma.item.create({ data: item }))
//   );

//   // Create packages
//   const packageData: SeedPackage[] = [
//     {
//       name: 'Starter Package',
//       description: 'Perfect for beginners',
//       price: 49.99,
//       categoryId: categories[0].id
//     },
//     {
//       name: 'Professional Bundle',
//       description: 'Everything a professional needs',
//       price: 149.99,
//       categoryId: categories[0].id
//     },
//     {
//       name: 'Physical Starter Kit',
//       description: 'Beginner physical product package',
//       price: 79.99,
//       categoryId: categories[1].id
//     }
//   ];

//   const packages = await Promise.all(
//     packageData.map(pkg => prisma.package.create({ data: pkg }))
//   );

//   // Create package items (associate items with packages)
//   const packageItemData: SeedPackageItem[] = [
//     // Starter package gets first 3 digital items
//     { packageId: packages[0].id, itemId: items[0].id },
//     { packageId: packages[0].id, itemId: items[1].id },
//     { packageId: packages[0].id, itemId: items[2].id },
    
//     // Professional bundle gets next 5 digital items
//     { packageId: packages[1].id, itemId: items[3].id },
//     { packageId: packages[1].id, itemId: items[4].id },
//     { packageId: packages[1].id, itemId: items[5].id },
//     { packageId: packages[1].id, itemId: items[6].id },
//     { packageId: packages[1].id, itemId: items[7].id },
    
//     // Physical starter kit gets first 2 physical items
//     { packageId: packages[2].id, itemId: items[10].id },
//     { packageId: packages[2].id, itemId: items[11].id }
//   ];

//   const packageItems = await Promise.all(
//     packageItemData.map(pi => prisma.packageItem.create({ data: pi }))
//   );

//   return { items, packages, packageItems };
// }

// async function seedCartsAndOrders(users: any[], items: any[], packages: any[]) {
//   console.log('🛒 Creating carts and orders...');

//   // Create carts for each user
//   const carts = await Promise.all(
//     users.map(user => 
//       prisma.cart.create({ 
//         data: { userId: user.id } 
//       })
//     )
//   );

//   // Add random items to carts
//   const cartItems = [];
//   for (const cart of carts) {
//     const numItems = faker.number.int({ min: 1, max: 5 });
//     for (let i = 0; i < numItems; i++) {
//       const isPackage = faker.datatype.boolean();
//       const itemData: any = {
//         cartId: cart.id,
//         quantity: faker.number.int({ min: 1, max: 3 })
//       };

//       if (isPackage && packages.length > 0) {
//         itemData.packageId = faker.helpers.arrayElement(packages).id;
//       } else if (items.length > 0) {
//         itemData.itemId = faker.helpers.arrayElement(items).id;
//       }

//       if (itemData.packageId || itemData.itemId) {
//         const cartItem = await prisma.cartItem.create({ data: itemData });
//         cartItems.push(cartItem);
//       }
//     }
//   }

//   // Create orders for some users
//   const orders = [];
//   for (let i = 0; i < 3; i++) {
//     const user = users[i];
//     const orderItems = [];
//     let totalAmount = 0;

//     // Create 2-4 order items
//     const numItems = faker.number.int({ min: 2, max: 4 });
//     for (let j = 0; j < numItems; j++) {
//       const isPackage = faker.datatype.boolean();
//       const quantity = faker.number.int({ min: 1, max: 2 });
//       let price = 0;
//       let itemData: any = { quantity, price };

//       if (isPackage && packages.length > 0) {
//         const pkg = faker.helpers.arrayElement(packages);
//         price = pkg.price;
//         itemData.packageId = pkg.id;
//       } else if (items.length > 0) {
//         const item = faker.helpers.arrayElement(items);
//         price = item.price;
//         itemData.itemId = item.id;
//         if (item.isPhysical) {
//           itemData.deliveryStatus = faker.helpers.arrayElement(['pending', 'shipped', 'delivered']);
//         }
//       }

//       itemData.price = price;
//       totalAmount += price * quantity;
//       orderItems.push(itemData);
//     }

//     const order = await prisma.order.create({
//       data: {
//         userId: user.id,
//         totalAmount,
//         status: faker.helpers.arrayElement(['pending', 'paid', 'cancelled']),
//         shippingAddress: orderItems.some((item: any) => 
//           items.find(i => i.id === item.itemId)?.isPhysical
//         ) ? faker.location.streetAddress() : null,
//         orderItems: {
//           create: orderItems
//         }
//       },
//       include: {
//         orderItems: true
//       }
//     });

//     orders.push(order);

//     // Create payment for completed orders
//     if (order.status === 'paid') {
//       await prisma.payment.create({
//         data: {
//           orderId: order.id,
//           provider: faker.helpers.arrayElement(['stripe', 'paypal']),
//           amount: order.totalAmount,
//           status: 'completed'
//         }
//       });
//     }
//   }

//   return { carts, cartItems, orders };
// }

// main()
//   .catch((e) => {
//     console.error('❌ Seed failed:', e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });