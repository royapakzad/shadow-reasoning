import React, { useState, useEffect } from 'react';
import { Theme } from './types/index';
import { 
    THEME_KEY, APP_TITLE
} from './constants/index';
import * as config from './env.js'; // Import API keys from env.js
import Header from './components/Header';
import ApiKeyWarning from './components/ApiKeyWarning';
import ShadowReasoningLab from './components/BilingualSteeringLab';

const App: React.FC = () => {
  // Core App State
  const [theme, setTheme] = useState<Theme>('light');
  const [isAnyApiKeyMissingOrPlaceholder, setIsAnyApiKeyMissingOrPlaceholder] = useState<boolean>(false);

  // Check for API Keys on mount
  useEffect(() => {
    const togetherKeyMissing = !config.TOGETHER_API_KEY || (config.TOGETHER_API_KEY as string) === "YOUR_TOGETHER_AI_KEY_HERE";
    
    if (togetherKeyMissing) {
      setIsAnyApiKeyMissingOrPlaceholder(true);
      console.warn("The Together.ai API key is not defined or is a placeholder in env.js. The model may be unavailable.");
    } else {
      setIsAnyApiKeyMissingOrPlaceholder(false);
    }
  }, []);
  
  // Theme management
  useEffect(() => {
    let initialTheme: Theme = 'light';
    try {
      const storedTheme = localStorage.getItem(THEME_KEY) as Theme | null;
      if (storedTheme) initialTheme = storedTheme;
      else initialTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch (e) {
      console.warn('Could not access localStorage or matchMedia for theme.', e);
    }
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      console.warn('Failed to save theme to localStorage:', e);
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {isAnyApiKeyMissingOrPlaceholder && <ApiKeyWarning />}
      <Header 
        title={APP_TITLE} 
        currentTheme={theme} 
        onThemeToggle={toggleTheme}
      />
      
      <main className="flex-grow container mx-auto p-4 sm:p-6 md:p-8" aria-live="polite">
        <ShadowReasoningLab />
      </main>

      <footer className="text-center py-6 border-t border-border text-xs text-muted-foreground">
        LLM Evaluation Labs &copy; {new Date().getFullYear()}. For research and educational purposes.
      </footer>
    </div>
  );
};

export default App;