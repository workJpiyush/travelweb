import Groq from 'groq-sdk';

// API service for travel plan generation

export interface TravelFormData {
  days: number;
  startLocation: string;
  endLocation: string;
  travelMode: string[];
  interests: string[];
}

export interface TravelNode {
  time: string;
  place: string;
  activity: string;
}

export interface TravelDay {
  day: string;
  nodes: TravelNode[];
}

export interface TravelPlan {
  title: string;
  days: TravelDay[];
}

// Initialize Groq client
const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

// Test function to verify API connection
export const testGroqConnection = async (): Promise<boolean> => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: "Say 'API connection successful' if you can read this."
        }
      ],
      model: "llama-3.3-70b-versatile",
      max_tokens: 50,
    });
    
    console.log('Groq API Test Response:', completion.choices[0]?.message?.content);
    return true;
  } catch (error) {
    console.error('Groq API Test Failed:', error);
    return false;
  }
};

export const generateTravelPlan = async (formData: TravelFormData): Promise<TravelPlan> => {
  console.log('Generating travel plan with Groq API...');
  console.log('Form data:', formData);
  
  try {
    const userPrompt = `Number of days: ${formData.days}
Starting location: ${formData.startLocation}
Ending location: ${formData.endLocation}
Mode of travel: ${formData.travelMode}
Interests: ${formData.interests.join(', ')}

Please create a detailed travel itinerary.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a travel assistant that generates structured travel itineraries and mind map data from user input.

The user will provide:
- Number of days
- Starting and ending location
- Mode of travel
- Types of places they are interested in (e.g. historical, cultural, natural, etc.)

Your task is to create a day-wise travel plan with clear time slots, activities, and locations. Then, convert this into a mind map–friendly format.

Respond only in this JSON format:
{
  "title": "Trip Title",
  "days": [
    {
      "day": "Day 1",
      "nodes": [
        { "time": "6:00 AM", "place": "Place A", "activity": "Activity 1" },
        { "time": "10:00 AM", "place": "Place B", "activity": "Activity 2" }
      ]
    },
    {
      "day": "Day 2",
      "nodes": [
        { "time": "9:00 AM", "place": "Place C", "activity": "Activity 3" }
      ]
    }
  ]
}
Keep all descriptions short. Do not return any explanation or extra text — only the JSON.`
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 2048,
    });

    console.log('Groq API Response received');
    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No response from AI service');
    }

    // Parse the JSON response
    console.log('📋 SYSTEM PROMPT BEING SENT TO LLM:');
    console.log('=====================================');
    console.log(`You are a travel assistant that generates structured travel itineraries and mind map data from user input.

The user will provide:
- Number of days
- Starting and ending location  
- Mode of travel
- Types of places they are interested in (e.g. historical, cultural, natural, etc.)

Your task is to create a comprehensive day-wise travel plan that includes:
- 6-8 activities per day with realistic timing (start early, end late)
- Mix of major attractions, local experiences, meals, and transportation
- Specific location names, addresses when possible
- Detailed activity descriptions
- Consider travel time between locations
- Include breakfast, lunch, dinner, and snack breaks
- Add shopping, rest periods, and evening entertainment
- Account for opening hours and seasonal considerations
- Provide backup indoor activities for weather
- Include local transportation details
- Consider the user's interests heavily in activity selection

For timing:
- Start days early (6:00-7:00 AM)
- End days late (9:00-11:00 PM)
- Include realistic travel times between locations
- Account for meal times and rest breaks
- Consider peak hours and crowds

IMPORTANT REQUIREMENTS:
- Each day must have 8-10 detailed activities from early morning to late evening
- Use specific place names, not generic terms
- Activities should be diverse: attractions, meals, culture, nature, shopping, entertainment
- Consider the user's selected interests heavily
- Include realistic travel logistics and timing
- Account for the chosen mode of travel in planning routes
- Provide rich, specific activity descriptions
- No explanations or extra text - only the JSON response`);
    console.log('=====================================');
    let travelPlan: TravelPlan;
    try {
      console.log('Parsing response:', response);
      travelPlan = JSON.parse(response);
    } catch (parseError) {
      console.error('Failed to parse AI response:', response);
      throw new Error('Invalid response format from AI service');
    }

    // Validate the response structure
    if (!travelPlan.title || !Array.isArray(travelPlan.days)) {
      throw new Error('Invalid travel plan structure received');
    }

    console.log('Travel plan generated successfully:', travelPlan);
    return travelPlan;

  } catch (error) {
    console.error('Error generating travel plan:', error);
    
    // Fallback to a basic plan if API fails
    const fallbackPlan: TravelPlan = {
      title: `${formData.days}-Day Journey: ${formData.startLocation} to ${formData.endLocation}`,
      days: Array.from({ length: formData.days }, (_, index) => ({
        day: `Day ${index + 1}`,
        nodes: [
          {
            time: "9:00 AM",
            place: index === 0 ? formData.startLocation : 
                   index === formData.days - 1 ? formData.endLocation : 
                   `Stop ${index}`,
            activity: `Explore ${formData.interests[0] || 'local'} attractions`
          },
          {
            time: "2:00 PM",
            place: "Local Area",
            activity: `Visit ${formData.interests[1] || 'cultural'} sites`
          },
          {
            time: "6:00 PM",
            place: "City Center",
            activity: "Dinner and evening exploration"
          }
        ]
      }))
    };

    return fallbackPlan;
  }
};