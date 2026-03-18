export interface FAQ {
    id: string;
    question: string;
    answer: string;
}

export const faqData: FAQ[] = [
    {
        id: "f1",
        question: "Do you offer international shipping?",
        answer: "Currently, we only ship within the domestic US and Canada. We are working on expanding our reach soon!"
    },
    {
        id: "f2",
        question: "What is your return policy?",
        answer: "You can return any unopened and unused product within 14 days of purchase. Just bring the receipt or order confirmation."
    },
    {
        id: "f3",
        question: "Are your grooming services available on weekends?",
        answer: "Yes, our grooming services are available 7 days a week. We recommend booking in advance as weekends get busy quickly."
    },
    {
        id: "f4",
        question: "Do I need to make an appointment to see a vet?",
        answer: "Appointments are preferred to avoid long wait times. However, we do accept walk-ins for minor check-ups."
    }
];
