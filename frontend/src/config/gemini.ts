// Gemini API Configuration
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Validate that the API key is available
if (!GEMINI_API_KEY) {
    console.warn('Warning: VITE_GEMINI_API_KEY is not set in environment variables');
}

export const geminiConfig = {
    apiKey: GEMINI_API_KEY,
    model: 'gemini-pro', // Default model
};
