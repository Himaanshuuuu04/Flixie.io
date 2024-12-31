import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState, useContext, createContext } from "react";

// Create context for AI Recommendations
const AiRecommendationContext = createContext();

export const AiRecommendationProvider = ({ children }) => {
    const [movieRecommendations, setMovieRecommendations] = useState([]);
    const [aiLoading, setAiLoading] = useState(false);

    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // Ensure your API key is set in the environment

    async function fetchAiRecommendations(query) {
        const schema = {
            description: "List of at least 5 or more recommendations of movies related to description or keywords",
            type: "array",
            items: {
                type: "object",
                properties: {
                    movieId: {
                        type: "string",
                        description: "ID of the movie from TMDB",
                        nullable: false,
                    },
                },
                required: ["movieId"],
            },
        };
    
        try {
            if (aiLoading) return;
            setAiLoading(true);
    
            // Initialize Google Generative AI client
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({
                model: "gemini-2.0-flash-exp",
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: schema,
                },
            });
    
            // Generate content with the provided query
            const result = await model.generateContent(query);
    
            // Log the full response for debugging
            console.log("Full response:", result);
    
            // Extract recommendations from the response
            const rawText = result.response?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!rawText) {
                console.error("No text found in the response");
                return { success: false, query, recommendations: [] };
            }
    
            // Parse the text field into JSON
            let recommendations;
            try {
                recommendations = JSON.parse(rawText);
            } catch (parseError) {
                console.error("Error parsing JSON:", parseError);
                return { success: false, query, error: "Invalid JSON format in response" };
            }
    
            // Update state with recommendations
            setMovieRecommendations(recommendations);
            console.log("Parsed recommendations:", recommendations);
            return { success: true, query, recommendations };
        } catch (error) {
            console.error("Error fetching recommendations:", error);
            return { success: false, query, error: error.message || "An error occurred while fetching recommendations" };
        } finally {
            setAiLoading(false);
        }
    }
    

    return (
        <AiRecommendationContext.Provider value={{ fetchAiRecommendations, movieRecommendations, aiLoading }}>
            {children}
        </AiRecommendationContext.Provider>
    );
};

export const useAiRecommendationContext = () => useContext(AiRecommendationContext);
