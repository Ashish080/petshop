# Pet Shop Ecommerce Platform

A full-featured ecommerce platform for pet products with inventory management, built with Next.js 16, MongoDB, and Tailwind CSS.

## 🚀 Features

### Customer-Facing Features
- **Product Catalog** - Browse products with filtering and search
- **Product Details** - View product information with variants (size, color, flavor, etc.)
- **Shopping Cart** - Add/remove items with persistent storage
- **Checkout Flow** - Complete checkout with shipping and payment options
- **User Dashboard** - View order history and track orders
- **User Authentication** - Secure login/register with JWT

### Admin Features
- **Admin Dashboard** - Overview with key metrics and stats
- **Product Management** - Add, edit, delete products with variants
- **Inventory Management** - Track stock levels with low-stock alerts
- **Order Management** - View and update order status
- **Stock Tracking** - Automatic stock reduction on order placement

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jose) with HTTP-only cookies
- **Password Hashing**: bcryptjs
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── app/
│   ├── api/                    # API Routes
│   │   ├── auth/               # Authentication endpoints
│   │   ├── products/           # Product CRUD endpoints
│   │   ├── orders/             # Order management endpoints
│   │   └── inventory/          # Inventory management endpoints
│   ├── admin/                  # Admin pages
│   │   ├── login/              # Admin login page
│   │   ├── products/           # Product management
│   │   ├── inventory/          # Inventory management
│   │   └── orders/             # Order management
│   ├── products/               # Product pages
│   │   └── [id]/               # Product detail page
│   ├── cart/                   # Shopping cart page
│   ├── checkout/               # Checkout flow
│   └── dashboard/              # User dashboard
├── components/
│   ├── cards/                  # Card components
│   ├── layout/                 # Layout components (Navbar, Footer)
│   ├── sections/               # Page sections
│   └── ui/                     # UI components
├── context/
│   ├── CartContext.tsx         # Cart state management
│   └── AuthContext.tsx         # Auth state management
├── models/
│   ├── Product.ts              # Product schema
│   ├── Order.ts                # Order schema
│   └── User.ts                 # User schema
├── types/
│   ├── product.ts              # Product TypeScript types
│   ├── order.ts                # Order TypeScript types
│   └── user.ts                 # User TypeScript types
├── lib/
│   ├── db.ts                   # MongoDB connection
│   └── auth.ts                 # Auth utilities
└── config/
    ├── brand.ts                # Brand configuration
    └── theme.ts                # Theme configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   cd pet-shop-test
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env` and update:
   ```env
   MONGODB_URI=mongodb://localhost:27017/petshop
   JWT_SECRET=your-super-secret-jwt-key
   ADMIN_EMAIL=admin@petshop.com
   ADMIN_PASSWORD=admin123
   ```

4. **Seed the database**
   ```bash
   npm run seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   
   Visit [http://localhost:3000](http://localhost:3000)

## 📦 Database Models

### Product Model
```typescript
{
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  variants: [{
    name: string;
    type: 'size' | 'weight' | 'color' | 'flavor';
    options: [{
      value: string;
      priceAdjustment: number;
      stock: number;
    }]
  }];
  rating: number;
  reviews: number;
  isBestSeller: boolean;
  isFeatured: boolean;
  sku: string;
  lowStockThreshold: number;
}
```

### Order Model
```typescript
{
  orderNumber: string;
  user: {
    email: string;
    name?: string;
    phone?: string;
  };
  items: [{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    variant?: { variantName: string; selectedOption: string };
  }];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}
```

### User Model
```typescript
{
  email: string;
  password: string; // Hashed
  name: string;
  role: 'user' | 'admin';
  phone?: string;
  avatar?: string;
  addresses: [{
    isDefault: boolean;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }];
}
```

## 🔐 Default Credentials

### Admin Access
- **Email**: admin@petshop.com
- **Password**: admin123
- **URL**: http://localhost:3000/admin/login

## 🛒 Key Features

### Shopping Cart
- Persistent cart using localStorage
- Add/remove items with quantity controls
- Automatic tax calculation (18% GST)
- Free shipping on orders above ₹5000
- Cart count badge in navbar

### Product Variants
- Support for multiple variant types (size, color, flavor, weight)
- Individual stock tracking per variant option
- Price adjustments based on variant selection
- Out-of-stock handling

### Inventory Management
- Real-time stock tracking
- Low stock alerts (configurable threshold)
- Automatic stock reduction on order placement
- Stock update interface for admins

### Order Management
- Order status tracking (pending → confirmed → processing → shipped → delivered)
- Payment status tracking
- Customer information and shipping address
- Order history for users

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1280px+)
- Tablet (768px - 1279px)
- Mobile (< 768px)

## 🔒 Security Features

- JWT-based authentication with HTTP-only cookies
- Password hashing with bcryptjs
- Protected API routes
- Role-based access control (admin vs user)
- CSRF protection via same-site cookies

## 🚧 Future Enhancements

- [ ] Payment gateway integration (Stripe/Razorpay)
- [ ] Email notifications for orders
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Coupon/discount system
- [ ] Multi-vendor support
- [ ] Analytics dashboard
- [ ] Export orders to CSV/PDF

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders
- `GET /api/orders` - Get orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id` - Update order status (admin only)

### Inventory
- `GET /api/inventory` - Get inventory with low stock alerts (admin only)
- `PUT /api/inventory` - Update stock (admin only)
- `PUT /api/inventory/variant` - Update variant stock (admin only)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Ashish Singh**
- GitHub: [@Ashish080](https://github.com/Ashish080)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- MongoDB for the database
- Lucide for the beautiful icons
