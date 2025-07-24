import React, { useState } from 'react';
import TravelForm from './components/TravelForm';
import MindMap from './components/MindMap';
import { generateTravelPlan, testGroqConnection, TravelFormData, TravelPlan } from './services/api';
import { ArrowLeft, Plane, MapPin } from 'lucide-react';

function App() {
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Test API connection on component mount
  React.useEffect(() => {
    const testAPI = async () => {
      console.log('Testing Groq API connection...');
      const isConnected = await testGroqConnection();
      console.log('API Connection Status:', isConnected ? 'SUCCESS' : 'FAILED');
    };
    testAPI();
  }, []);

  const handleFormSubmit = async (formData: TravelFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const plan = await generateTravelPlan(formData);
      setTravelPlan(plan);
    } catch (err) {
      setError('Failed to generate travel plan. Please try again.');
      console.error('Error generating travel plan:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartOver = () => {
    setTravelPlan(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">TravelMind</h1>
            </div>
            
            {travelPlan && (
              <button
                onClick={handleStartOver}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Plan New Trip</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-red-600 text-sm font-medium">{error}</div>
            </div>
          </div>
        )}

        {!travelPlan ? (
          <TravelForm onSubmit={handleFormSubmit} loading={loading} />
        ) : (
          <MindMap travelPlan={travelPlan} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <MapPin className="w-5 h-5 text-gray-600" />
              <span className="text-gray-600 text-sm">
                Ready to integrate with your LLM API? Update the API service in `/src/services/api.ts`
              </span>
            </div>
            <p className="text-gray-500 text-sm">
              TravelMind - Intelligent Travel Planning © 2025
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;