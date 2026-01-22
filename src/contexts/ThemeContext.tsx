import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
      // Apply immediately to prevent flash
      const root = document.documentElement;
      if (savedTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      return savedTheme;
    }
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
      return 'dark';
    }
    document.documentElement.classList.remove('dark');
    return 'light';
  });

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/27854340-36c4-4bf8-85c2-d8dd5a462d1b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ThemeContext.tsx:47',message:'useEffect triggered',data:{theme,hasDarkClass:document.documentElement.classList.contains('dark'),classList:Array.from(document.documentElement.classList)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    const root = document.documentElement;
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/27854340-36c4-4bf8-85c2-d8dd5a462d1b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ThemeContext.tsx:50',message:'Before useEffect class manipulation',data:{theme,hasDarkClass:root.classList.contains('dark')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    
    // Toggle dark class based on theme
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/27854340-36c4-4bf8-85c2-d8dd5a462d1b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ThemeContext.tsx:58',message:'After useEffect class manipulation',data:{theme,hasDarkClass:root.classList.contains('dark'),classList:Array.from(root.classList)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    
    // Update localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/27854340-36c4-4bf8-85c2-d8dd5a462d1b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ThemeContext.tsx:61',message:'toggleTheme called',data:{currentTheme:theme},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    const newTheme = theme === 'light' ? 'dark' : 'light';
    const root = document.documentElement;
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/27854340-36c4-4bf8-85c2-d8dd5a462d1b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ThemeContext.tsx:65',message:'Before class manipulation',data:{newTheme,hasDarkClass:root.classList.contains('dark'),classList:Array.from(root.classList)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    // Apply class change immediately before state update
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/27854340-36c4-4bf8-85c2-d8dd5a462d1b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ThemeContext.tsx:72',message:'After class manipulation',data:{newTheme,hasDarkClass:root.classList.contains('dark'),classList:Array.from(root.classList)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    
    // Update state (useEffect will also run to ensure consistency)
    setTheme(newTheme);
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/27854340-36c4-4bf8-85c2-d8dd5a462d1b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ThemeContext.tsx:76',message:'State updated, checking class again',data:{newTheme,hasDarkClass:root.classList.contains('dark'),classList:Array.from(root.classList)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    
    // Update localStorage immediately
    localStorage.setItem('theme', newTheme);
    
    // #region agent log
    setTimeout(() => {
      fetch('http://127.0.0.1:7242/ingest/27854340-36c4-4bf8-85c2-d8dd5a462d1b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ThemeContext.tsx:82',message:'Delayed check after toggle',data:{newTheme,hasDarkClass:document.documentElement.classList.contains('dark'),classList:Array.from(document.documentElement.classList)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    }, 100);
    // #endregion
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
