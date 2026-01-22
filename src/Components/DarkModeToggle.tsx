import { useTheme } from '../contexts/ThemeContext';
import { HiMoon, HiSun } from 'react-icons/hi';

interface DarkModeToggleProps {
  variant?: 'default' | 'sidebar';
}

const DarkModeToggle = ({ variant = 'default' }: DarkModeToggleProps) => {
  const { theme, toggleTheme } = useTheme();

  const baseClasses = "p-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#175AFF] focus:ring-offset-2";
  const defaultClasses = "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800";
  const sidebarClasses = "text-white hover:bg-white/20";

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/27854340-36c4-4bf8-85c2-d8dd5a462d1b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'DarkModeToggle.tsx:15',message:'Button clicked',data:{currentTheme:theme,hasDarkClass:document.documentElement.classList.contains('dark')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    e.preventDefault();
    e.stopPropagation();
    toggleTheme();
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/27854340-36c4-4bf8-85c2-d8dd5a462d1b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'DarkModeToggle.tsx:20',message:'After toggleTheme call',data:{currentTheme:theme,hasDarkClass:document.documentElement.classList.contains('dark')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className={`${baseClasses} ${variant === 'sidebar' ? sidebarClasses : defaultClasses}`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <HiMoon className="w-6 h-6" />
      ) : (
        <HiSun className="w-6 h-6" />
      )}
    </button>
  );
};

export default DarkModeToggle;
