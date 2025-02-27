import React, { useEffect, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useInView } from 'react-intersection-observer';
// import { motion } from 'framer-motion';
// import { Search, Filter, SlidersHorizontal, TrendingUp, Clock, MessageCircle, ThumbsUp } from 'lucide-react';
// import { RootState } from '../store';
// import { 
//   fetchMemesByCategoryAsync, 
//   searchMemesAsync, 
//   setCategory, 
//   setSearchTerm, 
//   setSortBy, 
//   incrementPage 
// } from '../store/slices/memesSlice';
// import MemeGrid from '../components/common/MemeGrid';
// import LoadingSpinner from '../components/common/LoadingSpinner';
// import useDebounce from '../hooks/useDebounce';
import MemeCard from '../components/common/MemeCard';
import { motion } from 'framer-motion';

const IMGBB_API = 'https://api.imgbb.com/1/upload';
const IMGBB_KEY = '3734323deff2146ec69d8e69fb6d15e1';

const UserProfile: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`${IMGBB_API}?key=${IMGBB_KEY}`);
        const data = await response.json();
        if (data.success) {
          setImages(data.data.map((img: any) => img.url));
        }
      } catch (error) {
        console.error("Error fetching images from ImgBB:", error);
      }
    };
    fetchImages();
  }, []);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold mb-6">User Profile</h1>
      </motion.div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <MemeCard key={index} imageUrl={image} />
        ))}
      </div>
    </div>
  );
};

export default UserProfile;
