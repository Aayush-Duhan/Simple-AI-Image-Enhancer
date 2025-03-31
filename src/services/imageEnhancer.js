import axios from "axios";

const BASE_URL = "http://localhost:3001"; // URL of our backend proxy
const MAXIMUM_RETRIES = 20; // Max polling attempts

export const enhanceImage = async (file) => {
    try {
        const taskId = await uploadImage(file);
        console.log("Image Uploaded Successfully, Task ID:", taskId);

        const enhancedImageData = await PollForEnhancedImage(taskId);
        console.log("Enhanced Image Data:", enhancedImageData);

        return enhancedImageData;
    } catch (error) {
        // Log the error potentially coming from the backend or network issues
        console.error("Error enhancing image:", error.response?.data?.message || error.message);
        // Optionally re-throw or return an error indicator to the UI
        throw error; // Re-throw the error so the component can handle it (e.g., show message)
    }
};

const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image_file", file);

    // Send image to our backend proxy
    const { data } = await axios.post(
        `${BASE_URL}/api/enhance`, // Endpoint on our backend
        formData,
        {
            headers: {
                // Content-Type is set automatically by browser for FormData
                // No API Key needed here
            },
        }
    );

    // Our backend returns { taskId: '...' } directly
    if (!data?.taskId) {
        throw new Error("Failed to upload image! Task ID not received from backend.");
    }
    return data.taskId;
};

const PollForEnhancedImage = async (taskId, retries = 0) => {
    const result = await fetchEnhancedImage(taskId);

    // Check if the task state indicates it's still processing (state 4 means processing)
    if (result.state === 4) {
        console.log(`Processing...(${retries}/${MAXIMUM_RETRIES})`);

        if (retries >= MAXIMUM_RETRIES) {
            throw new Error("Max retries reached. Please try again later.");
        }

        // wait for 2 second
        await new Promise((resolve) => setTimeout(resolve, 2000));

        return PollForEnhancedImage(taskId, retries + 1);
    }

    console.log("Enhanced Image URL:", result);
    return result;
};

const fetchEnhancedImage = async (taskId) => {
    // Fetch status from our backend proxy
    const { data } = await axios.get(
        `${BASE_URL}/api/status/${taskId}`, // Status endpoint on our backend
        {
            // No headers needed here
        }
    );
    // Backend forwards the external API's data structure, which might be directly the data object
    // or nested under 'data'. Adjust based on backend's response structure.
    // Assuming backend returns the external API's data directly:
    if (!data) { // Check if data object itself exists
        throw new Error("Failed to fetch enhanced image status from backend!");
    }
    // The polling logic expects the object containing 'state', etc.
    return data;
};
