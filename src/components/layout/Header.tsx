
import React from 'react';
import { Bell, User, LogOut } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-black">Real Estate Asset Performance</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell className="h-5 w-5 text-gray-600 cursor-pointer hover:text-black" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 rounded-full p-2">
              <User className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-black">John Smith</p>
              <p className="text-xs text-gray-500">General Partner</p>
            </div>
          </div>
          
          <button className="p-2 text-gray-600 hover:text-black">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
