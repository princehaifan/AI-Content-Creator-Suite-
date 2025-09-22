import React, { useState, useCallback } from 'react';
import { generateHistoricalScript, generateImage } from '../services/geminiService';
import LoadingSpinner from './common/LoadingSpinner';
import ScriptDisplay from './common/ScriptDisplay';
import { Scene } from '../types';

const HistoricalScriptGenerator: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [script, setScript] = useState<Scene[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please enter a historical topic.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setScript(null);

    try {
      // 1. Generate script text first
      const scenes = await generateHistoricalScript(topic);
      setScript(scenes); // Show script text and image placeholders immediately

      // 2. Generate images for each scene
      const imagePromises = scenes.map(scene => generateImage(scene.visual));
      const base64Images = await Promise.all(imagePromises);

      const scenesWithImages = scenes.map((scene, index) => ({
        ...scene,
        imageUrl: `data:image/png;base64,${base64Images[index]}`,
      }));
      
      setScript(scenesWithImages); // Update state with images

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setScript(null); // Clear partial results on error
    } finally {
      setIsLoading(false);
    }
  }, [topic]);

  return (
    <div className="bg-white/40 dark:bg-gray-800/40 p-6 sm:p-8 rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50 backdrop-blur-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-cyan-600 dark:text-cyan-300">Script for Historical Facts</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Create fun and fascinating Instagram Reels about history, with AI-generated visual concepts!
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., The Great Emu War"
          className="flex-grow bg-gray-100 dark:bg-gray-900/70 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors duration-200"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? <LoadingSpinner /> : 'Create Content'}
        </button>
      </form>

      {error && <div className="mt-6 text-center text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/50 p-3 rounded-lg">{error}</div>}

      {isLoading && !script && (
        <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
          <p>Our AI historian is crafting your script...</p>
        </div>
      )}

      {script && <ScriptDisplay script={script} />}
    </div>
  );
};

export default HistoricalScriptGenerator;