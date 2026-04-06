import PetMatchQuiz from '@/components/ui/PetMatchQuiz';
import { themeConfig } from '@/config/theme';

export const metadata = { title: "Find Your Perfect Pet Match" };

export default function QuizPage() {
    return (
        <div className="min-h-screen py-20 relative overflow-hidden" style={{ backgroundColor: themeConfig.colors.background }}>
            {/* Background Decorations */}
            <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

            <div className="relative z-10 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4" style={{ color: themeConfig.colors.primary }}>
                        Pet Matchmaker Quiz
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Take our 30-second lifestyle quiz to discover which of our lovely pets is the absolute perfect match for your home and heart.
                    </p>
                </div>

                <PetMatchQuiz />
            </div>
        </div>
    );
}
