// import React from 'react';
// import { Search, Menu } from 'lucide-react';

// const Header = () => (
//   <header className="bg-gray-800 p-4 flex items-center justify-between">
//     <div className="flex items-center space-x-6">
//       <span className="text-2xl font-bold text-blue-500">TY</span>
//       <nav className="hidden md:flex space-x-6">
//         {['Dashboard','Products', 'Community', 'Markets', 'News', 'Brokers'].map((item) => (
//           <a key={item} href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">{item}</a>
//         ))}
//       </nav>
//     </div>
//     <div className="flex items-center space-x-4">
//       <div className="relative">
//         <input
//           type="text"
//           placeholder="Search"
//           className="bg-gray-700 text-white rounded-full py-2 px-4 pl-10 w-40 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
//         />
//         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//       </div>
//       <button className="bg-blue-600 rounded-full p-2 hover:bg-blue-700 transition-colors duration-200">
//         <Menu className="w-5 h-5" />
//       </button>
//     </div>
//   </header>
// );

// export default Header;

import React from 'react';
import { Search, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  
  // Function to determine if a route is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-gray-800 p-4 flex items-center justify-between">
      <div className="flex items-center space-x-6">
        {/* <Link 
          to="/" 
          className={`text-2xl font-bold transition-colors duration-200 ${
            isActive('/') ? 'text-blue-400' : 'text-blue-500 hover:text-blue-400'
          }`}
        >
          HOME
        </Link> */}
        <nav className="hidden md:flex space-x-6">
          {[
            // { name: 'Dashboard', path: '/dashboard' },
            { name: 'Order Execution', path: '/order' },
            { name: 'Portfolio', path: '/portfolio' },
            { name: 'Reports & Charts', path: '/reports' },
            { name: 'Technical Analytics', path: '/technical' },
            { name: 'Trade LifeCycle', path: '/lifecycle' },
            // { name: 'Portfolio BOT', path: '/portfoliobot' },
          ].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`transition-colors duration-200 ${
                isActive(item.path)
                  ? 'text-blue-400 font-semibold border-b-2 border-blue-400 pb-1'
                  : 'text-gray-300 hover:text-blue-400'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-700 text-white rounded-full py-2 px-4 pl-10 w-40 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>
        <button className="bg-blue-600 rounded-full p-2 hover:bg-blue-700 transition-colors duration-200">
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;