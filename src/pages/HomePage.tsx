import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Upload, Search, Sparkles } from 'lucide-react';
import { AppDispatch, RootState } from '../store';
import { fetchTrendingMemesAsync } from '../store/slices/memesSlice';
import MemeGrid from '../components/common/MemeGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { trending, loading } = useSelector((state: RootState) => state.memes);
  const { darkMode } = useSelector((state: RootState) => state.theme);
  
  useEffect(() => {
    if (trending.length === 0) {
      dispatch(fetchTrendingMemesAsync());
    }
  }, [dispatch, trending.length]);
  
  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  const featureCardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.4 }
    },
    hover: { 
      scale: 1.05,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.2 }
    }
  };
  
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.section 
        className="py-12 md:py-20 text-center"
        initial="hidden"
        animate="visible"
        variants={heroVariants}
      >
        <motion.h1 
          className="text-4xl md:text-6xl font-bold mb-6"
          variants={itemVariants}
        >
          Welcome to <span className="text-indigo-500">MemeVerse</span>
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-600 dark:text-gray-300"
          variants={itemVariants}
        >
          Your ultimate destination for exploring, creating, and sharing the internet's best memes
        </motion.p>
        
        <motion.div 
          className="flex flex-wrap justify-center gap-4"
          variants={itemVariants}
        >
          <Link 
            to="/explore" 
            className="btn-primary flex items-center space-x-2 text-lg px-6 py-3"
          >
            <span>Explore Memes</span>
            <ArrowRight size={20} />
          </Link>
          
          <Link 
            to="/profile" 
            className="btn-secondary flex items-center space-x-2 text-lg px-6 py-3"
          >
            <span>Upload Your Own</span>
            <Upload size={20} />
          </Link>
        </motion.div>
      </motion.section>
      
      {/* Features Section */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-12">What Makes MemeVerse Special</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            className={`card ${darkMode ? 'dark' : 'light'} p-6`}
            variants={featureCardVariants}
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <TrendingUp className="text-indigo-500" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Trending Memes</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Stay updated with the latest viral memes from across the internet, refreshed daily.
            </p>
          </motion.div>
          
          <motion.div 
            className={`card ${darkMode ? 'dark' : 'light'} p-6`}
            variants={featureCardVariants}
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="bg-pink-100 dark:bg-pink-900 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <Upload className="text-pink-500" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Create & Share</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Upload your own memes or create new ones with our easy-to-use meme generator.
            </p>
          </motion.div>
          
          <motion.div 
            className={`card ${darkMode ? 'dark' : 'light'} p-6`}
            variants={featureCardVariants}
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <Sparkles className="text-yellow-500" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">AI Caption Generator</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Let our AI suggest hilarious captions for your memes to make them even funnier.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Trending Memes Section */}
      <section className="py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Trending Memes</h2>
          <Link 
            to="/explore" 
            className="flex items-center space-x-2 text-indigo-500 hover:text-indigo-600 transition-colors"
          >
            <span>View All</span>
            <ArrowRight size={18} />
          </Link>
        </div>
        
        {loading ? (
          <LoadingSpinner />
        ) : trending.length > 0 ? (
          <MemeGrid memes={trending.slice(0, 6)} />
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500 dark:text-gray-400">
              No trending memes available at the moment. Check back later!
            </p>
          </div>
        )}
      </section>
      
      {/* CTA Section */}
      <motion.section 
        className={`py-16 px-8 rounded-2xl ${darkMode ? 'bg-indigo-900' : 'bg-indigo-50'} text-center`}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join the Meme Revolution?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Explore thousands of memes, create your own, and share them with the world.
        </p>
        <Link 
          to="/explore" 
          className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-3"
        >
          <Search size={20} />
          <span>Start Exploring</span>
        </Link>
      </motion.section>
    </div>
  );
};

export default HomePage;