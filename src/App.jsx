import React, { useContext } from 'react';
import Home from './components/Home';
import { ThemeContext } from './contexts/ThemeContext';

const App = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-200 dark:bg-gray-900 py-8 px-4 relative'>
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-md bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
      >
        {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      </button>
      <div className='text-center mb-8'>
        <h1 className='text-5xl font-bold text-gray-800 dark:text-gray-100 mb-2'>AI Image Enhancer</h1>
        <p className='text-lg text-gray-500 dark:text-gray-400'>Upload an image and let AI enhance it in seconds.</p>
      </div>
      <Home/>
      <div className='text-lg text-gray-500 dark:text-gray-400 mt-6'>
        Powered by @Learning-On-Peak
      </div>
    </div>
  );
};

export default App;