import React, { useState } from 'react'
import ImageUpload from './ImageUpload'
import ImagePreview from './ImagePreview'
import { enhanceImage } from '../services/imageEnhancer'
const Home = () => {
  const [originalImage, setOriginalImage] = useState(null)
  const [enhancedImage, setEnhancedImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleImageUpload = async(imageFile) => {
    if (imageFile) {
      const imageUrl = URL.createObjectURL(imageFile)
      setOriginalImage(imageUrl)
      
      setIsLoading(true)
      setEnhancedImage(null)
      
      try {
        const enhancedImageData = await enhanceImage(imageFile)
        // Extract the image URL from the response object
        setEnhancedImage(enhancedImageData.image)
        setIsLoading(false)
      } catch (error) {
        console.log(error);
        alert('Failed to enhance image. Please try again later.')
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="flex flex-col items-center w-full">
      <ImageUpload onImageUpload={handleImageUpload} />
      <ImagePreview 
        originalImage={originalImage} 
        enhancedImage={enhancedImage}
        isLoading={isLoading}
      />
    </div>
  )
}

export default Home
