'use client';

import { useState } from 'react';
import { petsData } from '@/data/pets';
import PetCard from '@/components/cards/PetCard';
import { Sparkles, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { motionPresets } from '@/lib/motion';

const questions = [
  {
    id: 'living',
    question: 'Where do you live?',
    options: [
      { label: 'Small Apartment', value: 'apartment' },
      { label: 'House with a yard', value: 'house' },
    ],
  },
  {
    id: 'activity',
    question: 'How active are you daily?',
    options: [
      { label: 'Chill & Relaxed (0-30 mins)', value: 'low' },
      { label: 'Very Active (1hr+ walk/run)', value: 'high' },
    ],
  },
  {
    id: 'experience',
    question: 'Have you owned a pet before?',
    options: [
      { label: 'Yes, I\'m experienced', value: 'yes' },
      { label: 'No, first timer!', value: 'no' },
    ],
  },
];

export default function PetMatchQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
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
  const matchedPet =
    answers.living === 'apartment' && answers.activity === 'low'
      ? petsData.find((p) => p.species === 'Cat') || petsData[0]
      : petsData.find((p) => p.species === 'Dog') || petsData[0];

  if (showResult) {
    return (
      <motion.div
        {...motionPresets.fadeUp}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center p-4 bg-brand-muted text-brand rounded-full mb-6">
          <Sparkles size={32} />
        </div>
        <h2 className="text-h2 text-text-primary mb-2">We found your perfect match!</h2>
        <p className="text-body text-text-secondary mb-8">
          Based on your lifestyle, this furry friend would be a great addition to your family.
        </p>

        <div className="max-w-sm mx-auto text-left">
          <PetCard {...matchedPet} />
        </div>

        <Button
          variant="ghost"
          onClick={resetQuiz}
          className="mt-8 text-text-tertiary hover:text-text-primary"
        >
          Retake Quiz
        </Button>
      </motion.div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="text-center py-20">
        <Loader2 className="inline-block h-12 w-12 text-brand animate-spin mb-4" />
        <h3 className="text-h3 text-text-primary">Analyzing your lifestyle...</h3>
        <p className="text-body-sm text-text-tertiary mt-2">Finding the perfect companion from our shelter.</p>
      </div>
    );
  }

  const currentQ = questions[step];

  return (
    <div className="max-w-2xl mx-auto bg-bg-tertiary p-8 md:p-12 rounded-[--radius-xl] border border-border shadow-md relative overflow-hidden">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-bg-secondary overflow-hidden">
        <motion.div
          className="h-full bg-brand"
          initial={{ width: 0 }}
          animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => setStep(step - 1)}
          disabled={step === 0}
          className={`p-2 rounded-full transition-colors ${
            step === 0 ? 'opacity-0 cursor-default' : 'hover:bg-bg-secondary text-text-secondary'
          }`}
        >
          <ArrowLeft size={20} />
        </button>
        <span className="text-overline">
          Step {step + 1} of {questions.length}
        </span>
        <div className="w-9" />
      </div>

      <h2 className="text-h2 text-text-primary text-center mb-10">
        {currentQ.question}
      </h2>

      <div className="space-y-4 mb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ.id}
            {...motionPresets.fade}
            className="space-y-4"
          >
            {currentQ.options.map((opt) => {
              const isSelected = answers[currentQ.id] === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleAnswer(currentQ.id, opt.value)}
                  className={`w-full p-5 rounded-[--radius-lg] text-left font-semibold text-body-lg border-2 transition-all duration-200 hover:-translate-y-1 ${
                    isSelected
                      ? 'border-brand bg-brand-muted text-brand shadow-sm'
                      : 'border-border bg-bg-primary text-text-primary hover:border-border-hover'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      <Button
        onClick={nextStep}
        disabled={!answers[currentQ.id]}
        size="lg"
        fullWidth
        iconRight={<ArrowRight size={20} />}
      >
        {step === questions.length - 1 ? 'Find My Match' : 'Continue'}
      </Button>
    </div>
  );
}
