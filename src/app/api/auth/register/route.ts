import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { name, email, password, phone, role: requestedRole } = await request.json();

    // Validation
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

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Determine target role
    const adminEmail = process.env.ADMIN_EMAIL;
    let role = 'user';
    
    if (adminEmail && email.toLowerCase() === adminEmail.toLowerCase()) {
      role = 'admin';
    } else if (requestedRole === 'rider') {
      role = 'rider';
    } else if (requestedRole === 'admin') {
      // Only allow admin via email match for security
      role = 'user'; 
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role,
      phone
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
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error during registration' },
      { status: 500 }
    );
  }
}
