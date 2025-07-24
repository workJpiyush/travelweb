import React, { useState } from 'react';
import { MapPin, Calendar, Plane, Car, Train, Ship, Camera, Building, TreePine, Palette, Clock } from 'lucide-react';

interface TravelFormData {
  days: number;
  startLocation: string;
  endLocation: string;
  travelMode: string;
  interests: string[];
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
    travelMode: 'car',
    interests: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const travelModes = [
    { id: 'plane', label: 'Airplane', icon: Plane },
    { id: 'car', label: 'Car', icon: Car },
    { id: 'train', label: 'Train', icon: Train },
    { id: 'ship', label: 'Ship/Ferry', icon: Ship }
  ];

  const interestOptions = [
    { id: 'historical', label: 'Historical Sites', icon: Building, color: 'bg-amber-100 text-amber-800 border-amber-200' },
    { id: 'cultural', label: 'Cultural Experiences', icon: Palette, color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { id: 'nature', label: 'Nature & Outdoors', icon: TreePine, color: 'bg-green-100 text-green-800 border-green-200' },
    { id: 'photography', label: 'Photography Spots', icon: Camera, color: 'bg-blue-100 text-blue-800 border-blue-200' }
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.startLocation.trim()) {
      newErrors.startLocation = 'Starting location is required';
    }
    
    if (!formData.endLocation.trim()) {
      newErrors.endLocation = 'Ending location is required';
    }
    
    if (formData.days < 1 || formData.days > 30) {
      newErrors.days = 'Number of days must be between 1 and 30';
    }
    
    if (formData.interests.length === 0) {
      newErrors.interests = 'Please select at least one interest';
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

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Plan Your Perfect Trip</h1>
        <p className="text-lg text-gray-600">Tell us about your travel preferences and we'll create a personalized itinerary</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
        {/* Trip Duration */}
        <div>
          <label className="flex items-center text-lg font-semibold text-gray-800 mb-4">
            <Calendar className="w-5 h-5 mr-2 text-blue-600" />
            How many days is your trip?
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="1"
              max="30"
              value={formData.days}
              onChange={(e) => setFormData(prev => ({ ...prev, days: parseInt(e.target.value) }))}
              className="flex-1 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 min-w-[80px] text-center">
              <span className="text-xl font-bold text-blue-800">{formData.days}</span>
              <span className="text-sm text-blue-600 block">days</span>
            </div>
          </div>
          {errors.days && <p className="text-red-500 text-sm mt-2">{errors.days}</p>}
        </div>

        {/* Locations */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center text-lg font-semibold text-gray-800 mb-3">
              <MapPin className="w-5 h-5 mr-2 text-green-600" />
              Starting Point
            </label>
            <input
              type="text"
              value={formData.startLocation}
              onChange={(e) => setFormData(prev => ({ ...prev, startLocation: e.target.value }))}
              placeholder="e.g., New York City"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            {errors.startLocation && <p className="text-red-500 text-sm mt-2">{errors.startLocation}</p>}
          </div>
          
          <div>
            <label className="flex items-center text-lg font-semibold text-gray-800 mb-3">
              <MapPin className="w-5 h-5 mr-2 text-red-600" />
              Ending Point
            </label>
            <input
              type="text"
              value={formData.endLocation}
              onChange={(e) => setFormData(prev => ({ ...prev, endLocation: e.target.value }))}
              placeholder="e.g., Los Angeles"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            {errors.endLocation && <p className="text-red-500 text-sm mt-2">{errors.endLocation}</p>}
          </div>
        </div>

        {/* Travel Mode */}
        <div>
          <label className="flex items-center text-lg font-semibold text-gray-800 mb-4">
            <Clock className="w-5 h-5 mr-2 text-purple-600" />
            Mode of Travel
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {travelModes.map((mode) => {
              const Icon = mode.icon;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, travelMode: mode.id }))}
                  className={`p-4 border-2 rounded-lg transition-all hover:scale-105 ${
                    formData.travelMode === mode.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">{mode.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interests */}
        <div>
          <label className="flex items-center text-lg font-semibold text-gray-800 mb-4">
            <Camera className="w-5 h-5 mr-2 text-orange-600" />
            What would you like to see and do?
          </label>
          <div className="grid md:grid-cols-2 gap-3">
            {interestOptions.map((interest) => {
              const Icon = interest.icon;
              const isSelected = formData.interests.includes(interest.id);
              return (
                <button
                  key={interest.id}
                  type="button"
                  onClick={() => handleInterestToggle(interest.id)}
                  className={`p-4 border-2 rounded-lg transition-all hover:scale-105 ${
                    isSelected
                      ? `${interest.color} border-opacity-100`
                      : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-gray-50'
                  }`}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">{interest.label}</span>
                </button>
              );
            })}
          </div>
          {errors.interests && <p className="text-red-500 text-sm mt-2">{errors.interests}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Creating Your Perfect Trip...
            </div>
          ) : (
            'Generate My Travel Plan'
          )}
        </button>
      </form>
    </div>
  );
};

export default TravelForm;