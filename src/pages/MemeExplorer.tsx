import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, TrendingUp, Clock, MessageCircle, ThumbsUp } from 'lucide-react';
import { AppDispatch, RootState } from '../store';
import { 
  fetchMemesByCategoryAsync, 
  searchMemesAsync, 
  setCategory, 
  setSearchTerm, 
  setSortBy, 
  incrementPage 
} from '../store/slices/memesSlice';
import MemeGrid from '../components/common/MemeGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';
import useDebounce from '../hooks/useDebounce';

const MemeExplorer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    exploreMemes, 
    loading, 
    currentPage, 
    hasMore, 
    category, 
    searchTerm, 
    sortBy 
  } = useSelector((state: RootState) => state.memes);
  const { darkMode } = useSelector((state: RootState) => state.theme);
  
  const [search, setSearch] = useState(searchTerm);
  const debouncedSearch = useDebounce(search, 500);
  const [showFilters, setShowFilters] = useState(false);
  
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });
  
  // Categories for filter
  const categories = [
    { id: 'trending', label: 'Trending', icon: <TrendingUp size={18} /> },
    { id: 'new', label: 'New', icon: <Clock size={18} /> },
    { id: 'classic', label: 'Classic', icon: <ThumbsUp size={18} /> },
    { id: 'random', label: 'Random', icon: <MessageCircle size={18} /> },
  ];
  
  // Sort options
  const sortOptions = [
    { id: 'likes', label: 'Most Liked', icon: <ThumbsUp size={18} /> },
    { id: 'date', label: 'Newest', icon: <Clock size={18} /> },
    { id: 'comments', label: 'Most Comments', icon: <MessageCircle size={18} /> },
  ];
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  
  // Handle category change
  const handleCategoryChange = (newCategory: string) => {
    dispatch(setCategory(newCategory));
  };
  
  // Handle sort change
  const handleSortChange = (newSortBy: string) => {
    dispatch(setSortBy(newSortBy));
  };
  
  // Load more memes when scrolling to the bottom
  useEffect(() => {
    if (inView && !loading && hasMore) {
      dispatch(incrementPage());
    }
  }, [inView, loading, hasMore, dispatch]);
  
  // Fetch memes when page, category, or search term changes
  useEffect(() => {
    if (debouncedSearch) {
      dispatch(setSearchTerm(debouncedSearch));
      dispatch(searchMemesAsync({ term: debouncedSearch, page: currentPage }));
    } else {
      dispatch(setSearchTerm(''));
      dispatch(fetchMemesByCategoryAsync({ category, page: currentPage }));
    }
  }, [debouncedSearch, category, currentPage, dispatch]);
  
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6">Explore Memes</h1>
        
        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className={`relative flex-grow ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm`}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-gray-400" size={20} />
              </div>
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search for memes..."
                className={`w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                }`}
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center px-4 py-3 rounded-lg ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-sm hover:bg-opacity-90 transition-colors`}
            >
              <Filter size={20} className="mr-2" />
              <span>Filters</span>
            </button>
          </div>
          
          {/* Expanded Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h3 className="text-sm font-medium mb-3 flex items-center">
                    <Filter size={16} className="mr-2" />
                    Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.id)}
                        className={`flex items-center px-3 py-2 rounded-full text-sm ${
                          category === cat.id
                            ? 'bg-indigo-500 text-white'
                            : darkMode
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } transition-colors`}
                      >
                        <span className="mr-1">{cat.icon}</span>
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-sm font-medium mb-3 flex items-center">
                    <SlidersHorizontal size={16} className="mr-2" />
                    Sort By
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleSortChange(option.id)}
                        className={`flex items-center px-3 py-2 rounded-full text-sm ${
                          sortBy === option.id
                            ? 'bg-indigo-500 text-white'
                            : darkMode
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } transition-colors`}
                      >
                        <span className="mr-1">{option.icon}</span>
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
      
      {/* Results Count */}
      {exploreMemes.length > 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {exploreMemes.length} {exploreMemes.length === 1 ? 'meme' : 'memes'}
        </p>
      )}
      

      {loading && exploreMemes.length === 0 ? (
        <LoadingSpinner />
      ) : exploreMemes.length > 0 ? (
        <>
          <MemeGrid memes={exploreMemes} />
          

          {/* Loading indicator for infinite scroll */}
          {hasMore && (
            <div ref={ref} className="py-8 flex justify-center">
              {loading && <LoadingSpinner />}
            </div>
          )}
          {/* End of list message */}
          {!hasMore && (
            <p className="text-center py-8 text-gray-500 dark:text-gray-400">
              You've reached the end! No more memes to load.
            </p>
          )}

        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-4">
            No memes found matching your search.
          </p>
          <button
            onClick={() => {
              setSearch('');
              dispatch(setSearchTerm(''));
              dispatch(setCategory('trending'));
            }}
            className="btn-primary"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default MemeExplorer;




// import React, { useEffect, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useInView } from 'react-intersection-observer';
// import { motion } from 'framer-motion';
// // import { Search, Filter, SlidersHorizontal, TrendingUp, Clock, MessageCircle, ThumbsUp } from 'lucide-react';
// import { AppDispatch, RootState } from '../store';
// import { 
//   fetchMemesByCategoryAsync, 
//   searchMemesAsync, 
//   setCategory, 
//   setSearchTerm, 
//   // setSortBy, 
//   incrementPage 
// } from '../store/slices/memesSlice';
// import MemeGrid from '../components/common/MemeGrid';
// import LoadingSpinner from '../components/common/LoadingSpinner';
// import useDebounce from '../hooks/useDebounce';

// const MemeExplorer: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { 
//     exploreMemes, 
//     loading, 
//     currentPage, 
//     hasMore, 
//     category, 
//     searchTerm, 
//     // sortBy 
//   } = useSelector((state: RootState) => state.memes);
//   const { darkMode } = useSelector((state: RootState) => state.theme);
  
//   const [search, setSearch] = useState(searchTerm);
//   const debouncedSearch = useDebounce(search, 500);
//   const [showFilters, setShowFilters] = useState(false);
  
//   const { ref, inView } = useInView({
//     threshold: 0,
//     triggerOnce: false,
//   });
  
//   useEffect(() => {
//     if (inView && !loading && hasMore) {
//       dispatch(incrementPage());
//     }
//   }, [inView, loading, hasMore, dispatch]);
  
//   useEffect(() => {
//     if (debouncedSearch) {
//       dispatch(setSearchTerm(debouncedSearch));
//       dispatch(searchMemesAsync({ term: debouncedSearch, page: currentPage }));
//     } else {
//       dispatch(setSearchTerm(''));
//       dispatch(fetchMemesByCategoryAsync({ category, page: currentPage }));
//     }
//   }, [debouncedSearch, category, currentPage, dispatch]);
  
//   return (
//     <div className="space-y-8">
//       <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
//         <h1 className="text-3xl font-bold mb-6">Explore Memes</h1>
//       </motion.div>
      
//       {exploreMemes.length > 0 && (
//         <p className="text-sm text-gray-500 dark:text-gray-400">
//           Showing {exploreMemes.length} {exploreMemes.length === 1 ? 'meme' : 'memes'}
//         </p>
//       )}
      
//       {loading && exploreMemes.length === 0 ? (
//         <LoadingSpinner />
//       ) : exploreMemes.length > 0 ? (
//         <>
//           <MemeGrid memes={exploreMemes} />
//           {hasMore && (
//             <div ref={ref} className="py-8 flex justify-center">
//               {loading && <LoadingSpinner />}
//             </div>
//           )}
//           {!hasMore && (
//             <p className="text-center py-8 text-gray-500 dark:text-gray-400">
//               You've reached the end! No more memes to load.
//             </p>
//           )}
//         </>
//       ) : (
//         <div className="text-center py-16">
//           <p className="text-xl text-gray-500 dark:text-gray-400 mb-4">
//             No memes found matching your search.
//           </p>
//           <button
//             onClick={() => {
//               setSearch('');
//               dispatch(setSearchTerm(''));
//               dispatch(setCategory('trending'));
//             }}
//             className="btn-primary"
//           >
//             Reset Filters
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MemeExplorer;
