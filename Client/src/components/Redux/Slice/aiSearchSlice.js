import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { fetchMoviesPoster } from './searchSlice';
import {useDispatch} from 'react-redux';


const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // Ensure your API key is set in the environment
const initialState = {
  movieRecommendations: [],
  aiLoading: false,
  error: null,
};

export const fetchAiRecommendations = createAsyncThunk(
  'aiSearch/fetchAiRecommendations',
  async (query, { rejectWithValue }) => {
    const dispatch = useDispatch();
      const schema = {
      description: 'List of at least 5 or more recommendations of movies or series related to description or keywords',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          movieId: {
            type: 'string',
            description: 'ID of the movie from TMDB',
            nullable: false,
          },
          type: {
            type: 'string',
            description: 'movie or tv',
            nullable: false,
          },
        },
        required: ['movieId', 'type'],
      },
    };

    try {
      // Initialize Google Generative AI client
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash-exp',
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: schema,
        },
      });

      // Generate content with the provided query
      const result = await model.generateContent(query);

      // Extract recommendations from the response
      const rawText = result.response?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        console.error('No text found in the response');
        return rejectWithValue({ query, recommendations: [], error: 'No text found in the response' });
      }

      // Parse the text field into JSON
      let recommendations;
      try {
        recommendations = JSON.parse(rawText);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        return rejectWithValue({ query, error: 'Invalid JSON format in response' });
      }
      dispatch(fetchMoviesPoster(recommendations));
      return { query, recommendations };
      
        } catch (error) {
      console.error('Error fetching recommendations:', error);
      return rejectWithValue({ query, error: error.message  });
    }
  }
);

const aiSearchSlice = createSlice({
  name: 'aiSearch',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAiRecommendations.pending, (state) => {
        state.aiLoading = true;
        state.error = null;
      })
      .addCase(fetchAiRecommendations.fulfilled, (state, action) => {
        state.aiLoading = false;
        state.movieRecommendations = action.payload.recommendations;
      })
      .addCase(fetchAiRecommendations.rejected, (state, action) => {
        state.aiLoading = false;
        state.error = action.payload.error;
      });
  },
});

export default aiSearchSlice.reducer;
