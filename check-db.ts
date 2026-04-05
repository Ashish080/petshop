import mongoose from 'mongoose';
import User from './src/models/User';
import { connectDB } from './src/lib/db';

async function checkUser() {
  try {
    await connectDB();
    const users = await User.find({});
    console.log('Total users:', users.length);
    users.forEach(u => {
      console.log(`- ${u.email} (Role: ${u.role})`);
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkUser();
