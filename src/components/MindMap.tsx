import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Clock, Camera, Star, Info, X, DollarSign, MapIcon, AlertCircle } from 'lucide-react';

interface TravelNode {
  time: string;
  place: string;
  activity: string;
  description?: string;
  details?: {
    address?: string;
    openingHours?: string;
    cost?: string;
    tips?: string;
    duration?: string;
  };
}

interface TravelDay {
  day: string;
  nodes: TravelNode[];
}

interface MindMapProps {
  travelPlan: {
    title: string;
    overview: string;
    days: TravelDay[];
    summary: {
      totalCost?: string;
      bestTimeToVisit?: string;
      tips?: string[];
    };
  };
}

const MindMap: React.FC<MindMapProps> = ({ travelPlan }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<TravelNode | null>(null);
  const [showOverview, setShowOverview] = useState(true);

  const colors = [
    'from-blue-500 to-blue-600', 'from-green-500 to-green-600', 'from-purple-500 to-purple-600', 
    'from-orange-500 to-orange-600', 'from-pink-500 to-pink-600'
  ];

  useEffect(() => {
    // Add entrance animations
    const nodes = document.querySelectorAll('.mind-map-node');
    nodes.forEach((node, index) => {
      setTimeout(() => {
        node.classList.add('animate-bounce-in');
      }, index * 150);
    });
  }, []);

  const handleNodeDoubleClick = (node: TravelNode) => {
    setSelectedNode(node);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Trip Overview Section */}
      {showOverview && (
        <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-8 shadow-xl animate-fade-in border border-gray-200">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {travelPlan.title}
            </h2>
            <button
              onClick={() => setShowOverview(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                <Info className="w-5 h-5 mr-2 text-blue-600" />
                Trip Overview
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">{travelPlan.overview}</p>
            </div>
            
            <div className="space-y-4">
              {travelPlan.summary.totalCost && (
                <div className="bg-white rounded-xl p-4 shadow-md">
                  <div className="flex items-center mb-2">
                    <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                    <span className="font-semibold text-gray-800">Estimated Cost</span>
                  </div>
                  <p className="text-green-700 font-bold">{travelPlan.summary.totalCost}</p>
                </div>
              )}
              
              {travelPlan.summary.bestTimeToVisit && (
                <div className="bg-white rounded-xl p-4 shadow-md">
                  <div className="flex items-center mb-2">
                    <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-semibold text-gray-800">Best Time</span>
                  </div>
                  <p className="text-blue-700">{travelPlan.summary.bestTimeToVisit}</p>
                </div>
              )}
              
              {travelPlan.summary.tips && travelPlan.summary.tips.length > 0 && (
                <div className="bg-white rounded-xl p-4 shadow-md">
                  <div className="flex items-center mb-2">
                    <AlertCircle className="w-5 h-5 text-orange-600 mr-2" />
                    <span className="font-semibold text-gray-800">Key Tips</span>
                  </div>
                  <ul className="space-y-1">
                    {travelPlan.summary.tips.slice(0, 3).map((tip, index) => (
                      <li key={index} className="text-sm text-orange-700 flex items-start">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Mind Map Visualization */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center">
          <MapIcon className="w-6 h-6 mr-2 text-blue-600" />
          Interactive Journey Map
        </h3>
        
        <div className="relative">
          {/* Central Hub */}
          <div className="flex items-center justify-center mb-12">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full w-40 h-40 flex items-center justify-center shadow-2xl mind-map-node opacity-0 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <div className="text-center relative z-10">
                <MapPin className="w-10 h-10 mx-auto mb-2" />
                <div className="text-lg font-bold">Your Journey</div>
                <div className="text-sm opacity-90">{travelPlan.days.length} Amazing Days</div>
              </div>
            </div>
          </div>

          {/* Day Cards in Horizontal Layout */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {travelPlan.days.map((day, dayIndex) => (
              <div
                key={day.day}
                className={`bg-gradient-to-br ${colors[dayIndex % colors.length]} text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 mind-map-node opacity-0`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold">{day.day}</h4>
                  <div className="bg-white/20 rounded-full px-3 py-1">
                    <span className="text-sm font-medium">{day.nodes.length} stops</span>
                  </div>
                </div>
                
                <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                  {day.nodes.map((node, nodeIndex) => (
                    <div
                      key={nodeIndex}
                      onDoubleClick={() => handleNodeDoubleClick(node)}
                      className="bg-white/15 backdrop-blur-sm rounded-xl p-3 hover:bg-white/25 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          <span className="text-sm font-semibold">{node.time}</span>
                        </div>
                        <Info className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <h5 className="font-semibold text-sm mb-1 line-clamp-1" title={node.place}>
                        {node.place}
                      </h5>
                      <p className="text-xs opacity-90 line-clamp-2" title={node.activity}>
                        {node.activity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Timeline */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Camera className="w-6 h-6 mr-2 text-blue-600" />
          Detailed Timeline
          <span className="text-sm font-normal text-gray-500 ml-2">(Double-click any item for details)</span>
        </h3>
        
        <div className="space-y-8">
          {travelPlan.days.map((day, dayIndex) => (
            <div key={day.day} className="relative">
              <div className="flex items-center mb-6">
                <div className={`w-12 h-12 bg-gradient-to-br ${colors[dayIndex % colors.length]} rounded-full flex items-center justify-center text-white font-bold shadow-lg`}>
                  {dayIndex + 1}
                </div>
                <div className="ml-4">
                  <h4 className="text-2xl font-bold text-gray-900">{day.day}</h4>
                  <p className="text-gray-600">{day.nodes.length} activities planned</p>
                </div>
              </div>
              
              <div className="ml-6 border-l-4 border-gray-200 pl-6 space-y-4">
                {day.nodes.map((node, nodeIndex) => (
                  <div
                    key={nodeIndex}
                    onDoubleClick={() => handleNodeDoubleClick(node)}
                    className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-all cursor-pointer border-l-4 border-blue-300 hover:border-blue-500 hover:shadow-md group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold mr-3">
                            {node.time}
                          </div>
                          <Info className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex items-center mb-2">
                          <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                          <h5 className="font-bold text-gray-900 text-lg">{node.place}</h5>
                        </div>
                        <p className="text-gray-700 ml-7 leading-relaxed">{node.activity}</p>
                        {node.description && (
                          <p className="text-gray-600 ml-7 mt-2 text-sm italic">{node.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Node Modal */}
      {selectedNode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedNode.place}</h3>
                  <div className="flex items-center text-blue-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="font-semibold">{selectedNode.time}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Activity</h4>
                <p className="text-gray-700 leading-relaxed">{selectedNode.activity}</p>
              </div>
              
              {selectedNode.description && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
                  <p className="text-gray-700 leading-relaxed">{selectedNode.description}</p>
                </div>
              )}
              
              {selectedNode.details && (
                <div className="grid md:grid-cols-2 gap-4">
                  {selectedNode.details.address && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-800 mb-1 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        Address
                      </h5>
                      <p className="text-gray-700 text-sm">{selectedNode.details.address}</p>
                    </div>
                  )}
                  
                  {selectedNode.details.openingHours && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-800 mb-1 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Hours
                      </h5>
                      <p className="text-gray-700 text-sm">{selectedNode.details.openingHours}</p>
                    </div>
                  )}
                  
                  {selectedNode.details.cost && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-800 mb-1 flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        Cost
                      </h5>
                      <p className="text-gray-700 text-sm">{selectedNode.details.cost}</p>
                    </div>
                  )}
                  
                  {selectedNode.details.duration && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-800 mb-1 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Duration
                      </h5>
                      <p className="text-gray-700 text-sm">{selectedNode.details.duration}</p>
                    </div>
                  )}
                </div>
              )}
              
              {selectedNode.details?.tips && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h5 className="font-semibold text-yellow-800 mb-2 flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Tips
                  </h5>
                  <p className="text-yellow-700 text-sm">{selectedNode.details.tips}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .mind-map-node {
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .animate-bounce-in {
          opacity: 1 !important;
          animation: bounceIn 0.6s ease-out;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.3);
          border-radius: 2px;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default MindMap;