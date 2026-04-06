import PetMatchQuiz from '@/components/ui/PetMatchQuiz';

export const metadata = { title: "Find Your Perfect Pet Match" };

export default function QuizPage() {
    return (
        <div className="min-h-screen py-20 relative overflow-hidden bg-bg-primary">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-warning/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-success/15 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 container-app">
                <div className="text-center mb-12">
                    <h1 className="text-h1 text-brand mb-4">
                        Pet Matchmaker Quiz
                    </h1>
                    <p className="text-body-lg max-w-2xl mx-auto">
                        Take our 30-second lifestyle quiz to discover which of our lovely pets is the absolute perfect match for your home and heart.
                    </p>
                </div>

                <PetMatchQuiz />
            </div>
        </div>
    );
}
