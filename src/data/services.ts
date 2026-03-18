export interface Service {
    id: string;
    title: string;
    description: string;
    icon: string;
    image: string;
}

export const servicesData: Service[] = [
    {
        id: "s1",
        title: "Premium Grooming",
        description: "Full service bathing, brushing, nail trimming and styling by certified professionals.",
        icon: "scissors",
        image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: "s2",
        title: "Veterinary Care",
        description: "Routine checkups, vaccinations, and comprehensive medical care for your furry friend.",
        icon: "stethoscope",
        image: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: "s3",
        title: "Pet Boarding",
        description: "Safe, comfortable, and cageless overnight stays and daycare options.",
        icon: "home",
        image: "https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?auto=format&fit=crop&q=80&w=800"
    }
];
