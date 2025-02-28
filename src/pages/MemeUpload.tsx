// import React, { useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { motion } from 'framer-motion';
// import { useForm } from 'react-hook-form';
// import { Upload, Image, Sparkles, X, Check, AlertCircle } from 'lucide-react';
// import { RootState } from '../store';
// import { addUserMeme } from '../store/slices/memesSlice';
// import { uploadImage, generateAICaption } from '../services/memeService';
// import LoadingSpinner from '../components/common/LoadingSpinner';

// interface FormData {
//   name: string;
//   category: string;
// }

// const MemeUpload: React.FC = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { darkMode } = useSelector((state: RootState) => state.theme);
//   const { profile } = useSelector((state: RootState) => state.user);
  
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string>('');
//   const [isUploading, setIsUploading] = useState(false);
//   const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
//   const [uploadError, setUploadError] = useState<string>('');
//   const [uploadSuccess, setUploadSuccess] = useState(false);
  
//   const fileInputRef = useRef<HTMLInputElement>(null);
  
//   const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
//     defaultValues: {
//       name: '',
//       category: 'random',
//     }
//   });
  
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
    
//     // Check file type
//     if (!file.type.match('image.*')) {
//       setUploadError('Please select an image file (PNG, JPG, GIF)');
//       return;
//     }
    
//     // Check file size (max 5MB)
//     if (file.size > 5 * 1024 * 1024) {
//       setUploadError('File size should be less than 5MB');
//       return;
//     }
    
//     setSelectedFile(file);
//     setUploadError('');
    
//     // Create preview
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setPreviewUrl(reader.result as string);
//     };
//     reader.readAsDataURL(file);
//   };
  
//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
//   };
  
//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     const file = e.dataTransfer.files?.[0];
//     if (!file) return;
    
//     // Check file type
//     if (!file.type.match('image.*')) {
//       setUploadError('Please select an image file (PNG, JPG, GIF)');
//       return;
//     }
    
//     // Check file size (max 5MB)
//     if (file.size > 5 * 1024 * 1024) {
//       setUploadError('File size should be less than 5MB');
//       return;
//     }
    
//     setSelectedFile(file);
//     setUploadError('');
    
//     // Create preview
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setPreviewUrl(reader.result as string);
//     };
//     reader.readAsDataURL(file);
//   };
  
//   const handleRemoveFile = () => {
//     setSelectedFile(null);
//     setPreviewUrl('');
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };
  
//   const generateCaption = async () => {
//     if (!previewUrl) return;
    
//     setIsGeneratingCaption(true);
//     try {
//       const caption = await generateAICaption(previewUrl);
//       setValue('name', caption);
//     } catch (error) {
//       console.error('Error generating caption:', error);
//       setUploadError('Failed to generate caption. Please try again.');
//     } finally {
//       setIsGeneratingCaption(false);
//     }
//   };
  
//   const onSubmit = async (data: FormData) => {
//     if (!selectedFile) {
//       setUploadError('Please select an image to upload');
//       return;
//     }
    
//     setIsUploading(true);
//     setUploadError('');
    
//     try {
//       // Upload image to server
//       const imageUrl = await uploadImage(selectedFile);
      
//       // Create new meme object
//       const newMeme = {
//         id: `user-${Date.now()}`,
//         name: data.name,
//         url: imageUrl,
//         width: 500,
//         height: 500,
//         box_count: 2,
//         category: data.category,
//         likes: 0,
//         comments: [],
//         createdAt: new Date().toISOString(),
//         author: profile.name,
//       };
      
//       // Add to Redux store
//       dispatch(addUserMeme(newMeme));
      
//       // Show success message
//       setUploadSuccess(true);
      
//       // Reset form after 2 seconds and redirect
//       setTimeout(() => {
//         navigate('/profile');
//       }, 2000);
      
//     } catch (error) {
//       console.error('Error uploading meme:', error);
//       setUploadError('Failed to upload meme. Please try again.');
//     } finally {
//       setIsUploading(false);
//     }
//   };
  
//   return (
//     <div className="max-w-3xl mx-auto">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <h1 className="text-3xl font-bold mb-6">Upload Your Meme</h1>
        
//         {uploadSuccess ? (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className={`p-6 rounded-lg text-center ${darkMode ? 'bg-green-900' : 'bg-green-50'} mb-8`}
//           >
//             <div className="flex justify-center mb-4">
//               <div className="bg-green-100 p-3 rounded-full">
//                 <Check className="text-green-500" size={32} />
//               </div>
//             </div>
//             <h2 className="text-xl font-bold mb-2">Upload Successful!</h2>
//             <p className="text-gray-600 dark:text-gray-300 mb-4">
//               Your meme has been uploaded successfully.
//             </p>
//             <p className="text-sm text-gray-500 dark:text-gray-400">
//               Redirecting to your profile...
//             </p>
//           </motion.div>
//         ) : (
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
//             {/* File Upload Area */}
//             <div 
//               className={`border-2 border-dashed rounded-lg p-8 text-center ${
//                 darkMode 
//                   ? 'border-gray-600 bg-gray-800' 
//                   : 'border-gray-300 bg-gray-50'
//               } ${uploadError ? 'border-red-500' : ''}`}
//               onDragOver={handleDragOver}
//               onDrop={handleDrop}
//             >
//               {previewUrl ? (
//                 <div className="relative">
//                   <img 
//                     src={previewUrl} 
//                     alt="Preview" 
//                     className="max-h-80 mx-auto rounded-lg"
//                   />
//                   <button
//                     type="button"
//                     onClick={handleRemoveFile}
//                     className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
//                   >
//                     <X size={20} />
//                   </button>
//                 </div>
//               ) : (
//                 <div className="py-8">
//                   <div className="flex justify-center mb-4">
//                     <div className={`p-4 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
//                       <Image className="text-indigo-500" size={32} />
//                     </div>
//                   </div>
//                   <p className="text-lg mb-2">Drag and drop your meme here</p>
//                   <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
//                     Supports: JPG, PNG, GIF (Max 5MB)
//                   </p>
//                   <button
//                     type="button"
//                     onClick={() => fileInputRef.current?.click()}
//                     className="btn-primary inline-flex items-center"
//                   >
//                     <Upload size={18} className="mr-2" />
//                     Browse Files
//                   </button>
//                   <input
//                     type="file"
//                     ref={fileInputRef}
//                     onChange={handleFileChange}
//                     accept="image/*"
//                     className="hidden"
//                   />
//                 </div>
//               )}
//             </div>
            
