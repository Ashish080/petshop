import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

/**
 * PATH: /api/user/profile
 * DESC: Update user identity (name, image)
 */
export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const { name, image } = await req.json();

    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

    if (name) user.name = name;
    if (image) user.image = image;

    await user.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Profile updated successfully',
      user: { name: user.name, image: user.image }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

/**
 * PATH: /api/user/password
 * DESC: Securely rotate user credentials
 */
export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const { currentPassword, newPassword } = await req.json();

    await connectDB();
    const user = await User.findById(session.user.id).select('+password');
    if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return NextResponse.json({ success: false, message: 'Current password incorrect' }, { status: 400 });

    // Hash and save new password
    // (User model pre-save hook will handle hashing if we update the field)
    user.password = newPassword; 
    await user.save();

    return NextResponse.json({ success: true, message: 'Password rotated successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
