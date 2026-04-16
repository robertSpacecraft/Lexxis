import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router/AppRouter';
import ThemeToggle from './components/ThemeToggle';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <ThemeToggle />
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
