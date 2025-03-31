require('dotenv').config();
const express = require('express');
const axios = require('axios');
const multer = require('multer');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001; // Use port from env or default to 3001

// --- External API Configuration ---
const EXTERNAL_API_KEY = process.env.EXTERNAL_API_KEY;
const EXTERNAL_BASE_URL = "https://techhk.aoscdn.com/";
const MAXIMUM_RETRIES = 20; // As defined in the original frontend code

if (!EXTERNAL_API_KEY) {
    console.error("FATAL ERROR: EXTERNAL_API_KEY is not defined in the environment variables.");
}


// --- Middleware ---
app.use(cors());
app.use(express.json());

// Configure Multer for file uploads (using memory storage for simplicity)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- API Endpoints ---


// POST /api/enhance - Receives image, uploads to external API, returns task ID
app.post('/api/enhance', upload.single('image_file'), async (req, res, next) => {
    console.log("Received file:", req.file?.originalname);

    if (!req.file) {
        return res.status(400).json({ message: 'No image file uploaded.' });
    }

    if (!EXTERNAL_API_KEY) {
        console.error("API Key missing in backend configuration.");
        return res.status(500).json({ message: 'Server configuration error.' });
    }

    const formData = new FormData();
    // Convert buffer to Blob before appending
    const imageBlob = new Blob([req.file.buffer], { type: req.file.mimetype });
    formData.append('image_file', imageBlob, req.file.originalname);

    try {
        console.log(`Uploading ${req.file.originalname} to external API...`);
        const { data } = await axios.post(
            `${EXTERNAL_BASE_URL}/api/tasks/visual/scale`,
            formData,
            {
                headers: {
                    'X-API-KEY': EXTERNAL_API_KEY,
                    ...formData.getHeaders?.() // Necessary for Axios with FormData in Node.js
                },
                maxBodyLength: Infinity, // Handle large file uploads
                maxContentLength: Infinity
            }
        );

        console.log("External API Response:", data);

        if (!data?.data?.task_id) {
            console.error("Failed to get task_id from external API response:", data);
            throw new Error("Failed to upload image to external service! Task ID not found.");
        }

        const taskId = data.data.task_id;
        console.log("Image Uploaded Successfully, Task ID:", taskId);
        res.json({ taskId: taskId });

    } catch (error) {
        console.error("Error in /api/enhance:", error.response?.data || error.message);
        // Forward specific error message if available, otherwise generic
        const errorMessage = error.response?.data?.message || error.message || 'Failed to process image enhancement request.';
        const statusCode = error.response?.status || 500;
        res.status(statusCode).json({ message: errorMessage });
    }
});

// GET /api/status/:taskId - Polls external API for enhancement status/result
app.get('/api/status/:taskId', async (req, res) => {
    const { taskId } = req.params;
    console.log("Checking status for task:", taskId);

    if (!EXTERNAL_API_KEY) {
        console.error("API Key missing in backend configuration.");
        return res.status(500).json({ message: 'Server configuration error.' });
    }

    try {
        const { data } = await axios.get(
            `${EXTERNAL_BASE_URL}/api/tasks/visual/scale/${taskId}`,
            {
                headers: {
                    'X-API-KEY': EXTERNAL_API_KEY,
                },
            }
        );

        console.log(`Status for task ${taskId}:`, data.data?.state, data.data?.image_url);

        if (!data?.data) {
             console.error("No data found for task:", taskId, "Response:", data);
            // It's possible the task isn't ready or doesn't exist, return appropriate status
             return res.status(404).json({ message: 'Task status not found or task not yet processed.' });
        }

        // Return the relevant data from the external API response
        // The frontend will handle the polling logic based on the 'state'
        res.json(data.data);

    } catch (error) {
        console.error(`Error fetching status for task ${taskId}:`, error.response?.data || error.message);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch task status.';
        const statusCode = error.response?.status || 500;
        res.status(statusCode).json({ message: errorMessage });
    }
});

// --- Basic Error Handling ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// --- Start Server ---
app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});