import React from 'react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import Loading from './Loading';

const ImagePreview = ({ originalImage, enhancedImage, isLoading }) => {
    // If loading, show the loading indicator
    if (isLoading) {
        return (
            <div className="mt-8 w-full max-w-2xl p-4 bg-white dark:bg-gray-800 shadow-lg rounded-2xl flex justify-center items-center min-h-[300px]">
                <Loading />
                {/* Optionally show original image dimmed while loading */}
                {/* originalImage && <img src={originalImage} alt="Original Uploaded" className="mt-4 max-w-full h-auto rounded opacity-50" /> */}
            </div>
        );
    }

    // If not loading but no original image, show nothing or a placeholder
    if (!originalImage) {
        return null; // Or a placeholder message like <p>Upload an image to see the preview.</p>
    }

    // If not loading and original image exists, but no enhanced image yet (after upload, before enhancement finishes or if enhancement failed)
    // We only show the original image in this case.
    if (originalImage && !enhancedImage && !isLoading) {
         return (
             <div className="mt-8 w-full max-w-2xl p-4 bg-white dark:bg-gray-800 shadow-lg rounded-2xl">
                <h2 className="text-xl font-semibold text-center text-gray-700 dark:text-gray-300 mb-4">Original Image</h2>
                <img src={originalImage} alt="Original Uploaded" className="max-w-full h-auto rounded mx-auto" style={{ maxHeight: '60vh' }} />
            </div>
         );
    }


    // If both images are available, show the comparison slider
    if (originalImage && enhancedImage) {
        // Define common styles to ensure images fit within their container and align
        const imageStyle = {
            width: '100%',
            height: '100%',
            objectFit: 'contain', // Fit entire image within the container, preserving aspect ratio
            display: 'block', // Prevents potential extra space below the image
        };

        return (
             <div className="mt-8 w-full max-w-2xl p-4 bg-white dark:bg-gray-800 shadow-lg rounded-2xl">
                 <h2 className="text-xl font-semibold text-center text-gray-700 dark:text-gray-300 mb-4">Compare Images</h2>
                 {/* --- Start of ReactCompareSlider code --- */}
                 <ReactCompareSlider
                     style={{ height: '70vh', width: '100%', margin: '0 auto' }}
                    itemOne={
                        <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                             <ReactCompareSliderImage
                                src={originalImage}
                                alt="Original Image"
                                style={imageStyle} // Apply styles
                             />
                        </div>
                     }
                    itemTwo={
                        <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                            <ReactCompareSliderImage
                                src={enhancedImage}
                                alt="Enhanced Image"
                                style={imageStyle} // Apply styles
                             />
                        </div>
                     }
                />
                {/* --- End of ReactCompareSlider code --- */}
                 {/* --- EDIT START: Restore the download button --- */}
                 <div className="text-center mt-4">
                        <a
                          href={enhancedImage} // Use the enhanced image URL
                          download="enhanced-image.png" // Suggest a filename for download
                          className="inline-block bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition duration-300"
                        >
                            Download Enhanced Image
                        </a>
                 </div>
                 {/* --- EDIT END --- */}
            </div>
        );
        // The closing bracket for this block might look duplicated due to the previous comment format, it's correct.
    }

    // Fallback case (shouldn't normally be reached)
    return null;
};

export default ImagePreview;
