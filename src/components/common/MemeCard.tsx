import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { RootState } from '../../store';
import { toggleLike, Meme } from '../../store/slices/memesSlice';
import { formatDistanceToNow } from 'date-fns';

interface MemeCardProps {
  meme: Meme;
  index: number;
}

const MemeCard: React.FC<MemeCardProps> = ({ meme, index }) => {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const { likedMemes } = useSelector((state: RootState) => state.memes);
  
  const isLiked = likedMemes.includes(meme.id);
  
  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleLike(meme.id));
  };
  
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (navigator.share) {
      navigator.share({
        title: meme.name,
        url: window.location.origin + '/meme/' + meme.id,
      }).catch(console.error);
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.origin + '/meme/' + meme.id)
        .then(() => alert('Link copied to clipboard!'))
        .catch(console.error);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`card ${darkMode ? 'dark' : 'light'} overflow-hidden`}
    >
      <Link to={`/meme/${meme.id}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={meme.url}
            alt={meme.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        </div>
        
        <div className="p-4">
          <h3 className="font-bold text-lg truncate">{meme.name}</h3>
          
          <div className="flex items-center justify-between mt-2 text-sm text-gray-500 dark:text-gray-400">
            <span>{formatDistanceToNow(new Date(meme.createdAt || new Date()), { addSuffix: true })}</span>
            {meme.category && <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 rounded-full text-xs">{meme.category}</span>}
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 ${isLiked ? 'text-pink-500' : ''}`}
            >
              <motion.div whileTap={{ scale: 1.2 }}>
                <Heart className={isLiked ? 'fill-current' : ''} size={18} />
              </motion.div>
              <span>{meme.likes || 0}</span>
            </button>
            
            <Link to={`/meme/${meme.id}`} className="flex items-center space-x-1">
              <MessageCircle size={18} />
              <span>{meme.comments?.length || 0}</span>
            </Link>
            
            <button onClick={handleShare} className="flex items-center space-x-1">
              <Share2 size={18} />
              <span>Share</span>
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default MemeCard;