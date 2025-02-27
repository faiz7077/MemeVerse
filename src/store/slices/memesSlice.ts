import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchTrendingMemes, fetchMemesByCategory, searchMemes } from '../../services/memeService';

export interface Meme {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  box_count: number;
  captions?: number;
  likes?: number;
  comments?: Comment[];
  category?: string;
  createdAt?: string;
  author?: string;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

interface MemesState {
  trending: Meme[];
  exploreMemes: Meme[];
  userMemes: Meme[];
  likedMemes: string[];
  currentMeme: Meme | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  hasMore: boolean;
  category: string;
  searchTerm: string;
  sortBy: string;
}

const initialState: MemesState = {
  trending: [],
  exploreMemes: [],
  userMemes: [],
  likedMemes: JSON.parse(localStorage.getItem('likedMemes') || '[]'),
  currentMeme: null,
  loading: false,
  error: null,
  currentPage: 1,
  hasMore: true,
  category: 'trending',
  searchTerm: '',
  sortBy: 'likes',
};

export const fetchTrendingMemesAsync = createAsyncThunk(
  'memes/fetchTrending',
  async () => {
    const response = await fetchTrendingMemes();
    return response;
  }
);

export const fetchMemesByCategoryAsync = createAsyncThunk(
  'memes/fetchByCategory',
  async ({ category, page }: { category: string; page: number }) => {
    const response = await fetchMemesByCategory(category, page);
    return response;
  }
);

export const searchMemesAsync = createAsyncThunk(
  'memes/search',
  async ({ term, page }: { term: string; page: number }) => {
    const response = await searchMemes(term, page);
    return response;
  }
);

export const memesSlice = createSlice({
  name: 'memes',
  initialState,
  reducers: {
    setCurrentMeme: (state, action: PayloadAction<Meme>) => {
      state.currentMeme = action.payload;
    },
    addComment: (state, action: PayloadAction<{ memeId: string; comment: Comment }>) => {
      const { memeId, comment } = action.payload;
      
      // Add comment to current meme if it matches
      if (state.currentMeme && state.currentMeme.id === memeId) {
        if (!state.currentMeme.comments) {
          state.currentMeme.comments = [];
        }
        state.currentMeme.comments.push(comment);
      }
      
      // Add comment to explore memes
      const exploreIndex = state.exploreMemes.findIndex(meme => meme.id === memeId);
      if (exploreIndex !== -1) {
        if (!state.exploreMemes[exploreIndex].comments) {
          state.exploreMemes[exploreIndex].comments = [];
        }
        state.exploreMemes[exploreIndex].comments.push(comment);
      }
      
      // Add comment to trending memes
      const trendingIndex = state.trending.findIndex(meme => meme.id === memeId);
      if (trendingIndex !== -1) {
        if (!state.trending[trendingIndex].comments) {
          state.trending[trendingIndex].comments = [];
        }
        state.trending[trendingIndex].comments.push(comment);
      }
    },
    toggleLike: (state, action: PayloadAction<string>) => {
      const memeId = action.payload;
      
      // Toggle like in liked memes array
      if (state.likedMemes.includes(memeId)) {
        state.likedMemes = state.likedMemes.filter(id => id !== memeId);
      } else {
        state.likedMemes.push(memeId);
      }
      
      // Update localStorage
      localStorage.setItem('likedMemes', JSON.stringify(state.likedMemes));
      
      // Update like count in current meme
      if (state.currentMeme && state.currentMeme.id === memeId) {
        state.currentMeme.likes = (state.currentMeme.likes || 0) + (state.likedMemes.includes(memeId) ? 1 : -1);
      }
      
      // Update like count in explore memes
      const exploreIndex = state.exploreMemes.findIndex(meme => meme.id === memeId);
      if (exploreIndex !== -1) {
        state.exploreMemes[exploreIndex].likes = (state.exploreMemes[exploreIndex].likes || 0) + 
          (state.likedMemes.includes(memeId) ? 1 : -1);
      }
      
      // Update like count in trending memes
      const trendingIndex = state.trending.findIndex(meme => meme.id === memeId);
      if (trendingIndex !== -1) {
        state.trending[trendingIndex].likes = (state.trending[trendingIndex].likes || 0) + 
          (state.likedMemes.includes(memeId) ? 1 : -1);
      }
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
      state.currentPage = 1;
      state.hasMore = true;
      state.exploreMemes = [];
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
      state.hasMore = true;
      state.exploreMemes = [];
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
      
      // Sort memes based on the selected criteria
      const sortMemes = (memes: Meme[]) => {
        return [...memes].sort((a, b) => {
          if (state.sortBy === 'likes') {
            return (b.likes || 0) - (a.likes || 0);
          } else if (state.sortBy === 'date') {
            return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
          } else if (state.sortBy === 'comments') {
            return (b.comments?.length || 0) - (a.comments?.length || 0);
          }
          return 0;
        });
      };
      
      state.exploreMemes = sortMemes(state.exploreMemes);
      state.trending = sortMemes(state.trending);
    },
    addUserMeme: (state, action: PayloadAction<Meme>) => {
      state.userMemes.unshift(action.payload);
      // Also add to explore memes if appropriate
      if (state.category === 'new') {
        state.exploreMemes.unshift(action.payload);
      }
    },
    incrementPage: (state) => {
      state.currentPage += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrendingMemesAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTrendingMemesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.trending = action.payload.map((meme: Meme) => ({
          ...meme,
          likes: Math.floor(Math.random() * 1000),
          comments: [],
          createdAt: new Date().toISOString(),
        }));
      })
      .addCase(fetchTrendingMemesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch trending memes';
      })
      .addCase(fetchMemesByCategoryAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMemesByCategoryAsync.fulfilled, (state, action) => {
        state.loading = false;
        const newMemes = action.payload.map((meme: Meme) => ({
          ...meme,
          likes: Math.floor(Math.random() * 1000),
          comments: [],
          createdAt: new Date().toISOString(),
          category: state.category,
        }));
        
        if (newMemes.length === 0) {
          state.hasMore = false;
        } else {
          state.exploreMemes = [...state.exploreMemes, ...newMemes];
        }
      })
      .addCase(fetchMemesByCategoryAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch memes by category';
      })
      .addCase(searchMemesAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchMemesAsync.fulfilled, (state, action) => {
        state.loading = false;
        const newMemes = action.payload.map((meme: Meme) => ({
          ...meme,
          likes: Math.floor(Math.random() * 1000),
          comments: [],
          createdAt: new Date().toISOString(),
        }));
        
        if (newMemes.length === 0) {
          state.hasMore = false;
        } else {
          state.exploreMemes = [...state.exploreMemes, ...newMemes];
        }
      })
      .addCase(searchMemesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to search memes';
      });
  },
});

export const { 
  setCurrentMeme, 
  addComment, 
  toggleLike, 
  setCategory, 
  setSearchTerm, 
  setSortBy, 
  addUserMeme,
  incrementPage
} = memesSlice.actions;

export default memesSlice.reducer;