
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Practice from './components/Practice';
import { Category, UserStats } from './types';

const INITIAL_STATS: UserStats = {
  completedQuizzes: 0,
  averageScore: 0,
  categoryScores: {
    [Category.READING]: 0,
    [Category.VOCABULARY]: 0,
    [Category.GRAMMAR]: 0,
    [Category.MATH]: 0,
    [Category.MOCK]: 0,
  },
  questionsAnswered: 0,
};

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [currentPracticeCategory, setCurrentPracticeCategory] = useState<Category | null>(null);

  // Load stats from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mcvsd-stats');
    if (saved) {
      setStats(JSON.parse(saved));
    }
  }, []);

  const saveStats = (newStats: UserStats) => {
    setStats(newStats);
    localStorage.setItem('mcvsd-stats', JSON.stringify(newStats));
  };

  const handleFinishPractice = (score: number, total: number) => {
    if (!currentPracticeCategory) return;

    const accuracy = (score / total) * 100;
    const newStats = { ...stats };
    
    // Update individual score for the category practiced
    const currentScore = newStats.categoryScores[currentPracticeCategory] || 0;
    newStats.categoryScores[currentPracticeCategory] = currentScore === 0 ? Math.round(accuracy) : Math.round((currentScore + accuracy) / 2);
    
    newStats.completedQuizzes += 1;
    newStats.questionsAnswered += total;
    
    // Overall average calculation (ignoring MOCK as a standalone subject, or including it based on preference)
    // Here we include everything that has been attempted
    const values = Object.values(newStats.categoryScores) as number[];
    const allScores = values.filter((s: number) => s > 0);
    newStats.averageScore = allScores.length > 0 
      ? Math.round(allScores.reduce((a: number, b: number) => a + b, 0) / allScores.length) 
      : 0;

    saveStats(newStats);
    setActiveView('dashboard');
    setCurrentPracticeCategory(null);
  };

  const startPractice = (cat: Category) => {
    setCurrentPracticeCategory(cat);
    setActiveView('practice');
  };

  // Map view string to Category
  useEffect(() => {
    if (activeView === 'reading') startPractice(Category.READING);
    if (activeView === 'vocab') startPractice(Category.VOCABULARY);
    if (activeView === 'grammar') startPractice(Category.GRAMMAR);
    if (activeView === 'math') startPractice(Category.MATH);
    if (activeView === 'mock') startPractice(Category.MOCK);
  }, [activeView]);

  return (
    <Layout activeView={activeView} setActiveView={setActiveView}>
      {activeView === 'dashboard' && (
        <Dashboard stats={stats} onStartPractice={startPractice} />
      )}
      
      {activeView === 'practice' && currentPracticeCategory && (
        <Practice 
          category={currentPracticeCategory} 
          onFinish={handleFinishPractice}
          onExit={() => {
            setActiveView('dashboard');
            setCurrentPracticeCategory(null);
          }}
        />
      )}
    </Layout>
  );
};

export default App;
