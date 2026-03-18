export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    date: string;
    image: string;
    category: string;
}

export const blogData: BlogPost[] = [
    {
        id: "b1",
        title: "10 Essential Tips for First-Time Dog Owners",
        excerpt: "Bringing a new puppy home is exciting, but it comes with responsibilities. Here's what you need to know.",
        date: "October 12, 2026",
        image: "https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80&w=800",
        category: "Guides"
    },
    {
        id: "b2",
        title: "Understanding Your Cat's Body Language",
        excerpt: "Ever wonder what your cat is trying to tell you? Decode their ears, tail, and purrs with our guide.",
        date: "September 28, 2026",
        image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800",
        category: "Behavior"
    },
    {
        id: "b3",
        title: "Best Indoor Toys for Active Pets",
        excerpt: "Keep your pets entertained during rainy days with our top picks for interactive indoor toys.",
        date: "September 15, 2026",
        image: "https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&q=80&w=800",
        category: "Products"
    }
];
