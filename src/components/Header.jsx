import { useState } from "react";
import { 
  Camera, Home, History, BookOpen, Leaf
} from "lucide-react";
import { Squash as Hamburger } from "hamburger-react";
import {Link} from 'react-router-dom'

const Header = () => {
  const [isOpen, setOpen] = useState(false);

  const menuItems = [
    { 
      id: "home", 
      path: '/home',
      label: "Home", 
      icon: Home, 
      color: "from-emerald-500 to-green-600",
      description: "Overview & Analytics"
    },
    { 
      id: "camera", 
      path: '/scanner',
      label: "AI Scanner", 
      icon: Camera, 
      color: "from-blue-500 to-cyan-600",
      description: "Plant Health Analysis"
    },
    { 
      id: "history", 
      path: '/history',
      label: "History", 
      icon: History, 
      color: "from-purple-500 to-violet-600",
      description: "Scan History & Plants"
    },
    { 
      id: "knowledge", 
      path: '/learning',
      label: "Learning Hub", 
      icon: BookOpen, 
      color: "from-orange-500 to-amber-600",
      description: "Expert Tips & Guides"
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-lg shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <Link to={'/'} className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Leaf size={26} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 bg-clip-text text-transparent">
              AgriScan
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link to={item.path}
                  key={item.id}
                  className="group relative flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-100 transition-all"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-white group-hover:to-emerald-50 shadow-sm">
                    <Icon size={18} className="text-emerald-700" />
                  </div>
                  <span className="font-medium text-gray-700 group-hover:text-emerald-700">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Hamburger */}
          <div className="lg:hidden">
            <Hamburger toggled={isOpen} toggle={setOpen} size={24} />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white shadow-lg border-t border-gray-200">
          <div className="flex flex-col gap-2 p-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link to={item.path}
                  key={item.id}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-100 transition-all"
                >
                  <Icon size={18} className="text-emerald-700" />
                  <span className="font-medium text-gray-700">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
