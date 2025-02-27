import axios from 'axios';
import { Meme } from '../store/slices/memesSlice';

// Imgflip API endpoints
const IMGFLIP_API = 'https://api.imgflip.com';
const GET_MEMES = `${IMGFLIP_API}/get_memes`;
const CAPTION_IMAGE = `${IMGFLIP_API}/caption_image`;

// ImgBB API for image uploads
const IMGBB_API = 'https://api.imgbb.com/1/upload';
const IMGBB_KEY = 'process.env.NEXT_PUBLIC_IMGBB_KEY'; // Replace with your actual key or use env variable

// Fetch trending memes from Imgflip API
export const fetchTrendingMemes = async (): Promise<Meme[]> => {
  try {
    const response = await axios.get(GET_MEMES);
    if (response.data.success) {
      // Return only the first 10 memes for trending section
      return response.data.data.memes.slice(0, 20);
    }
    throw new Error('Failed to fetch trending memes');
  } catch (error) {
    console.error('Error fetching trending memes:', error);
    return [];
  }
};

// export const fetchTrendingMemes = async (page: number, pageSize: number): Promise<Meme[]> => {
//   try {
//     const response = await axios.get(GET_MEMES);
//     if (response.data.success) {
//       const allMemes = response.data.data.memes;
//       console.log('allMemes', allMemes);
//       const startIndex = (page - 1) * pageSize;
//       const endIndex = startIndex + pageSize;
      
//       return allMemes.slice(startIndex, endIndex);
//     }
//     throw new Error('Failed to fetch memes');
//   } catch (error) {
//     console.error('Error fetching memes:', error);
//     return [];
//   }
// };

// Fetch memes by category (simulated with Imgflip API)
export const fetchMemesByCategory = async (category: string, page: number): Promise<Meme[]> => {
  try {
    const response = await axios.get(GET_MEMES);
    if (response.data.success) {
      const allMemes = response.data.data.memes;
      const pageSize = 100;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      
      // Simulate different categories by slicing different portions of the array
      let filteredMemes;
      switch (category) {
        case 'trending':
          filteredMemes = allMemes.slice(0, 50);
          break;
        case 'new':
          filteredMemes = allMemes.slice(50, 100);
          break;
        case 'classic':
          filteredMemes = allMemes.filter((meme: Meme) => meme.box_count <= 2);
          break;
        case 'random':
          filteredMemes = [...allMemes].sort(() => Math.random() - 0.5);
          break;
        default:
          filteredMemes = allMemes;
      }
      
      return filteredMemes.slice(startIndex, endIndex);
    }
    throw new Error('Failed to fetch memes by category');
  } catch (error) {
    console.error(`Error fetching ${category} memes:`, error);
    return [];
  }
};

// Search memes by term (simulated with Imgflip API)
export const searchMemes = async (term: string, page: number): Promise<Meme[]> => {
  try {
    const response = await axios.get(GET_MEMES);
    if (response.data.success) {
      const allMemes = response.data.data.memes;
      const pageSize = 10;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      
      // Filter memes by search term
      const filteredMemes = allMemes.filter((meme: Meme) => 
        meme.name.toLowerCase().includes(term.toLowerCase())
      );
      
      return filteredMemes.slice(startIndex, endIndex);
    }
    throw new Error('Failed to search memes');
  } catch (error) {
    console.error('Error searching memes:', error);
    return [];
  }
};

// Generate a meme with captions
export const generateMeme = async (
  templateId: string,
  topText: string,
  bottomText: string,
  username = 'memeverse',
  password = 'memeverse123'
): Promise<string> => {
  try {
    const response = await axios.post(
      CAPTION_IMAGE,
      new URLSearchParams({
        template_id: templateId,
        username,
        password,
        text0: topText,
        text1: bottomText,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    
    if (response.data.success) {
      return response.data.data.url;
    }
    throw new Error('Failed to generate meme');
  } catch (error) {
    console.error('Error generating meme:', error);
    throw error;
  }
};

// Upload an image to ImgBB
export const uploadImage = async (imageFile: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('key', IMGBB_KEY);
    console.log('formData', formData);
    const response = await axios.post(IMGBB_API, formData);
    
    if (response.data.success) {
      return response.data.data.url;
    }
    throw new Error('Failed to upload image');
  } catch (error) {
    console.error('Error uploading image:', error);
    // For demo purposes, return a placeholder URL if upload fails
    return 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
  }
};

// Get a single meme by ID
export const getMemeById = async (id: string): Promise<Meme | null> => {
  try {
    const response = await axios.get(GET_MEMES);
    if (response.data.success) {
      const meme = response.data.data.memes.find((m: Meme) => m.id === id);
      if (meme) {
        return {
          ...meme,
          likes: Math.floor(Math.random() * 1000),
          comments: [],
          createdAt: new Date().toISOString(),
        };
      }
    }
    throw new Error('Meme not found');
  } catch (error) {
    console.error('Error fetching meme by ID:', error);
    return null;
  }
};

// Simulate AI-generated captions
export const generateAICaption = async (imageUrl: string): Promise<string> => {
  // This is a mock function that returns random captions
  const captions = [
    "When you finally find the bug in your code after 5 hours",
    "Me explaining to my mom why I need a new gaming PC",
    "When someone says they don't like memes",
    "That moment when you realize you've been scrolling memes for 3 hours",
    "My brain during an important exam",
    "How I look waiting for my food delivery",
    "When your code works on the first try",
    "Me trying to explain my job to my grandparents",
    "When you're the only one who gets the reference",
    "My reaction when someone asks if I'm productive today"
  ];
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return captions[Math.floor(Math.random() * captions.length)];
};