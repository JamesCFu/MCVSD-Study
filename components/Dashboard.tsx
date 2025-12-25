
import React from 'react';
import { UserStats, Category } from '../types';

interface DashboardProps {
  stats: UserStats;
  onStartPractice: (cat: Category) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, onStartPractice }) => {
  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Welcome Back, Scholar!</h2>
        <p className="text-slate-500 mt-1 font-medium italic">"The only limit to our realization of tomorrow will be our doubts of today."</p>
      </header>

      {/* Mock Test Hero Section */}
      <div className="relative overflow-hidden bg-indigo-600 rounded-3xl p-8 mb-12 shadow-xl shadow-indigo-200 text-white">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <h3 className="text-2xl font-bold mb-2">Ready for the Big Day?</h3>
            <p className="text-indigo-100 mb-6 leading-relaxed">
              Take a comprehensive 6-question simulation covering Reading, Grammar, Vocab, and Math. 
              Our AI creates a unique exam every time to challenge your limits.
            </p>
            <button 
              onClick={() => onStartPractice(Category.MOCK)}
              className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-xl hover:bg-indigo-50 transition transform hover:-translate-y-1 active:translate-y-0 shadow-lg"
            >
              Start Full Mock Test
            </button>
          </div>
          <div className="hidden lg:block">
            <div className="w-32 h-32 bg-indigo-500/30 rounded-full flex items-center justify-center border-4 border-white/20">
              <svg className="w-16 h-16 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            </div>
          </div>
        </div>
        {/* Decorative Circles */}
        <div className="absolute top-[-20px] right-[-20px] w-64 h-64 bg-white/5 rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-40px] left-[20%] w-32 h-32 bg-indigo-400/10 rounded-full pointer-events-none"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
          </div>
          <div>
            <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">Total Answered</div>
            <div className="text-2xl font-bold text-slate-800">{stats.questionsAnswered}</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div>
            <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">Average Accuracy</div>
            <div className="text-2xl font-bold text-slate-800">{Math.round(stats.averageScore)}%</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
          </div>
          <div>
            <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">Quizzes Done</div>
            <div className="text-2xl font-bold text-slate-800">{stats.completedQuizzes}</div>
          </div>
        </div>
      </div>

      {/* Category Selection */}
      <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
        <span className="w-1.5 h-6 bg-indigo-600 rounded-full mr-3"></span>
        Subject Breakdown
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.values(Category).filter(c => c !== Category.MOCK).map((cat) => (
          <div key={cat} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-indigo-300 transition group cursor-pointer" onClick={() => onStartPractice(cat)}>
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-lg text-slate-800">{cat}</h4>
              <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full">
                {stats.categoryScores[cat] || 0}% Accuracy
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-6">
              <div 
                className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                style={{ width: `${stats.categoryScores[cat] || 0}%` }}
              ></div>
            </div>
            <button className="text-indigo-600 font-semibold text-sm group-hover:translate-x-1 transition-transform inline-flex items-center">
              Practice Now 
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="9 5l7 7-7 7"></path></svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
