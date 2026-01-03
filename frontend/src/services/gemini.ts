import { GEMINI_API_KEY } from '../config/gemini';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

interface GeminiResponse {
    candidates: Array<{
        content: {
            parts: Array<{
                text: string;
            }>;
        };
    }>;
}

interface MemoryInsight {
    values: string[];
    emotions: string[];
    themes: string[];
    lifeLesson: string;
    summary: string;
}

export const geminiService = {
    /**
     * Analyze a memory using Gemini AI to extract insights
     */
    async analyzeMemory(memoryText: string): Promise<MemoryInsight> {
        if (!GEMINI_API_KEY) {
            throw new Error('Gemini API key is not configured');
        }

        const prompt = `
Analyze the following personal memory and extract meaningful insights:

Memory: "${memoryText}"

Please provide a structured analysis in the following JSON format:
{
    "values": ["list of core values demonstrated in this memory"],
    "emotions": ["list of emotions expressed or felt"],
    "themes": ["list of life themes or topics"],
    "lifeLesson": "a concise life lesson or wisdom from this memory",
    "summary": "a brief 2-3 sentence summary of the memory"
}

Respond ONLY with valid JSON, no additional text.
        `;

        try {
            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            });

            if (!response.ok) {
                throw new Error(`Gemini API error: ${response.statusText}`);
            }

            const data: GeminiResponse = await response.json();
            const text = data.candidates[0]?.content?.parts[0]?.text;

            if (!text) {
                throw new Error('No response from Gemini API');
            }

            // Extract JSON from response (remove markdown code blocks if present)
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('Invalid JSON response from Gemini API');
            }

            return JSON.parse(jsonMatch[0]);
        } catch (error) {
            console.error('Error analyzing memory with Gemini:', error);
            throw error;
        }
    },

    /**
     * Generate personalized insights from multiple memories
     */
    async generatePersonalInsights(memories: string[]): Promise<string> {
        if (!GEMINI_API_KEY) {
            throw new Error('Gemini API key is not configured');
        }

        const prompt = `
Based on the following collection of personal memories, generate a comprehensive personal insight report:

Memories:
${memories.map((m, i) => `${i + 1}. ${m}`).join('\n')}

Please provide:
1. Overall patterns in values and beliefs
2. Recurring themes in life experiences
3. Character strengths demonstrated
4. Growth areas and opportunities
5. A personalized wisdom statement

Write this as a thoughtful, encouraging narrative (3-4 paragraphs).
        `;

        try {
            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            });

            if (!response.ok) {
                throw new Error(`Gemini API error: ${response.statusText}`);
            }

            const data: GeminiResponse = await response.json();
            const text = data.candidates[0]?.content?.parts[0]?.text;

            if (!text) {
                throw new Error('No response from Gemini API');
            }

            return text;
        } catch (error) {
            console.error('Error generating insights with Gemini:', error);
            throw error;
        }
    },

    /**
     * Generate a legacy book summary
     */
    async generateLegacyBook(userData: {
        name: string;
        memories: Array<{ title: string; content: string; date: string }>;
    }): Promise<string> {
        if (!GEMINI_API_KEY) {
            throw new Error('Gemini API key is not configured');
        }

        const prompt = `
Create a beautiful legacy book introduction for ${userData.name} based on their life memories:

Memories:
${userData.memories.map(m => `
Date: ${m.date}
Title: ${m.title}
Content: ${m.content}
`).join('\n---\n')}

Write a compelling introduction (4-5 paragraphs) that:
1. Captures the essence of their life journey
2. Highlights key values and principles
3. Celebrates their unique story
4. Provides wisdom for future generations
5. Ends with an inspiring message

Write in a warm, respectful, and celebratory tone.
        `;

        try {
            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            });

            if (!response.ok) {
                throw new Error(`Gemini API error: ${response.statusText}`);
            }

            const data: GeminiResponse = await response.json();
            const text = data.candidates[0]?.content?.parts[0]?.text;

            if (!text) {
                throw new Error('No response from Gemini API');
            }

            return text;
        } catch (error) {
            console.error('Error generating legacy book with Gemini:', error);
            throw error;
        }
    },

    /**
     * Get AI-powered suggestions for memory prompts
     */
    async getMemoryPrompts(context?: string): Promise<string[]> {
        if (!GEMINI_API_KEY) {
            throw new Error('Gemini API key is not configured');
        }

        const prompt = context
            ? `Based on this context: "${context}", suggest 5 thoughtful memory prompts that would help someone reflect on and record meaningful life experiences. Return as a JSON array of strings.`
            : `Suggest 5 thoughtful memory prompts that would help someone reflect on and record meaningful life experiences. Return as a JSON array of strings.`;

        try {
            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            });

            if (!response.ok) {
                throw new Error(`Gemini API error: ${response.statusText}`);
            }

            const data: GeminiResponse = await response.json();
            const text = data.candidates[0]?.content?.parts[0]?.text;

            if (!text) {
                throw new Error('No response from Gemini API');
            }

            // Extract JSON array from response
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (!jsonMatch) {
                throw new Error('Invalid JSON response from Gemini API');
            }

            return JSON.parse(jsonMatch[0]);
        } catch (error) {
            console.error('Error getting memory prompts from Gemini:', error);
            throw error;
        }
    }
};

export default geminiService;
