
import React from 'react';
import { PlusIcon } from './icons';

interface HeaderProps {
  onAddBetClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddBetClick }) => {
  return (
    <header className="flex items-center justify-between mb-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
        Bet<span className="text-accent">Manager</span>
      </h1>
      <button
        onClick={onAddBetClick}
        className="flex items-center gap-2 px-4 py-2 bg-accent text-white font-semibold rounded-lg shadow-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-75 transition-transform transform hover:scale-105"
      >
        <PlusIcon />
        <span className="hidden sm:inline">Nueva Apuesta</span>
      </button>
    </header>
  );
};

export default Header;