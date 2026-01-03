# Gemini API Integration Guide

## Overview
This project uses Google's Gemini AI API for advanced AI-powered features in the Digital Memory Preservation platform.

## Setup

### Frontend Configuration
The Gemini API key is stored in the frontend `.env` file:

```bash
VITE_GEMINI_API_KEY=your-api-key-here
```

### Backend Configuration
Add the Gemini API key to your backend `.env` file:

```bash
GEMINI_API_KEY=your-api-key-here
```

## Usage

### Frontend
Import the Gemini configuration in your components:

```typescript
import { GEMINI_API_KEY, geminiConfig } from '../config/gemini';

// Use the API key for Gemini API calls
const apiKey = geminiConfig.apiKey;
```

### Example Use Cases
1. **Memory Analysis**: Analyze uploaded memories to extract insights
2. **AI Insights**: Generate personalized insights from user data
3. **Content Generation**: Create summaries and recommendations
4. **Natural Language Processing**: Process and understand user inputs

## Security Notes
- Never commit `.env` files to version control
- Keep your API key secure and rotate it regularly
- Use environment variables for all sensitive data
- Consider implementing rate limiting for API calls

## API Documentation
For more information about the Gemini API, visit:
https://ai.google.dev/docs
