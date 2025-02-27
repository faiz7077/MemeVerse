import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  ArrowLeft, 
  Download, 
  Send, 
  User,
  AlertCircle
} from 'lucide-react';
import { RootState } from '../store';
import { 
  setCurrentMeme, 
  toggleLike, 
  addComment 
} from '../store/slices/memesSlice';
import { getMemeById } from '../services/memeService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDistanceToNow } from 'date-fns';

interface CommentFormData {
  comment: string;
}

const MemeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { currentMeme, loading, likedMemes } = useSelector((state: RootState) => state.memes);
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const { profile } = useSelector((state: RootState) => state.user);
  
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CommentFormData>({
    defaultValues: {
      comment: '',
    }
  });
  
  const isLiked = id ? likedMemes.includes(id) : false;
  
  useEffect(() => {
    const fetchMeme = async () => {
      if (!id) return;
      
      try {
        const meme = await getMemeById(id);
        if (meme) {
          dispatch(setCurrentMeme(meme));
        } else {
          setError('Meme not found');
        }
      } catch (err) {
        console.error('Error fetching meme:', err);
        setError('Failed to load meme');
      }
    };
    
    fetchMeme();
  }, [id, dispatch]);
  
  const handleLike = () => {
    if (id) {
      dispatch(toggleLike(id));
    }
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentMeme?.name || 'Check out this meme',
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch(console.error);
    }
  };
  
  const handleDownload = () => {
    if (!currentMeme) return;
    
    const link = document.createElement('a');
    link.href = currentMeme.url;
    link.download = `memeverse-${currentMeme.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const onSubmitComment = (data: CommentFormData) => {
    if (!id || !currentMeme) return;
    
    const newComment = {
      id: `comment-${Date.now()}`,
      text: data.comment,
      author: profile.name,
      createdAt: new Date().toISOString(),
    };
    
    dispatch(addComment({ memeId: id, comment: newComment }));
    reset();
  };
  
  if (error) {
    return (
      <div className="text-center py-16">
        <div className="flex justify-center mb-4">
          <AlertCircle size={48} className="text-red-500" />
        </div>
        <h1 className="text-2xl font-bold mb-4">{error}</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          The meme you're looking for might have been removed or doesn't exist.
        </p>
        <Link to="/explore" className="btn-primary">
          Explore Other Memes
        </Link>
      </div>
    );
  }
  
  if (loading || !currentMeme) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Back Button */}
        <Link 
          to="/explore" 
          className="inline-flex items-center text-indigo-500 hover:text-indigo-600 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Explore
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Meme Image - 3 columns on large screens */}
          <div className="lg:col-span-3">
            <div className={`card ${darkMode ? 'dark' : 'light'} overflow-hidden`}>
              <img 
                src={currentMeme.url} 
                alt={currentMeme.name} 
                className="w-full h-auto"
              />
              
              {/* Action Buttons */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <button 
                    onClick={handleLike}
                    className={`flex items-center space-x-2 ${isLiked ? 'text-pink-500' : ''}`}
                  >
                    <motion.div whileTap={{ scale: 1.2 }}>
                      <Heart className={isLiked ? 'fill-current' : ''} size={24} />
                    </motion.div>
                    <span>{currentMeme.likes || 0}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2">
                    <MessageCircle size={24} />
                    <span>{currentMeme.comments?.length || 0}</span>
                  </button>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={handleShare}
                    className="flex items-center space-x-1"
                  >
                    <Share2 size={20} />
                    <span className="hidden sm:inline">Share</span>
                  </button>
                  
                  <button 
                    onClick={handleDownload}
                    className="flex items-center space-x-1"
                  >
                    <Download size={20} />
                    <span className="hidden sm:inline">Download</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Meme Details and Comments - 2 columns on large screens */}
          <div className="lg:col-span-2">
            <div className={`card ${darkMode ? 'dark' : 'light'} p-6 mb-6`}>
              <h1 className="text-2xl font-bold mb-2">{currentMeme.name}</h1>
              
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span>
                  {formatDistanceToNow(new Date(currentMeme.createdAt || new Date()), { addSuffix: true })}
                </span>
                {currentMeme.category && (
                  <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 rounded-full text-xs">
                    {currentMeme.category}
                  </span>
                )}
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h2 className="text-lg font-semibold mb-4">Comments</h2>
                
                {/* Comment Form */}
                <form onSubmit={handleSubmit(onSubmitComment)} className="mb-6">
                  <div className="flex items-start space-x-2">
                    <div className={`w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center flex-shrink-0`}>
                      <User size={16} className="text-indigo-500" />
                    </div>
                    <div className="flex-grow">
                      <textarea
                        {...register('comment', { 
                          required: 'Comment cannot be empty',
                          maxLength: {
                            value: 500,
                            message: 'Comment must be less than 500 characters'
                          }
                        })}
                        placeholder="Add a comment..."
                        rows={2}
                        className={`input w-full ${darkMode ? 'dark' : 'light'} ${
                          errors.comment ? 'border-red-500 focus:ring-red-500' : ''
                        }`}
                      ></textarea>
                      {errors.comment && (
                        <p className="mt-1 text-red-500 text-sm">{errors.comment.message}</p>
                      )}
                    </div>
                    <button 
                      type="submit" 
                      className="btn-primary p-2"
                      aria-label="Submit comment"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </form>
                
                {/* Comments List */}
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {currentMeme.comments && currentMeme.comments.length > 0 ? (
                    currentMeme.comments.map((comment) => (
                      <motion.div 
                        key={comment.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-3 rounded-lg ${
                          darkMode ? 'bg-gray-700' : 'bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center mb-2">
                          <div className={`w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-2`}>
                            <User size={12} className="text-indigo-500" />
                          </div>
                          <span className="font-medium">{comment.author}</span>
                          <span className="mx-2 text-gray-400">•</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm">{comment.text}</p>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                      No comments yet. Be the first to comment!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MemeDetails;