"use client";

import { useState } from "react";
import { themeConfig } from "@/config/theme";
import { petsData } from "@/data/pets";
import PetCard from "@/components/cards/PetCard";
import { Sparkles, ArrowRight, ArrowLeft } from "lucide-react";

const questions = [
    {
        id: "living",
        question: "Where do you live?",
        options: [
            { label: "Small Apartment", value: "apartment" },
            { label: "House with a yard", value: "house" },
        ]
    },
    {
        id: "activity",
        question: "How active are you daily?",
        options: [
            { label: "Chill & Relaxed (0-30 mins)", value: "low" },
            { label: "Very Active (1hr+ walk/run)", value: "high" },
        ]
    },
    {
        id: "experience",
        question: "Have you owned a pet before?",
        options: [
            { label: "Yes, I'm experienced", value: "yes" },
            { label: "No, first timer!", value: "no" },
        ]
    }
];

export default function PetMatchQuiz() {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showResult, setShowResult] = useState(false);

    const handleAnswer = (questionId: string, value: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const nextStep = () => {
        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            setIsAnalyzing(true);
            setTimeout(() => {
                setIsAnalyzing(false);
                setShowResult(true);
            }, 2000);
        }
    };

    const resetQuiz = () => {
        setStep(0);
        setAnswers({});
        setShowResult(false);
    };

    // Simple matching logic
    const matchedPet = answers.living === "apartment" && answers.activity === "low"
        ? petsData.find(p => p.species === "Cat") || petsData[0]
        : petsData.find(p => p.species === "Dog") || petsData[0];

    if (showResult) {
        return (
            <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="inline-flex items-center justify-center p-3 bg-yellow-100 text-yellow-600 rounded-full mb-6">
                    <Sparkles size={32} />
                </div>
                <h2 className="text-3xl font-bold mb-2" style={{ color: themeConfig.colors.primary }}>We found your perfect match!</h2>
                <p className="text-gray-600 mb-8">Based on your lifestyle, this furry friend would be a great addition to your family.</p>

                <div className="max-w-sm mx-auto text-left">
                    <PetCard {...matchedPet} />
                </div>

                <button
                    onClick={resetQuiz}
                    className="mt-8 text-gray-500 hover:text-gray-800 font-medium underline underline-offset-4"
                >
                    Retake Quiz
                </button>
            </div>
        );
    }

    if (isAnalyzing) {
        return (
            <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 mb-4" style={{ borderTopColor: themeConfig.colors.primary }}></div>
                <h3 className="text-xl font-medium" style={{ color: themeConfig.colors.text }}>Analyzing your lifestyle...</h3>
                <p className="text-gray-500 mt-2">Finding the perfect companion from our shelter.</p>
            </div>
        );
    }

    const currentQ = questions[step];

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 relative">
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100 rounded-t-3xl overflow-hidden">
                <div
                    className="h-full transition-all duration-500 ease-out"
                    style={{
                        width: `${((step + 1) / questions.length) * 100}%`,
                        backgroundColor: themeConfig.colors.primary
                    }}
                ></div>
            </div>

            <div className="flex justify-between items-center mb-8">
                <button
                    onClick={() => setStep(step - 1)}
                    disabled={step === 0}
                    className={`p-2 rounded-full transition-colors ${step === 0 ? 'opacity-0 cursor-default' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                    <ArrowLeft size={20} />
                </button>
                <span className="text-sm font-bold text-gray-600 tracking-widest uppercase">
                    Step {step + 1} of {questions.length}
                </span>
                <div className="w-9" /> {/* spacer for alignment */}
            </div>

            <h2 className="text-3xl font-bold text-center mb-10" style={{ color: themeConfig.colors.text }}>
                {currentQ.question}
            </h2>

            <div className="space-y-4 mb-10">
                {currentQ.options.map((opt) => {
                    const isSelected = answers[currentQ.id] === opt.value;
                    return (
                        <button
                            key={opt.value}
                            onClick={() => handleAnswer(currentQ.id, opt.value)}
                            className={`w-full p-5 rounded-xl text-left font-medium text-lg border-2 transition-all duration-200 hover:-translate-y-1 ${isSelected
                                    ? 'shadow-md bg-opacity-5'
                                    : 'border-gray-100 hover:border-gray-300'
                                }`}
                            style={isSelected ? {
                                borderColor: themeConfig.colors.primary,
                                backgroundColor: `${themeConfig.colors.primary}10`,
                                color: themeConfig.colors.primary
                            } : { color: themeConfig.colors.text }}
                        >
                            {opt.label}
                        </button>
                    );
                })}
            </div>

            <button
                onClick={nextStep}
                disabled={!answers[currentQ.id]}
                className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 hover:shadow-lg"
                style={{ backgroundColor: themeConfig.colors.primary }}
            >
                {step === questions.length - 1 ? 'Find My Match' : 'Continue'} <ArrowRight size={20} />
            </button>
        </div>
    );
}
