import React, { useState } from 'react';
import { MapPin, Calendar, Car, Bus, Bike, Footprints, Camera, Building, TreePine, Palette, Clock, ChevronDown, Search, Settings, Type } from 'lucide-react';

interface TravelFormData {
  days: number;
  startLocation: string;
  endLocation: string;
  userDescription: string;
  travelModes: string[];
  interests: string[];
  customInterests: string;
  enableTravelMode: boolean;
  enableInterests: boolean;
}

interface TravelFormProps {
  onSubmit: (data: TravelFormData) => void;
  loading: boolean;
}

const TravelForm: React.FC<TravelFormProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState<TravelFormData>({
    days: 3,
    startLocation: '',
    endLocation: '',
    userDescription: '',
    travelModes: [],
    interests: [],
    customInterests: '',
    enableTravelMode: false,
    enableInterests: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showMoreInterests, setShowMoreInterests] = useState(false);
  const [interestSearch, setInterestSearch] = useState('');

  const travelModes = [
    { id: 'local-bus', label: 'Local Bus', icon: Bus },
    { id: 'car', label: 'Car', icon: Car },
    { id: 'bike', label: 'Bike', icon: Bike },
    { id: 'walking', label: 'Walking', icon: Footprints }
  ];

  const allInterests = [
    { id: 'historic', label: 'Historic Sites', icon: Building, color: 'bg-amber-100 text-amber-800 border-amber-200' },
    { id: 'cultural', label: 'Cultural', icon: Palette, color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { id: 'nature', label: 'Nature', icon: TreePine, color: 'bg-green-100 text-green-800 border-green-200' },
    { id: 'outdoor', label: 'Outdoor', icon: TreePine, color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { id: 'art', label: 'Art', icon: Palette, color: 'bg-pink-100 text-pink-800 border-pink-200' },
    { id: 'festival', label: 'Festival', icon: Camera, color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { id: 'urban', label: 'Urban', icon: Building, color: 'bg-gray-100 text-gray-800 border-gray-200' },
    { id: 'spiritual', label: 'Spiritual', icon: Building, color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    { id: 'food', label: 'Food', icon: Camera, color: 'bg-orange-100 text-orange-800 border-orange-200' },
    { id: 'photography', label: 'Photography', icon: Camera, color: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
    { id: 'educational', label: 'Educational', icon: Building, color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    { id: 'wildlife', label: 'Wildlife', icon: TreePine, color: 'bg-lime-100 text-lime-800 border-lime-200' },
    { id: 'adventure', label: 'Adventure', icon: TreePine, color: 'bg-red-100 text-red-800 border-red-200' },
    { id: 'shopping', label: 'Shopping', icon: Building, color: 'bg-violet-100 text-violet-800 border-violet-200' },
    { id: 'heritage', label: 'Heritage', icon: Building, color: 'bg-rose-100 text-rose-800 border-rose-200' }
  ];

  const filteredInterests = allInterests.filter(interest =>
    interest.label.toLowerCase().includes(interestSearch.toLowerCase())
  );

  const displayedInterests = showMoreInterests ? filteredInterests : filteredInterests.slice(0, 6);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.startLocation.trim()) {
      newErrors.startLocation = 'Starting location is required';
    }
    
    if (formData.days < 1 || formData.days > 5) {
      newErrors.days = 'Number of days must be between 1 and 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInterestToggle = (interestId: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const handleTravelModeToggle = (modeId: string) => {
    setFormData(prev => ({
      ...prev,
      travelModes: prev.travelModes.includes(modeId)
        ? prev.travelModes.filter(id => id !== modeId)
        : [...prev.travelModes, modeId]
    }));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-in">Plan Your Perfect Trip</h1>
        <p className="text-lg text-gray-600 animate-slide-up">Tell us about your travel preferences and we'll create a personalized itinerary</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-8 animate-scale-in">
        {/* Trip Duration - Restricted to 5 days */}
        <div className="relative overflow-hidden">
          <label className="flex items-center text-lg font-semibold text-gray-800 mb-4">
            <Calendar className="w-5 h-5 mr-2 text-blue-600" />
            How many days is your trip? (Max 5 days)
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="1"
              max="5"
              value={formData.days}
              onChange={(e) => setFormData(prev => ({ ...prev, days: parseInt(e.target.value) }))}
              className="flex-1 h-3 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl px-6 py-3 min-w-[100px] text-center transform hover:scale-105 transition-transform">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{formData.days}</span>
              <span className="text-sm text-blue-600 block font-medium">days</span>
            </div>
          </div>
          {errors.days && <p className="text-red-500 text-sm mt-2 animate-shake">{errors.days}</p>}
        </div>

        {/* Locations */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="transform hover:scale-105 transition-transform">
            <label className="flex items-center text-lg font-semibold text-gray-800 mb-3">
              <MapPin className="w-5 h-5 mr-2 text-green-600" />
              Starting Point (Required)
            </label>
            <input
              type="text"
              value={formData.startLocation}
              onChange={(e) => setFormData(prev => ({ ...prev, startLocation: e.target.value }))}
              placeholder="e.g., New York City"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-400"
            />
            {errors.startLocation && <p className="text-red-500 text-sm mt-2 animate-shake">{errors.startLocation}</p>}
          </div>
          
          <div className="transform hover:scale-105 transition-transform">
            <label className="flex items-center text-lg font-semibold text-gray-800 mb-3">
              <MapPin className="w-5 h-5 mr-2 text-red-600" />
              Ending Point (Optional)
            </label>
            <input
              type="text"
              value={formData.endLocation}
              onChange={(e) => setFormData(prev => ({ ...prev, endLocation: e.target.value }))}
              placeholder="e.g., Los Angeles (optional)"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-400"
            />
          </div>
        </div>

        {/* User Description */}
        <div className="transform hover:scale-105 transition-transform">
          <label className="flex items-center text-lg font-semibold text-gray-800 mb-3">
            <Type className="w-5 h-5 mr-2 text-purple-600" />
            Describe Your Perfect Trip
          </label>
          <textarea
            value={formData.userDescription}
            onChange={(e) => setFormData(prev => ({ ...prev, userDescription: e.target.value }))}
            placeholder="Tell us anything specific you want in your trip - special places, activities, experiences, or any other preferences..."
            rows={4}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all hover:border-gray-400 resize-none"
          />
        </div>

        {/* Travel Mode - Optional with Toggle */}
        <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center text-lg font-semibold text-gray-800">
              <Settings className="w-5 h-5 mr-2 text-orange-600" />
              Transportation Preferences (Optional)
            </label>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, enableTravelMode: !prev.enableTravelMode }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                formData.enableTravelMode ? 'bg-orange-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.enableTravelMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          {formData.enableTravelMode && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-slide-down">
              {travelModes.map((mode) => {
                const Icon = mode.icon;
                const isSelected = formData.travelModes.includes(mode.id);
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => handleTravelModeToggle(mode.id)}
                    className={`p-4 border-2 rounded-xl transition-all hover:scale-105 ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-white'
                    }`}
                  >
                    <Icon className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">{mode.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Interests - Enhanced with Search and More Options */}
        <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center text-lg font-semibold text-gray-800">
              <Camera className="w-5 h-5 mr-2 text-blue-600" />
              What interests you? (Optional)
            </label>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, enableInterests: !prev.enableInterests }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                formData.enableInterests ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.enableInterests ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {formData.enableInterests && (
            <div className="space-y-4 animate-slide-down">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={interestSearch}
                  onChange={(e) => setInterestSearch(e.target.value)}
                  placeholder="Search interests..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Interest Options */}
              <div className="grid md:grid-cols-3 gap-3">
                {displayedInterests.map((interest) => {
                  const Icon = interest.icon;
                  const isSelected = formData.interests.includes(interest.id);
                  return (
                    <button
                      key={interest.id}
                      type="button"
                      onClick={() => handleInterestToggle(interest.id)}
                      className={`p-3 border-2 rounded-lg transition-all hover:scale-105 ${
                        isSelected
                          ? `${interest.color} border-opacity-100 shadow-lg`
                          : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-white'
                      }`}
                    >
                      <Icon className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-sm font-medium">{interest.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Show More/Less Button */}
              <button
                type="button"
                onClick={() => setShowMoreInterests(!showMoreInterests)}
                className="w-full flex items-center justify-center py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                <ChevronDown className={`w-4 h-4 mr-1 transition-transform ${showMoreInterests ? 'rotate-180' : ''}`} />
                {showMoreInterests ? 'Show Less' : 'Show More Options'}
              </button>

              {/* Custom Interests Text Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or describe specific places/interests:
                </label>
                <textarea
                  value={formData.customInterests}
                  onChange={(e) => setFormData(prev => ({ ...prev, customInterests: e.target.value }))}
                  placeholder="e.g., specific museums, local markets, hidden gems..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:scale-105 animate-pulse-slow"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
              Creating Your Perfect Trip...
            </div>
          ) : (
            'Generate My Travel Plan ✨'
          )}
        </button>
      </form>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }
        .animate-slide-up {
          animation: slideUp 1s ease-out 0.2s both;
        }
        .animate-scale-in {
          animation: scaleIn 0.8s ease-out 0.4s both;
        }
        .animate-slide-down {
          animation: slideDown 0.5s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        .animate-pulse-slow {
          animation: pulse 3s ease-in-out infinite;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default TravelForm;