import React, { useState, useRef } from 'react'

const ImageUpload = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState('')
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      processFile(file)
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      processFile(file)
    }
  }

  const processFile = (file) => {
    if (!file.type.match('image.*')) {
      alert('Please select an image file')
      return
    }
    
    setFileName(file.name)
    onImageUpload(file)
  }

  const handleClick = () => {
    fileInputRef.current.click()
  }

  return (
    <div className='bg-white shadow-lg rounded-2xl w-full max-w-2xl p-6'>
      <div 
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input 
          type="file" 
          id="fileInput" 
          ref={fileInputRef}
          className='hidden' 
          accept="image/*"
          onChange={handleFileChange}
        />
        
        <div className="flex flex-col items-center justify-center py-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          
          <p className='text-lg font-medium text-gray-600 mb-1'>
            {fileName ? `Selected: ${fileName}` : 'Click or drag to upload an image'}
          </p>
          <p className='text-sm text-gray-500'>
            Supports JPG, PNG, WEBP (Max 10MB)
          </p>
        </div>
      </div>
    </div>
  )
}

export default ImageUpload