//             {uploadError && (
//               <div className="flex items-start text-red-500 text-sm">
//                 <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
//                 <span>{uploadError}</span>
//               </div>
//             )}
            
//             {/* Meme Details */}
//             {previewUrl && (
//               <motion.div
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: 'auto' }}
//                 transition={{ duration: 0.3 }}
//                 className="space-y-6"
//               >
//                 <div>
//                   <div className="flex justify-between items-center mb-2">
//                     <label htmlFor="name" className="block text-sm font-medium">
//                       Meme Caption
//                     </label>
//                     <button
//                       type="button"
//                       onClick={generateCaption}
//                       disabled={isGeneratingCaption}
//                       className="flex items-center text-sm text-indigo-500 hover:text-indigo-600"
//                     >
//                       {isGeneratingCaption ? (
//                         <span className="flex items-center">
//                           <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mr-2"></div>
//                           Generating...
//                         </span>
//                       ) : (
//                         <>
//                           <Sparkles size={16} className="mr-1" />
//                           Generate AI Caption
//                         </>
//                       )}
//                     </button>
//                   </div>
//                   <input
//                     id="name"
//                     {...register('name', { required: 'Caption is required' })}
//                     className={`input w-full ${darkMode ? 'dark' : 'light'} ${
//                       errors.name ? 'border-red-500 focus:ring-red-500' : ''
//                     }`}
//                     placeholder="Enter a funny caption for your meme"
//                   />
//                   {errors.name && (
//                     <p className="mt-1 text-red-500 text-sm">{errors.name.message}</p>
//                   )}
//                 </div>
                
//                 <div>
//                   <label htmlFor="category" className="block text-sm font-medium mb-2">
//                     Category
//                   </label>
//                   <select
//                     id="category"
//                     {...register('category', { required: 'Category is required' })}
//                     className={`input w-full ${darkMode ? 'dark' : 'light'}`}
//                   >
//                     <option value="random">Random</option>
//                     <option value="trending">Trending</option>
//                     <option value="new">New</option>
//                     <option value="classic">Classic</option>
//                   </select>
//                 </div>
                
//                 <div className="pt-4">
//                   <button
//                     type="submit"
//                     disabled={isUploading}
//                     className="btn-primary w-full py-3 text-lg flex items-center justify-center"
//                   >
//                     {isUploading ? (
//                       <>
//                         <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                         Uploading...
//                       </>
//                     ) : (
//                       <>
//                         <Upload size={20} className="mr-2" />
//                         Upload Meme
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </motion.div>
//             )}
//           </form>
//         )}
//       </motion.div>
//     </div>
//   );
// };

// export default MemeUpload;



import React, { useState, useRef } from "react";
import { Upload, X, Check, AlertCircle, Image } from "lucide-react";
import { motion } from "framer-motion";

const UploadComponent: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match("image.*")) {
      setUploadError("Please select an image file (PNG, JPG, GIF)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size should be less than 5MB");
      return;
    }

    setSelectedFile(file);
    setUploadError("");

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError("Please select an image to upload");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    const formData = new FormData();
    formData.append("file", selectedFile);
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!uploadPreset) {
      setUploadError("Cloudinary upload preset is not defined");
      setIsUploading(false);
      return;
    }
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setUploadedImageUrl(data.secure_url); // Cloudinary URL of the uploaded image
    } catch (error) {
      setUploadError("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Upload an Image</h1>

      {/* Image Preview */}
      {previewUrl && (
        <div className="relative w-full flex justify-center">
          <img src={previewUrl} alt="Preview" className="max-w-full h-64 rounded-lg shadow-md" />
          <button
            type="button"
            onClick={() => {
              setSelectedFile(null);
              setPreviewUrl("");
            }}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
          >
            <X size={18} />
          </button>
        </div>
      )}

      Upload Input
      <div className="mt-4">
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="btn-primary flex items-center space-x-2"
        >
          <Upload size={20} />
          <span>Select Image</span>
        </button>
      </div>

      {/* Upload Button */}
      {previewUrl && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
          <button
            onClick={handleUpload}
            className="btn-primary w-full py-3 flex items-center justify-center"
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload to Cloudinary"}
          </button>
        </motion.div>
      )}

      {/* Upload Success */}
      {uploadedImageUrl && (
        <div className="mt-4 p-4 border border-green-500 rounded-md text-green-600">
          <Check size={20} className="inline-block mr-2" />
          Upload successful! <a href={uploadedImageUrl} target="_blank" className="text-blue-500">View Image</a>
        </div>
      )}

      {/* Upload Error */}
      {uploadError && (
        <div className="mt-4 p-4 border border-red-500 rounded-md text-red-600">
          <AlertCircle size={20} className="inline-block mr-2" />
          {uploadError}
        </div>
      )}


      
    </div>
  );
};

export default UploadComponent;
