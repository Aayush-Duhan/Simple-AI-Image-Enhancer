import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext'; // ThemeProvider is needed to wrap App

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Helper function to render App with ThemeProvider
const renderApp = () => {
  return render(
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
};

describe('Theme Toggle Functionality', () => {
  beforeEach(() => {
    // Clear localStorage and reset document class before each test
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    // Set default theme to light for consistent testing
    localStorage.setItem('theme', 'light');
  });

  test('renders the theme toggle button', () => {
    renderApp();
    const buttonElement = screen.getByRole('button', { name: /switch to dark mode/i });
    expect(buttonElement).toBeInTheDocument();
  });

  test('clicking the button toggles the theme and button text', () => {
    renderApp();
    const buttonElement = screen.getByRole('button', { name: /switch to dark mode/i });

    // Initial state: light mode
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    // Click to switch to dark mode
    fireEvent.click(buttonElement);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(buttonElement).toHaveTextContent(/switch to light mode/i);
    expect(localStorage.getItem('theme')).toBe('dark');

    // Click to switch back to light mode
    fireEvent.click(buttonElement);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(buttonElement).toHaveTextContent(/switch to dark mode/i);
    expect(localStorage.getItem('theme')).toBe('light');
  });

  test('applies dark mode styles to the App container', () => {
    renderApp();
    const appContainer = screen.getByRole('button', { name: /switch to dark mode/i }).parentElement; // Get the parent div of the button
    
    // Initial state: light mode (bg-gray-200)
    // Note: Testing exact Tailwind classes can be brittle.
    // It's better to test computed styles if possible, but that's more complex.
    // For now, we check for the presence of dark mode specific classes applied by ThemeContext.
    expect(appContainer).toHaveClass('bg-gray-200'); // Light mode background
    expect(appContainer).not.toHaveClass('dark:bg-gray-900'); // Ensure dark mode class for App.jsx div is not misinterpreted as active style

    // Click to switch to dark mode
    const buttonElement = screen.getByRole('button', { name: /switch to dark mode/i });
    fireEvent.click(buttonElement);
    
    // Dark mode (dark:bg-gray-900)
    // The class 'dark:bg-gray-900' is applied, and the 'dark' class on html enables it.
    // We already tested document.documentElement.classList.contains('dark')
    // Here we check if the component has the correct dark mode class defined.
    expect(appContainer).toHaveClass('dark:bg-gray-900');
  });

  test('loads theme from localStorage on initial render', () => {
    localStorage.setItem('theme', 'dark'); // Set initial theme to dark in localStorage
    
    // Re-render the app
    const { getByRole, unmount } = render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );
    
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    const buttonElement = getByRole('button', { name: /switch to light mode/i });
    expect(buttonElement).toBeInTheDocument();

    // Clean up
    unmount(); // Unmount to allow beforeEach to reset correctly for subsequent tests
  });
});
