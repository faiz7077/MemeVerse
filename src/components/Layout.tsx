import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState } from '../store';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { darkMode } = useSelector((state: RootState) => state.theme);
  
  useEffect(() => {
    // Apply theme class to body
    document.body.className = darkMode ? 'dark' : 'light';
  }, [darkMode]);
  
  return (
    <div className={`min-h-screen flex   flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar />
      <motion.main 
        className="flex-grow container mx-auto px-4 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
};

export default Layout;