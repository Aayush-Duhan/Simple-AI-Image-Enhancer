import React from 'react'
import { preload } from 'react-dom'

const ImagePreview = ({ originalImage, enhancedImage, isLoading }) => {
  // Preload images when they're available
  if (originalImage && typeof originalImage === 'string') {
    preload(originalImage, { as: 'image' })
  }
  if (enhancedImage && typeof enhancedImage === 'string') {
    preload(enhancedImage, { as: 'image' })
  }

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl">
        <h2 className="text-xl font-semibold text-center bg-gray-800 text-white py-2">Uploaded Image</h2>
        {originalImage ? (
          <img 
            src={originalImage} 
            alt="Uploaded Image" 
            className="w-full h-80 object-contain p-2" 
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-80 bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 text-gray-500">No Image Uploaded</p>
          </div>
        )}
      </div>
      <div className="bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl">
        <h2 className="text-xl font-semibold text-center bg-gray-800 text-white py-2">Enhanced Image</h2>
        {enhancedImage ? (
          <img 
            src={enhancedImage} 
            alt="Enhanced Image" 
            className="w-full h-80 object-contain p-2" 
          />
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center h-80 bg-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Enhancing image...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-80 bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <p className="mt-2 text-gray-500">No Enhanced Image</p>
          </div>
        )}
      </div>
      {(originalImage || enhancedImage) && (
        <div className="col-span-1 md:col-span-2 flex justify-center gap-4 mt-2">
          {enhancedImage && (
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => window.open(enhancedImage, '_blank')}
            >
              Download Enhanced
            </button>
          )}
          {originalImage && enhancedImage && (
            <button 
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              onClick={() => {
                // Create a side-by-side comparison view
                const win = window.open("", "_blank");
                win.document.write(`
                  <html>
                    <head>
                      <title>Image Comparison</title>
                      <style>
                        body { margin: 0; display: flex; height: 100vh; }
                        .comparison { display: flex; width: 100%; height: 100%; }
                        .image-container { flex: 1; padding: 10px; }
                        img { max-width: 100%; max-height: 100%; object-fit: contain; }
                        h2 { text-align: center; }
                      </style>
                    </head>
                    <body>
                      <div class="comparison">
                        <div class="image-container">
                          <h2>Original</h2>
                          <img src="${originalImage}" alt="Original" />
                        </div>
                        <div class="image-container">
                          <h2>Enhanced</h2>
                          <img src="${enhancedImage}" alt="Enhanced" />
                        </div>
                      </div>
                    </body>
                  </html>
                `);
              }}
            >
              Compare Images
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default ImagePreview
