import React from 'react';

interface HeaderProps {
  currentView: 'inventory' | 'sales';
  setCurrentView: (view: 'inventory' | 'sales') => void;
}

const MotorcycleIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
    </svg>
);


const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  const baseClasses = "px-4 py-2 rounded-md font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";
  const activeClasses = "bg-blue-600 text-white";
  const inactiveClasses = "bg-white text-gray-700 hover:bg-gray-200";

  return (
    <header className="bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <MotorcycleIcon className="w-8 h-8 text-blue-400"/>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Motorepuestos STARCV</h1>
        </div>
        <nav className="flex items-center space-x-2 md:space-x-4">
          <button
            onClick={() => setCurrentView('sales')}
            className={`${baseClasses} ${currentView === 'sales' ? activeClasses : inactiveClasses}`}
          >
            Ventas
          </button>
          <button
            onClick={() => setCurrentView('inventory')}
            className={`${baseClasses} ${currentView === 'inventory' ? activeClasses : inactiveClasses}`}
          >
            Inventario
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;