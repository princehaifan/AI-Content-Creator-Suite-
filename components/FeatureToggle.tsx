import React from 'react';
import { Feature } from '../types';

interface FeatureToggleProps {
  activeFeature: Feature;
  setActiveFeature: (feature: Feature) => void;
}

const FeatureToggle: React.FC<FeatureToggleProps> = ({ activeFeature, setActiveFeature }) => {
  const getButtonClasses = (feature: Feature) => {
    const baseClasses = "flex-1 px-4 py-3 text-sm sm:text-base font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800";
    if (activeFeature === feature) {
      return `${baseClasses} bg-blue-600 text-white shadow-lg focus:ring-blue-500`;
    }
    return `${baseClasses} bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-gray-400`;
  };

  return (
    <div className="flex space-x-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-xl max-w-md mx-auto shadow-inner">
      <button
        onClick={() => setActiveFeature(Feature.Script)}
        className={getButtonClasses(Feature.Script)}
        aria-pressed={activeFeature === Feature.Script}
      >
        📜 Script for Historical Facts
      </button>
      <button
        onClick={() => setActiveFeature(Feature.Facts)}
        className={getButtonClasses(Feature.Facts)}
        aria-pressed={activeFeature === Feature.Facts}
      >
        ❓ Hidden Fact Finder
      </button>
    </div>
  );
};

export default FeatureToggle;