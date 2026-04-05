import User from './src/models/User';
import connectDB from './src/lib/mongoose';
import bcrypt from 'bcryptjs';

async function resetPasswords() {
  await connectDB();
  
  const adminEmail = 'admin@petshop.com';
  const adminPass = 'admin123';
  
  const userEmail = 'user@example.com';
  const userPass = 'user123';

  // Update Admin
  const admin = await User.findOne({ email: adminEmail });
  if (admin) {
    admin.password = adminPass;
    await admin.save();
    console.log(`Updated admin: ${adminEmail} to ${adminPass}`);
  } else {
    await User.create({ name: 'Admin User', email: adminEmail, password: adminPass, role: 'admin' });
    console.log(`Created admin: ${adminEmail} with password ${adminPass}`);
  }

  // Update User
  const user = await User.findOne({ email: userEmail });
  if (user) {
    user.password = userPass;
    await user.save();
    console.log(`Updated user: ${userEmail} to ${userPass}`);
  } else {
    await User.create({ name: 'Demo User', email: userEmail, password: userPass, role: 'user' });
    console.log(`Created user: ${userEmail} with password ${userPass}`);
  }

  process.exit(0);
}

resetPasswords();
