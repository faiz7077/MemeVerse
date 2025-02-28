import axios from 'axios';

// Cloudinary configuration
const CLOUDINARY_UPLOAD_PRESET = 'ml_default'; // Replace with your upload preset
const CLOUDINARY_CLOUD_NAME = 'demo'; // Replace with your cloud name
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  created_at: string;
}

export interface Meme {
  id: string;
  url: string;
  name: string;
  likes: number;
  comments: number;
  views: number;
  author: string;
  createdAt: string;
}

// Upload image to Cloudinary
export const uploadImageToCloudinary = async (file: File): Promise<CloudinaryUploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
    const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return {
      secure_url: response.data.secure_url,
      public_id: response.data.public_id,
      created_at: response.data.created_at
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

// Get user's uploaded images
export const getUserUploads = async (): Promise<Meme[]> => {
  // In a real app, you would fetch from your backend which would query Cloudinary
  // For this example, we'll simulate a response
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock data for demonstration
  const mockUploads: Meme[] = [
    {
      id: 'user-1',
      url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      name: 'Tech Workspace',
      likes: Math.floor(Math.random() * 100),
      comments: Math.floor(Math.random() * 20),
      views: Math.floor(Math.random() * 500),
      author: 'CurrentUser',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'user-2',
      url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      name: 'Circuit Board',
      likes: Math.floor(Math.random() * 100),
      comments: Math.floor(Math.random() * 20),
      views: Math.floor(Math.random() * 500),
      author: 'CurrentUser',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    }
  ];
  
  return mockUploads;
};

// Get leaderboard memes
export const getLeaderboardMemes = async (): Promise<Meme[]> => {
  // In a real app, you would fetch from your backend which would query all users' uploads
  // For this example, we'll simulate a response
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock data for demonstration
  const mockLeaderboard: Meme[] = [
    {
      id: 'top-1',
      url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      name: 'Tech Workspace',
      likes: 245,
      comments: 32,
      views: 1200,
      author: 'TechMemer',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: 'top-2',
      url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      name: 'Circuit Board',
      likes: 189,
      comments: 24,
      views: 980,
      author: 'CircuitWiz',
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: 'top-3',
      url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      name: 'Coding Time',
      likes: 156,
      comments: 18,
      views: 820,
      author: 'CodeNinja',
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    },
    {
      id: 'top-4',
      url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      name: 'Code Editor',
      likes: 132,
      comments: 15,
      views: 750,
      author: 'DevGuru',
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    }
  ];
  
  return mockLeaderboard;
};

// Save a new meme
export const saveMeme = async (meme: Omit<Meme, 'id' | 'createdAt'>): Promise<Meme> => {
  // In a real app, you would send this to your backend to save in a database
  // For this example, we'll simulate a response
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Create a new meme with an ID and createdAt timestamp
  const newMeme: Meme = {
    ...meme,
    id: `user-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  
  return newMeme;
};

// Update meme likes
export const updateMemeLikes = async (memeId: string, likes: number): Promise<void> => {
  // In a real app, you would send this to your backend to update in a database
  // For this example, we'll just simulate a delay
  
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return success (in a real app, you might return the updated meme)
  return;
};