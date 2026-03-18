export interface Testimonial {
    id: string;
    name: string;
    role: string;
    content: string;
    avatar: string;
    rating: number;
}

export const testimonialsData: Testimonial[] = [
    {
        id: "t1",
        name: "Sarah Jenkins",
        role: "Dog Owner",
        content: "The staff here is incredibly knowledgeable and kind. My Golden Retriever loves coming here for his monthly grooming sessions!",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
        rating: 5
    },
    {
        id: "t2",
        name: "Michael Chen",
        role: "Cat Parent",
        content: "I've been buying all my premium cat food here for over a year. Their recommendations are always spot-on and delivery is super fast.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
        rating: 5
    },
    {
        id: "t3",
        name: "Emily Rodriguez",
        role: "Pet Enthusiast",
        content: "Adopted my Frenchie through their network and couldn't be happier. They provided excellent guidance for a first-time pet owner.",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150",
        rating: 4
    }
];
