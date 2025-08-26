



import React from 'react';
import ThemeSwitcher from './ThemeSwitcher';

interface HeaderProps {
  title: string;
  currentTheme: 'light' | 'dark';
  onThemeToggle: () => void;
  showBack?: boolean;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, currentTheme, onThemeToggle, showBack, onBack }) => {
  return (
    <header className="bg-background text-card-foreground shadow-md border-b border-border">
      <div className="container mx-auto px-4 md:px-6 py-3.5 flex justify-between items-center">
        <div className="flex items-center space-x-3">
           {showBack && (
             <button 
                onClick={onBack}
                className="p-2 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Go back to lab selection"
             >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                </svg>
             </button>
           )}
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 text-primary hidden sm:block">
             <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" opacity="0.3"/>
             <path fill="currentColor" d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8 8-3.59-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm1-11h-2v4h2V7zm0 6h-2v2h2v-2z"/>
           </svg>
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <ThemeSwitcher currentTheme={currentTheme} onToggle={onThemeToggle} />
        </div>
      </div>
    </header>
  );
};

export default Header;
