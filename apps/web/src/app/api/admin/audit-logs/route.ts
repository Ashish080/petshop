import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import { auth } from '@/auth';
import AuditLog from '@/models/AuditLog';

/**
 * GET /api/admin/audit-logs
 * Fetch paginated administrative audit logs (Admin only)
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const action = searchParams.get('action');
    const targetId = searchParams.get('targetId');

    const query: any = {};
    if (action) query.action = action;
    if (targetId) query.targetId = targetId;

    const skipIdx = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      AuditLog.find(query)
        .sort({ createdAt: -1 })
        .skip(skipIdx)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      data: {
        logs: logs.map((l: any) => ({ ...l, _id: l._id.toString(), id: l._id.toString() })),
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: page,
          limit
        }
      }
    });
  } catch (error) {
    console.error('[ADMIN_AUDIT_LOGS_GET_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
