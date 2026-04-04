import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/mongoose';
import Product from '@/models/Product';
import { AdminProductsClient } from '@/components/admin/AdminProductsClient';

export default async function AdminProductsPage() {
  const session = await auth();
  if (session?.user?.role !== 'admin') redirect('/auth/login');

  await connectDB();
  const products = await Product.find({}).sort({ createdAt: -1 }).lean();

  return <AdminProductsClient initialProducts={JSON.parse(JSON.stringify(products))} />;
}
