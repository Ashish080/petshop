export interface Product {
    id: string;
    name: string;
    category: 'Food' | 'Accessories' | 'Toys' | 'Grooming';
    price: number;
    originalPrice?: number;
    rating: number;
    reviews: number;
    image: string;
    description: string;
    isBestSeller: boolean;
}

export const productsData: Product[] = [
    {
        id: "pr1",
        name: "Premium Adult Dog Food - Salmon & Sweet Potato",
        category: "Food",
        price: 45.99,
        originalPrice: 55.00,
        rating: 4.8,
        reviews: 124,
        image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&q=80&w=800",
        description: "High-protein, grain-free adult dog food formulated for optimal health.",
        isBestSeller: true
    },
    {
        id: "pr2",
        name: "Luxury Orthopedic Pet Bed",
        category: "Accessories",
        price: 89.99,
        rating: 4.9,
        reviews: 86,
        image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=800",
        description: "Memory foam pet bed providing joint relief and deep sleep support.",
        isBestSeller: true
    },
    {
        id: "pr3",
        name: "Interactive Puzzle Toy for Dogs",
        category: "Toys",
        price: 24.50,
        rating: 4.5,
        reviews: 56,
        image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=800",
        description: "Mental stimulation toy designed to keep your dog engaged.",
        isBestSeller: false
    },
    {
        id: "pr4",
        name: "Organic Catnip Blend",
        category: "Toys",
        price: 12.00,
        rating: 4.7,
        reviews: 210,
        image: "https://images.unsplash.com/photo-1615555122904-e538f9026be1?auto=format&fit=crop&q=80&w=800",
        description: "100% organic, highly potent catnip for endless kitty entertainment.",
        isBestSeller: true
    }
];
