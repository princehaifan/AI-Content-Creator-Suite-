import React from 'react';
import { Scene } from '../../types';
import LoadingSpinner from './LoadingSpinner';

interface ScriptDisplayProps {
  script: Scene[];
}

const ImagePlaceholder: React.FC = () => (
    <div className="aspect-[9/16] w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-600 dark:text-gray-400">
            <LoadingSpinner />
            <p className="mt-2 text-sm">Generating visual...</p>
        </div>
    </div>
);

const ScriptDisplay: React.FC<ScriptDisplayProps> = ({ script }) => {
  return (
    <div className="mt-8 bg-white/20 dark:bg-gray-900/50 p-4 sm:p-6 rounded-lg border border-white/20 dark:border-gray-700">
      <h3 className="text-xl font-semibold mb-6 text-center text-cyan-600 dark:text-cyan-300">Your Instagram Reel Script</h3>
      <div className="space-y-8">
        {script.map((scene, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start bg-gray-100/30 dark:bg-gray-800/40 p-4 rounded-lg transition-shadow duration-300 hover:shadow-xl">
            <div className="md:col-span-1">
                {scene.imageUrl ? (
                    <img src={scene.imageUrl} alt={scene.visual} className="w-full rounded-lg shadow-lg object-cover aspect-[9/16]" />
                ) : (
                    <ImagePlaceholder />
                )}
            </div>
            <div className="md:col-span-2">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 border-b border-gray-300 dark:border-gray-700 pb-2">Scene {index + 1}</h4>
              <p className="mt-1">
                <span className="font-bold text-cyan-700 dark:text-cyan-300 block mb-1">Visual:</span>
                <span className="text-gray-700 dark:text-gray-300">{scene.visual}</span>
              </p>
              <p className="mt-4">
                <span className="font-bold text-blue-700 dark:text-blue-300 block mb-1">Voiceover:</span>
                <span className="text-gray-800 dark:text-gray-200 italic">"{scene.voiceover}"</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScriptDisplay;