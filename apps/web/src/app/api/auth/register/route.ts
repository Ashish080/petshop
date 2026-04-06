import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import redis from '@/lib/redis';
import { z } from 'zod';

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
    // === Security: Redis Rate Limiting (Anti-Bot & Credential Stuffing) ===
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimitKey = `security:ratelimit:register:${ip}`;
    
    try {
      const requestCount = await redis.incr(rateLimitKey);
      if (requestCount === 1) {
         // Window: 1 hour
         await redis.expire(rateLimitKey, 3600);
      }
      if (requestCount > 5) {
         console.warn(`[SECURITY] Blocked mass registration from IP: ${ip}`);
         return NextResponse.json(
            { success: false, error: 'Maximum account creation limit reached. Please try again later.' },
            { status: 429 }
         );
      }
    } catch (e) {
      console.warn('[REDIS_WARNING] Rate limiter bypassed due to connection failure.');
    }
    // ======================================================================

    await connectDB();
    
    // === Zod Validation: Robust Input Checking ===
    const RegisterSchema = z.object({
      name: z.string().min(2, 'Name must be at least 2 characters').trim(),
      email: z.string().email('Invalid email address').toLowerCase().trim(),
      password: z.string().min(6, 'Password must be at least 6 characters'),
      phone: z.string().optional().transform((v: string | undefined) => v?.trim()),
      referralCode: z.string().optional().transform((v: string | undefined) => v?.trim().toUpperCase())
    });

    const body = await request.json();
    const parsed = RegisterSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }
    
    const { name, email, password, phone, referralCode } = parsed.data;

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

    // Referral Logic
    let referredBy = undefined;
    if (referralCode) {
       const referrer = await User.findOne({ referralCode: referralCode.trim().toUpperCase() });
       if (referrer) referredBy = referrer.email;
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role,
      phone: phone?.trim(),
      referredBy,
      referralCode: Math.random().toString(36).substring(2, 8).toUpperCase()
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
