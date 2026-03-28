/**
 * Creates demo users for local / Atlas MongoDB (matches /auth/login demo copy).
 * Run: npm run seed
 * Requires MONGODB_URI in .env (same as Next.js).
 */
import connectDB from '../src/lib/mongoose';
import User from '../src/models/User';

const seeds = [
  { name: 'Admin User', email: 'admin@petshop.com', password: 'admin123', role: 'admin' as const },
  { name: 'Demo User', email: 'user@example.com', password: 'user123', role: 'user' as const },
];

async function main() {
  await connectDB();

  for (const u of seeds) {
    const exists = await User.findOne({ email: u.email });
    if (exists) {
      console.log(`Skip (already exists): ${u.email}`);
      continue;
    }
    await User.create(u);
    console.log(`Created: ${u.email} (${u.role})`);
  }

  console.log('\nDone. Sign in at /auth/login with the demo credentials.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
