import { GoogleGenAI, Type } from "@google/genai";
import { Scene } from './types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateHistoricalScript = async (topic: string): Promise<Scene[]> => {
    try {
        const prompt = `You are a creative scriptwriter specializing in short, engaging content for social media. Generate a script for a 15-30 second Instagram Reel about '${topic}'. The script should be fun, fascinating, and easy to follow. Structure it as a JSON object with a "scenes" array. Each scene object in the array should have two keys: "visual" (a concise string describing the visual footage, suitable as a prompt for an image generation AI) and "voiceover" (a string for the spoken lines).`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        scenes: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    visual: {
                                        type: Type.STRING,
                                        description: "A concise description of the visual content for the scene, suitable for an image generation AI."
                                    },
                                    voiceover: {
                                        type: Type.STRING,
                                        description: "The voiceover text for the scene."
                                    }
                                },
                                required: ['visual', 'voiceover']
                            }
                        }
                    },
                    required: ['scenes']
                }
            }
        });

        const jsonText = response.text;
        const parsed = JSON.parse(jsonText);
        
        if (parsed.scenes && Array.isArray(parsed.scenes)) {
            return parsed.scenes;
        } else {
            throw new Error("Invalid response format from API: 'scenes' array not found.");
        }
    } catch (error) {
        console.error("Error generating historical script:", error);
        if (error instanceof Error) {
            throw new Error(`An error occurred: ${error.message}`);
        }
        throw new Error("An unknown error occurred while generating the script.");
    }
};

export const generateImage = async (prompt: string): Promise<string> => {
    try {
        const enhancedPrompt = `cinematic stock photo, high quality, ${prompt}`;
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: enhancedPrompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/png',
              aspectRatio: '9:16',
            },
        });
        
        if (response.generatedImages && response.generatedImages.length > 0) {
            return response.generatedImages[0].image.imageBytes;
        }
        
        throw new Error('Image generation failed to produce an image.');

    } catch(error) {
        console.error(`Error generating image for prompt: "${prompt}"`, error);
        throw error;
    }
};


export const findHiddenFacts = async (topic: string, numFacts: number, language: string): Promise<string[]> => {
    try {
        const prompt = `Find ${numFacts} surprising and little-known facts about '${topic}'. The facts must be in ${language}. Present the facts in a randomized order.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        facts: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING,
                                description: `A single surprising fact about ${topic} in ${language}.`
                            }
                        }
                    },
                    required: ['facts']
                }
            }
        });

        const jsonText = response.text;
        const parsed = JSON.parse(jsonText);
        
        if (parsed.facts && Array.isArray(parsed.facts)) {
            return parsed.facts;
        } else {
            throw new Error("Invalid response format from API.");
        }

    } catch (error) {
        console.error("Error finding hidden facts:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to fetch facts: ${error.message}`);
        }
        throw new Error("An unknown error occurred while fetching facts.");
    }
};
