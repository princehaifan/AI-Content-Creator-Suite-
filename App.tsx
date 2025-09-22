import React, { useState, useEffect } from 'react';
import FeatureToggle from './components/FeatureToggle';
import HistoricalScriptGenerator from './components/HistoricalScriptGenerator';
import HiddenFactFinder from './components/HiddenFactFinder';
import ThemeToggle from './components/ThemeToggle';
import { Feature } from './types';

type Theme = 'light' | 'dark';

function App() {
  const [activeFeature, setActiveFeature] = useState<Feature>(Feature.Script);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme) return savedTheme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      document.body.style.backgroundColor = '#030712'; // gray-950 for dark
    } else {
      root.classList.remove('dark');
      document.body.style.backgroundColor = '#f9fafb'; // gray-50 for light
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="w-full max-w-4xl mx-auto">
        <header className="flex justify-between items-start mb-8">
          <div className="text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
              AI Content Creator Suite
            </h1>
            <p className="text-md text-gray-500 dark:text-gray-400 mt-1">
              Your personal assistant for crafting amazing content.
            </p>
          </div>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </header>

        <main>
          <FeatureToggle activeFeature={activeFeature} setActiveFeature={setActiveFeature} />
          <div className="mt-8">
            {activeFeature === Feature.Script ? <HistoricalScriptGenerator /> : <HiddenFactFinder />}
          </div>
        </main>
        
        <footer className="text-center mt-12 text-gray-500 dark:text-gray-400 text-sm">
            <p className="mb-2">Powered by Gemini API</p>
            <p className="font-semibold">The app is built by the developer</p>
            <p className="text-md font-bold text-gray-600 dark:text-gray-300 mt-1">Aminu Musa Ambursa</p>
            <p>Software and AI Developer</p>
        </footer>
      </div>
    </div>
  );
}

export default App;