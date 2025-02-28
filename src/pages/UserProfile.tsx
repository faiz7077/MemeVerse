// import React, { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';

// const IMGBB_API = 'https://api.imgbb.com/1/upload';
// const IMGBB_KEY = '3734323deff2146ec69d8e69fb6d15e1';

// const UserProfile: React.FC = () => {
//   const [images, setImages] = useState<string[]>([]);
  
//   useEffect(() => {
//     const fetchImages = async () => {
//       try {
//         const response = await fetch("https://ibb.co/Q38ngrqn");
//         const data = await response.json();
//         if (data.success) {
//           // eslint-disable-next-line @typescript-eslint/no-explicit-any
//           setImages(data.data.map((img: any) => img.url));
//         }
//       } catch (error) {
//         console.error("Error fetching images from ImgBB:", error);
//       }
//     };
//     fetchImages();
//   }, []);

//   return (
//     <div className="space-y-8">
//       <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
//         <h1 className="text-3xl font-bold mb-6">User Profile</h1>
//       </motion.div>
      
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//         {images.map((image, index) => (
//           <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
//             <img src={image} alt={`Uploaded ${index}`} className="w-full h-48 object-cover rounded-md" />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default UserProfile;





import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image, Trophy, ArrowUp, ThumbsUp, MessageCircle, Eye } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import MemeGrid from '../components/common/MemeGrid';

// Cloudinary configuration
const CLOUDINARY_UPLOAD_PRESET = 'ml_default'; // Replace with your upload preset
const CLOUDINARY_CLOUD_NAME = 'demo'; // Replace with your cloud name
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

interface Meme {
  id: string;
  url: string;
  name: string;
  likes: number;
  comments: number;
  views: number;
  author: string;
  createdAt: string;
}

const UserProfile: React.FC = () => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [leaderboardMemes, setLeaderboardMemes] = useState<Meme[]>([]);
  const [activeTab, setActiveTab] = useState<'uploads' | 'leaderboard'>('uploads');
  
  // Mock data for leaderboard
  useEffect(() => {
    // In a real app, you would fetch this data from your API
    const mockLeaderboard: Meme[] = [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        name: 'When the code finally works',
        likes: 1245,
        comments: 89,
        views: 5432,
        author: 'CodeMaster',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        name: 'Monday morning feels',
        likes: 987,
        comments: 56,
        views: 4321,
        author: 'MemeQueen',
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
      {
        id: '3',
        url: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        name: 'When someone says they fixed the bug',
        likes: 876,
        comments: 43,
        views: 3210,
        author: 'BugHunter',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
      {
        id: '4',
        url: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        name: 'Debugging at 3am',
        likes: 765,
        comments: 32,
        views: 2987,
        author: 'NightOwl',
        createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      },
      {
        id: '5',
        url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        name: 'When the client changes requirements',
        likes: 654,
        comments: 21,
        views: 1876,
        author: 'ClientWhisperer',
        createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      }
    ];
    
    setLeaderboardMemes(mockLeaderboard);
  }, []);
  
  // Fetch user's uploaded images
  useEffect(() => {
    // In a real app, you would fetch the user's images from your backend
    // For now, we'll just use the mock data if available
    const fetchUserImages = async () => {
      try {
        // Mock API call
        const mockUserImages = [
          'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
          'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
        ];
        
        setUploadedImages(mockUserImages);
      } catch (error) {
        console.error('Error fetching user images:', error);
      }
    };
    
    fetchUserImages();
  }, []);
  
  // Dropzone configuration
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.match('image.*')) {
      setUploadError('Please select an image file (PNG, JPG, GIF)');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size should be less than 5MB');
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    
    try {
      // Create form data for upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 200);
      
      // In a real app, you would make an actual API call to Cloudinary
      // For this example, we'll simulate a successful upload after a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Simulate a successful response with a new image URL
      const newImageUrl = URL.createObjectURL(file);
      setUploadedImages(prev => [newImageUrl, ...prev]);
      
      // Reset upload state after a short delay
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError('Failed to upload image. Please try again.');
      setIsUploading(false);
    }
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1
  });
  
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
    <div className="max-w-6xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">User Profile</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Upload your memes and see how they rank on the leaderboard
        </p>
      </motion.div>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8">
        <button
          onClick={() => setActiveTab('uploads')}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'uploads'
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          My Uploads
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-4 py-2 font-medium text-sm flex items-center ${
            activeTab === 'leaderboard'
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <Trophy size={16} className="mr-1" />
          Leaderboard
        </button>
      </div>
      
      <AnimatePresence mode="wait">
        {activeTab === 'uploads' ? (
          <motion.div
            key="uploads"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Cloudinary Upload Area */}
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-8 text-center mb-8 transition-colors ${
                isDragActive 
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                  : 'border-gray-300 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-600'
              } ${uploadError ? 'border-red-500' : ''}`}
            >
              <input {...getInputProps()} />
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mb-4">
                  <Upload size={28} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                
                <h3 className="text-lg font-medium mb-2">
                  {isDragActive ? 'Drop your meme here' : 'Upload a new meme'}
                </h3>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Drag and drop an image, or click to select a file
                </p>
                
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Supports: JPG, PNG, GIF (Max 5MB)
                </p>
              </div>
            </div>
            
            {/* Upload Progress */}
            {isUploading && (
              <div className="mb-8">
                <div className="flex justify-between text-sm mb-1">
                  <span>Uploading...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {/* Upload Error */}
            {uploadError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-lg mb-8">
                <div className="flex">
                  <X size={20} className="mr-2 flex-shrink-0" />
                  <p>{uploadError}</p>
                </div>
              </div>
            )}
            
            {/* User's Uploaded Images */}
            <h2 className="text-xl font-semibold mb-4">My Uploads</h2>
            
            {uploadedImages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {uploadedImages.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white  rounded-lg shadow-md overflow-hidden"
                  >
                  {/* <MemeGrid  /> */}

                    <div className="relative aspect-video">
                      <img 
                        src={image} 
                        alt={`Uploaded ${index}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4  ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900' }">
                      <h3 className="font-medium mb-2 text-black">Meme #{index + 1}</h3>
                      <div className="flex justify-between text-sm dark:text-gray-800 ">
                        <span>Uploaded today</span>
                        <div className="flex items-center">
                          <ThumbsUp size={14} className="mr-1" />
                          <span>{Math.floor(Math.random() * 100)}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <Image size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  You haven't uploaded any memes yet
                </p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Leaderboard */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 mb-8">
              <div className="flex items-center mb-4">
                <Trophy size={24} className="text-yellow-300 mr-2" />
                <h2 className="text-xl font-bold text-white">Meme Leaderboard</h2>
              </div>
              <p className="text-indigo-100 text-sm">
                The most popular memes based on likes, comments, and views
              </p>
            </div>
            
            <div className="space-y-6">
              {leaderboardMemes.map((meme, index) => (
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
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfile;