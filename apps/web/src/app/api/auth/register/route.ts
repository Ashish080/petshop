import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';

/**
 * FIXED: Security Loophole - Registering as Rider/Admin
 * 
 * CRITICAL FIX: 
 * 1. Hardcoded role to 'user' for all public registrations.
 * 2. Rider/Admin creation must be handled by an existing Admin in a protected route, 
 *    or via a secure invitation token system.
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { name, email, password, phone } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // SECURITY FIX: Do not allow standard registration to specify role.
    // Admin setup should happen via environment variables or direct DB seed.
    const adminEmail = process.env.ADMIN_EMAIL;
    const role = (adminEmail && email.toLowerCase() === adminEmail.toLowerCase()) ? 'admin' : 'user';

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role,
      phone: phone?.trim()
    });

    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role
      }
    }, { status: 201 });
  } catch (error) {
    console.error('[REGISTER_ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Server error during registration' },
      { status: 500 }
    );
  }
}
