import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserProfile {
  id: string;
  name: string;
  bio: string;
  profilePicture: string;
}

interface UserState {
  profile: UserProfile;
  isLoggedIn: boolean;
}

// Get user profile from localStorage or use default
const getInitialProfile = (): UserProfile => {
  const savedProfile = localStorage.getItem('userProfile');
  if (savedProfile) {
    return JSON.parse(savedProfile);
  }
  return {
    id: '1',
    name: 'Meme Enthusiast',
    bio: 'I love creating and sharing memes!',
    profilePicture: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
  };
};

const initialState: UserState = {
  profile: getInitialProfile(),
  isLoggedIn: Boolean(localStorage.getItem('userProfile')),
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      state.profile = { ...state.profile, ...action.payload };
      localStorage.setItem('userProfile', JSON.stringify(state.profile));
    },
    login: (state) => {
      state.isLoggedIn = true;
      localStorage.setItem('userProfile', JSON.stringify(state.profile));
    },
    logout: (state) => {
      state.isLoggedIn = false;
      localStorage.removeItem('userProfile');
    },
  },
});

export const { updateProfile, login, logout } = userSlice.actions;
export default userSlice.reducer;