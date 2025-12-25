
import React, { useState, useEffect } from 'react';
import { Category, Question } from '../types';
import { generateQuestions, getAITutorFeedback } from '../geminiService';

interface PracticeProps {
  category: Category;
  onFinish: (score: number, total: number) => void;
  onExit: () => void;
}

const Practice: React.FC<PracticeProps> = ({ category, onFinish, onExit }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [tutorMessage, setTutorMessage] = useState<string | null>(null);
  const [sectionResults, setSectionResults] = useState<Record<string, { correct: number, total: number }>>({});

  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      // Mock test is now 20 questions as per service update
      const data = await generateQuestions(category, category === Category.MOCK ? 20 : 5);
      setQuestions(data);
      setLoading(false);
    };
    loadQuestions();
  }, [category]);

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const handleSubmit = async () => {
    if (selectedOption === null) return;
    
    setIsAnswered(true);
    const q = questions[currentIndex];
    const correct = selectedOption === q.correctAnswer;
    
    if (correct) {
      setScore(s => s + 1);
    }

    // Track section performance
    setSectionResults(prev => {
      const current = prev[q.category] || { correct: 0, total: 0 };
      return {
        ...prev,
        [q.category]: {
          correct: current.correct + (correct ? 1 : 0),
          total: current.total + 1
        }
      };
    });

    const msg = await getAITutorFeedback(q, q.options[selectedOption]);
    setTutorMessage(msg);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTutorMessage(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onFinish(score, questions.length);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative mb-8">
          <div className="w-20 h-20 border-8 border-indigo-100 rounded-full"></div>
          <div className="w-20 h-20 border-8 border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <h3 className="text-2xl font-bold text-slate-800">Simulating Exam Environment</h3>
        <p className="text-slate-500 mt-3 text-center max-w-sm">
          Ace is curating a high-difficulty mock test with advanced math and complex reading passages...
        </p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <button onClick={onExit} className="text-slate-500 hover:text-slate-800 flex items-center font-semibold transition group">
          <svg className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Exit Simulation
        </button>
        
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="flex-1 md:w-48 bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 transition-all duration-500 ease-out" 
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          <span className="text-sm font-black text-indigo-700 bg-indigo-50 px-4 py-1.5 rounded-full border-2 border-indigo-100 whitespace-nowrap">
             {currentIndex + 1} / {questions.length}
          </span>
        </div>
      </div>

      {/* Section Indicator */}
      <div className="mb-6 flex items-center space-x-3">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Current Section</span>
        <span className="px-4 py-1 bg-slate-800 text-white rounded-lg text-xs font-bold shadow-sm uppercase tracking-wider">
          {currentQuestion.category}
        </span>
        {currentIndex >= 10 && category === Category.MOCK && (
          <span className="animate-pulse px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-black border border-amber-200">
            MATH SECTION
          </span>
        )}
      </div>

      {/* Passage Area */}
      {currentQuestion.passage && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-8 max-h-[500px] overflow-y-auto leading-relaxed text-slate-700 font-serif text-xl selection:bg-indigo-100">
          <div className="sticky top-0 bg-white/95 backdrop-blur-sm pb-4 mb-6 text-[11px] font-black uppercase tracking-widest text-indigo-600 border-b border-indigo-50 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            Official Reading Passage
          </div>
          <div className="whitespace-pre-wrap">{currentQuestion.passage}</div>
        </div>
      )}

      {/* Question Card */}
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-indigo-900/5 border border-slate-100 transition-all">
        <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-10 leading-[1.3]">{currentQuestion.questionText}</h3>
        
        <div className="grid grid-cols-1 gap-4">
          {currentQuestion.options.map((opt, idx) => {
            let stateClass = "border-slate-100 bg-slate-50 hover:bg-slate-100 hover:border-slate-200";
            let indicatorClass = "bg-slate-200 text-slate-500";

            if (isAnswered) {
              if (idx === currentQuestion.correctAnswer) {
                stateClass = "border-emerald-500 bg-emerald-50 ring-4 ring-emerald-500/10";
                indicatorClass = "bg-emerald-500 text-white";
              } else if (idx === selectedOption) {
                stateClass = "border-red-500 bg-red-50 ring-4 ring-red-500/10";
                indicatorClass = "bg-red-500 text-white";
              } else {
                stateClass = "opacity-40 grayscale-[0.5]";
              }
            } else if (selectedOption === idx) {
              stateClass = "border-indigo-600 bg-indigo-50 ring-4 ring-indigo-600/10 scale-[1.01]";
              indicatorClass = "bg-indigo-600 text-white";
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 flex items-center gap-6 group ${stateClass}`}
              >
                <span className={`w-12 h-12 min-w-[3rem] rounded-xl flex items-center justify-center font-black text-xl shadow-sm transition-all ${indicatorClass}`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="font-bold text-slate-700 text-lg flex-1">{opt}</span>
                {isAnswered && idx === currentQuestion.correctAnswer && (
                  <div className="bg-emerald-500 p-1.5 rounded-full text-white shadow-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {!isAnswered ? (
          <button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className={`w-full mt-12 py-6 rounded-2xl font-black text-xl shadow-2xl transition-all transform active:scale-[0.97] ${selectedOption !== null ? 'bg-indigo-600 text-white shadow-indigo-600/30 cursor-pointer' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
          >
            Submit Final Answer
          </button>
        ) : (
          <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
            {/* AI Explanation */}
            <div className="p-8 bg-slate-900 text-slate-100 rounded-[2rem] relative shadow-2xl overflow-hidden group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-black text-[10px]">ACE</div>
                <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400">Analysis & Insights</span>
              </div>
              <p className="text-lg leading-relaxed text-slate-300 italic font-medium">
                {tutorMessage || "Analyzing performance metrics..."}
              </p>
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all"></div>
            </div>
            
            <button
              onClick={handleNext}
              className="w-full py-6 bg-slate-800 text-white rounded-2xl font-black text-xl hover:bg-slate-900 transition-all flex items-center justify-center gap-3 shadow-xl transform active:scale-[0.97]"
            >
              {isLastQuestion ? 'Complete Simulation' : 'Next Question'}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7-7 7"></path></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Practice;
