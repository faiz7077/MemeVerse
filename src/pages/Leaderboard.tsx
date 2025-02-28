import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, ArrowUp, ThumbsUp, MessageCircle, Eye, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getLeaderboardMemes,  Meme } from '../services/cloudinaryService';

const Leaderboard: React.FC = () => {
  const [leaderboardMemes, setLeaderboardMemes] = useState<Meme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        const memes = await getLeaderboardMemes();
        setLeaderboardMemes(memes);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, []);
  
  // Format date string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  // Format number with K/M suffix
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };
  
  return (
    <div className="max-w-6xl mx-auto pb-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center mb-4">
          <Link to="/" className="mr-4 text-indigo-600 dark:text-indigo-400">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold">Meme Leaderboard</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          The most popular memes from all users
        </p>
      </motion.div>
      
      {/* Leaderboard Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 mb-8">
        <div className="flex items-center mb-4">
          <Trophy size={24} className="text-yellow-300 mr-2" />
          <h2 className="text-xl font-bold text-white">Top Memes</h2>
        </div>
        <p className="text-indigo-100 text-sm">
          The most popular memes based on likes, comments, and views
        </p>
      </div>
      
      {/* Leaderboard Content */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {leaderboardMemes.length > 0 ? (
            leaderboardMemes.map((meme, index) => (
              <motion.div
                key={meme.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row"
              >
                {/* Rank */}
                <div className="flex items-center justify-center bg-indigo-100 dark:bg-indigo-900 p-4 md:w-16">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                    ${index === 0 ? 'bg-yellow-400 text-yellow-800' : 
                      index === 1 ? 'bg-gray-300 text-gray-700' : 
                      index === 2 ? 'bg-amber-600 text-amber-100' : 
                      'bg-indigo-200 dark:bg-indigo-700 text-indigo-700 dark:text-indigo-200'}
                  `}>
                    {index + 1}
                  </div>
                </div>
                
                {/* Image */}
                <div className="md:w-1/3 relative">
                  <img 
                    src={meme.url} 
                    alt={meme.name} 
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                
                {/* Details */}
                <div className="p-4 md:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{meme.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      By {meme.author} • {formatDate(meme.createdAt)}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center">
                      <ThumbsUp size={16} className="text-pink-500 mr-1" />
                      <span>{formatNumber(meme.likes)} likes</span>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle size={16} className="text-blue-500 mr-1" />
                      <span>{formatNumber(meme.comments)} comments</span>
                    </div>
                    <div className="flex items-center">
                      <Eye size={16} className="text-green-500 mr-1" />
                      <span>{formatNumber(meme.views)} views</span>
                    </div>
                    <div className="flex items-center ml-auto">
                      <ArrowUp size={16} className="text-indigo-500 mr-1" />
                      <span className="text-indigo-500 font-medium">
                        {Math.floor(Math.random() * 50) + 1}% this week
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <Trophy size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No memes on the leaderboard yet. Upload some memes to get started!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;