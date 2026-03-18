export interface Pet {
    id: string;
    name: string;
    breed: string;
    age: string;
    gender: 'Male' | 'Female';
    health: string;
    vaccinationBadge: boolean;
    image: string;
    description: string;
}

export const petsData: Pet[] = [
    {
        id: "p1",
        name: "Max",
        breed: "Golden Retriever",
        age: "3 Months",
        gender: "Male",
        health: "Excellent",
        vaccinationBadge: true,
        image: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=800",
        description: "Friendly and energetic Golden Retriever puppy looking for a loving home."
    },
    {
        id: "p2",
        name: "Luna",
        breed: "Persian Cat",
        age: "1 Year",
        gender: "Female",
        health: "Good",
        vaccinationBadge: true,
        image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&q=80&w=800",
        description: "Gentle and affectionate Persian cat, perfect for a quiet household."
    },
    {
        id: "p3",
        name: "Bella",
        breed: "French Bulldog",
        age: "6 Months",
        gender: "Female",
        health: "Excellent",
        vaccinationBadge: true,
        image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=800",
        description: "Playful and smart Frenchie with a wonderful temperament."
    },
    {
        id: "p4",
        name: "Milo",
        breed: "Beagle",
        age: "4 Months",
        gender: "Male",
        health: "Excellent",
        vaccinationBadge: false,
        image: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=800",
        description: "Curious and friendly Beagle pup who loves to explore."
    }
];
