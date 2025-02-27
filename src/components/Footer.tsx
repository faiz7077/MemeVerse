import React from 'react';
import { useSelector } from 'react-redux';
import { Heart, Github, Twitter, Instagram } from 'lucide-react';
import { RootState } from '../store';

const Footer: React.FC = () => {
  const { darkMode } = useSelector((state: RootState) => state.theme);
  
  return (
    <footer className={`py-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-inner`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-center md:text-left">
              © {new Date().getFullYear()} MemeVerse. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <span>Made with</span>
            <Heart className="text-pink-500" size={16} />
            <span>by MemeVerse Team</span>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <a
              href="#"
              className={`p-2 rounded-full transition-colors duration-200 ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href="#"
              className={`p-2 rounded-full transition-colors duration-200 ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </a>
            <a
              href="#"
              className={`p-2 rounded-full transition-colors duration-200 ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;