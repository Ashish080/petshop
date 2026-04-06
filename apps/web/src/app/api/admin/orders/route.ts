import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import { auth } from '@/auth';
import { AdminService } from '@/services/admin.service';
import { ServiceError } from '@/services/base.service';

// PATCH /api/admin/orders - Secure Update and Assignment Logic
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const order = await AdminService.updateOrder(body);

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order updated successfully'
    });
  } catch (error: any) {
    console.error('[ADMIN_ORDER_PATCH_ERROR]', error);
    if (error instanceof ServiceError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

// GET /api/admin/orders - Optimized Querying with Pagination
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const data = await AdminService.getOrders({ status, page, limit });

    return NextResponse.json({
      success: true,
      data: data.orders,
      pagination: {
        total: data.total,
        page: data.page,
        limit: data.limit,
        pages: data.pages
      }
    });
  } catch (error) {
    console.error('[ADMIN_ORDER_GET_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
  }
}
