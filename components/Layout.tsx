
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  setActiveView: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-indigo-900 text-white flex flex-col p-6 sticky top-0 h-auto md:h-screen shadow-xl z-10">
        <div className="mb-8 flex items-center space-x-2">
          <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-xl shadow-inner">A</div>
          <h1 className="text-xl font-bold tracking-tight">MCVSD Ace</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setActiveView('dashboard')}
            className={`w-full text-left px-4 py-3 rounded-xl transition flex items-center space-x-3 ${activeView === 'dashboard' ? 'bg-indigo-700 font-medium' : 'hover:bg-indigo-800 text-indigo-200'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            <span>Dashboard</span>
          </button>

          <div className="pt-4 pb-2 text-[10px] font-bold text-indigo-400 uppercase tracking-widest px-4">Subject Prep</div>
          
          <button 
            onClick={() => setActiveView('reading')}
            className={`w-full text-left px-4 py-3 rounded-xl transition ${activeView === 'reading' ? 'bg-indigo-700 font-medium' : 'hover:bg-indigo-800 text-indigo-200'}`}
          >
            Reading Prep
          </button>
          <button 
            onClick={() => setActiveView('vocab')}
            className={`w-full text-left px-4 py-3 rounded-xl transition ${activeView === 'vocab' ? 'bg-indigo-700 font-medium' : 'hover:bg-indigo-800 text-indigo-200'}`}
          >
            Vocabulary
          </button>
          <button 
            onClick={() => setActiveView('grammar')}
            className={`w-full text-left px-4 py-3 rounded-xl transition ${activeView === 'grammar' ? 'bg-indigo-700 font-medium' : 'hover:bg-indigo-800 text-indigo-200'}`}
          >
            Grammar
          </button>
          <button 
            onClick={() => setActiveView('math')}
            className={`w-full text-left px-4 py-3 rounded-xl transition ${activeView === 'math' ? 'bg-indigo-700 font-medium' : 'hover:bg-indigo-800 text-indigo-200'}`}
          >
            Math Basics
          </button>

          <div className="pt-6 pb-2 text-[10px] font-bold text-indigo-400 uppercase tracking-widest px-4">Exam Simulator</div>
          
          <button 
            onClick={() => setActiveView('mock')}
            className={`w-full text-left px-4 py-3 rounded-xl transition flex items-center space-x-3 ${activeView === 'mock' ? 'bg-emerald-600 font-medium text-white shadow-lg' : 'hover:bg-emerald-800 text-emerald-100 border border-emerald-800/50'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
            <span>Full Mock Test</span>
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-indigo-800">
          <div className="text-xs text-indigo-300 uppercase font-semibold mb-2">Test Info</div>
          <p className="text-[11px] text-indigo-200 leading-relaxed">The MCVSD exam typically lasts around 2 hours. This app uses AI to simulate that rigor.</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 bg-slate-50 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
