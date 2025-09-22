import React, { useState, useCallback } from 'react';
import { findHiddenFacts } from '../services/geminiService';
import { LANGUAGES } from '../constants';
import LoadingSpinner from './common/LoadingSpinner';

const HiddenFactFinder: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [numFacts, setNumFacts] = useState<number>(5);
  const [language, setLanguage] = useState<string>('English');
  const [facts, setFacts] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please enter a keyword or topic.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setFacts(null);

    try {
      const result = await findHiddenFacts(topic, numFacts, language);
      setFacts(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [topic, numFacts, language]);

  return (
    <div className="bg-white/40 dark:bg-gray-800/40 p-6 sm:p-8 rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50 backdrop-blur-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-300">Hidden Fact Finder</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Discover a list of surprising, randomized facts about any topic, in your chosen language.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="topic" className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
            ❓ Enter your keyword here
          </label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., The Ocean"
            className="bg-gray-100 dark:bg-gray-900/70 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200"
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="numFacts" className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
              🕵️‍♂️ How many Facts?
            </label>
            <input
              id="numFacts"
              type="number"
              min="1"
              max="20"
              value={numFacts}
              onChange={(e) => setNumFacts(parseInt(e.target.value, 10))}
              className="bg-gray-100 dark:bg-gray-900/70 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="language" className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
              🌐 Language
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-gray-100 dark:bg-gray-900/70 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200"
            >
              {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-indigo-700 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? <LoadingSpinner /> : 'Find Facts'}
        </button>
      </form>

      {error && <div className="mt-6 text-center text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/50 p-3 rounded-lg">{error}</div>}
      
      {isLoading && (
        <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
          <p>Our AI is scouring the archives for hidden gems...</p>
        </div>
      )}

      {facts && !isLoading && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-center text-purple-600 dark:text-purple-300">Surprising Facts about {topic}</h3>
          <ul className="space-y-3 list-decimal list-inside bg-gray-100 dark:bg-gray-900/50 p-4 rounded-lg">
            {facts.map((fact, index) => (
              <li key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed pl-2">{fact}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HiddenFactFinder;