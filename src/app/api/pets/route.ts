import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Pet from '@/models/Pet';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    
    const species = searchParams.get('species');
    const breed = searchParams.get('breed');
    const gender = searchParams.get('gender');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    
    const query: any = { isActive: true };
    
    if (species && species !== 'All') query.species = species;
    if (gender && gender !== 'All') query.gender = gender;
    if (featured === 'true') query.isFeatured = true;
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { breed: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const pets = await Pet.find(query).sort({ createdAt: -1 }).lean();
    
    return NextResponse.json({
      success: true,
      data: pets
    });
  } catch (error) {
    console.error('Error fetching pets:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch pets' }, { status: 500 });
  }
}
