# AI Image Enhancer

A simple web application that allows users to upload an image and enhance its quality using an external AI-powered image enhancement service.

## Features

*   **Image Upload:** Drag-and-drop or click to select an image file (JPG, PNG, WEBP).
*   **AI Enhancement:** Sends the uploaded image to an external API for enhancement.
*   **Polling Mechanism:** Checks the status of the enhancement task periodically.
*   **Image Preview:** Displays the original and enhanced images side-by-side.
*   **Download:** Allows downloading the enhanced image.
*   **Comparison View:** Opens a new tab to compare the original and enhanced images directly.

## How It Works

1.  **Frontend (React + Vite):**
    *   The user uploads an image via the web interface.
    *   The frontend sends the image file to the backend server.
    *   After receiving a task ID from the backend, the frontend polls the backend's status endpoint until the enhancement is complete.
    *   Displays the original and enhanced images.
2.  **Backend (Node.js + Express):**
    *   Acts as a proxy server.
    *   Receives the image file from the frontend.
    *   Forwards the image file to the external AI enhancement API using an API key stored securely in environment variables.
    *   Returns the task ID received from the external API to the frontend.
    *   Provides an endpoint for the frontend to check the status of the enhancement task by querying the external API.
3.  **External AI API (e.g., Clipdrop, TechHK):**
    *   Receives the image and API key from the backend.
    *   Processes the image enhancement task asynchronously.
    *   Provides endpoints to submit tasks and check their status/results.

## Setup and Installation

### Prerequisites

*   [Node.js](https://nodejs.org/) (LTS version recommended)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Create environment file:**
    *   Create a file named `.env` in the `backend` directory.
    *   Add your external API key to this file:
        ```env
        EXTERNAL_API_KEY=YOUR_ACTUAL_API_KEY_HERE
        PORT=3001 # Optional: Define a port for the backend server
        ```
    *   **Important:** Replace `YOUR_ACTUAL_API_KEY_HERE` with your real API key. Add `.env` to your `.gitignore` file if it's not already there to avoid committing your key.
4.  **Start the backend server:**
    ```bash
    npm start
    # or
    yarn start
    ```
    The backend server should now be running (typically at `http://localhost:3001`).

### Frontend Setup

1.  **Navigate to the project root directory (if you were in `backend`):**
    ```bash
    cd ..
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Start the frontend development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The frontend application should now be running (typically at `http://localhost:5174`).

## Usage

1.  Ensure both the backend and frontend servers are running.
2.  Open your web browser and navigate to the frontend URL (e.g., `http://localhost:5174`).
3.  Click the upload area or drag an image file onto it.
4.  Wait for the enhancement process to complete. The enhanced image will appear alongside the original.
5.  Use the "Download Enhanced" or "Compare Images" buttons as needed.

## Technology Stack

*   **Frontend:** React, Vite, Tailwind CSS, Axios
*   **Backend:** Node.js, Express, Axios, Multer, dotenv
*   **External Service:** AI Image Enhancement API (configured via `EXTERNAL_API_KEY`)

---