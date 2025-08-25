
import React from 'react';
import * as config from '../env.js'; // Import API keys from env.js

interface ApiKeyStatus {
  provider: string;
  keyNameDisplay: string; // For display purposes, e.g., "env.js (API_KEY)"
  isSet: boolean;
  isPlaceholder: boolean;
}

const ApiKeyWarning: React.FC = () => {
  // Developer note: The type assertion `as string` is used here because the config object
  // from env.js can have values that are undefined if the file is incomplete.
  // This is a controlled and expected case within this component.
  const apiKeyStatuses: ApiKeyStatus[] = [
    {
      provider: 'Together.ai',
      keyNameDisplay: `env.js (TOGETHER_API_KEY)`,
      isSet: !!config.TOGETHER_API_KEY,
      isPlaceholder: (config.TOGETHER_API_KEY as string) === "YOUR_TOGETHER_AI_KEY_HERE"
    }
  ];

  // This check is redundant as the parent component (`App.tsx`) already handles conditional rendering.
  const anyKeyMissingOrPlaceholder = apiKeyStatuses.some(status => !status.isSet || status.isPlaceholder);

  if (!anyKeyMissingOrPlaceholder) {
    return null; 
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" role="alertdialog" aria-modal="true" aria-labelledby="api-key-warning-title">
      <div className="bg-red-100 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-600 text-red-700 dark:text-red-300 p-6 rounded-lg shadow-xl max-w-lg text-center">
        <div className="flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          <h2 id="api-key-warning-title" className="text-2xl font-bold">API Key Configuration Issue</h2>
        </div>
        <p className="mb-3">
          The API key required for model functionality is not correctly configured in <code>env.js</code>:
        </p>
        <ul className="list-none mb-4 space-y-1 text-left mx-auto max-w-sm">
          {apiKeyStatuses.map(status => (
            <li 
              key={status.provider} 
              className={`p-2 rounded text-sm ${status.isSet && !status.isPlaceholder ? 'bg-green-100 text-green-700 dark:bg-green-800/40 dark:text-green-300' : 'bg-red-200 text-red-800 dark:bg-red-800/40 dark:text-red-300'}`}
            >
              <strong>{status.provider}:</strong> <code>{status.keyNameDisplay}</code>{' - '}
              {!status.isSet ? 'Missing' : status.isPlaceholder ? 'Placeholder' : 'Configured'}
            </li>
          ))}
        </ul>
        <p className="mb-2">
          The model will be unavailable or cause errors until the API key is configured.
        </p>
        <p className="text-sm">
          Please create or update the <code>env.js</code> file in your project root with your actual API key.
          This file should not be committed to version control if it contains a real key.
        </p>
      </div>
    </div>
  );
};

export default ApiKeyWarning;