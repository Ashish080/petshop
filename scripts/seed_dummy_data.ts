import connectDB from '../src/lib/mongoose';
import User from '../src/models/User';

async function seed() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing dummy data first to ensure clean hashing
    await User.deleteMany({ email: { $regex: /@kanha\.com$/ } });
    console.log('Cleared existing dummy nodes...');

    // Create 10 Riders using .create() to trigger pre('save') hooks (hashing)
    const riders = Array.from({ length: 10 }).map((_, i) => ({
      name: `Rider-${i + 1}`,
      email: `rider${i + 1}@kanha.com`,
      password: 'password123',
      role: 'rider' as const,
      phone: `99999990${i}`
    }));

    // Create 10 Users
    const users = Array.from({ length: 10 }).map((_, i) => ({
      name: `User-${i + 1}`,
      email: `user${i + 1}@kanha.com`,
      password: 'password123',
      role: 'user' as const,
      phone: `88888880${i}`
    }));

    await User.create([...riders, ...users]);
    
    console.log('Successfully seeded 10 Hashed Riders and 10 Hashed Users');
    console.log('Credentials: email@kanha.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();
