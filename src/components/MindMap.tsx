import React, { useEffect, useRef } from 'react';
import { MapPin, Clock, Camera, Star } from 'lucide-react';

interface TravelNode {
  time: string;
  place: string;
  activity: string;
}

interface TravelDay {
  day: string;
  nodes: TravelNode[];
}

interface MindMapProps {
  travelPlan: {
    title: string;
    days: TravelDay[];
  };
}

const MindMap: React.FC<MindMapProps> = ({ travelPlan }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 
    'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-red-500'
  ];

  useEffect(() => {
    // Add entrance animations
    const nodes = document.querySelectorAll('.mind-map-node');
    nodes.forEach((node, index) => {
      setTimeout(() => {
        node.classList.add('animate-bounce-in');
      }, index * 200);
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{travelPlan.title}</h2>
        <p className="text-lg text-gray-600">Your personalized travel itinerary with detailed timings</p>
      </div>

      {/* Central Hub */}
      <div className="relative">
        {/* Background SVG for connections */}
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 1 }}
        >
          {travelPlan.days.map((_, index) => {
            const angle = (index * 360) / travelPlan.days.length;
            const centerX = 50;
            const centerY = 50;
            const radius = 35;
            const x = centerX + radius * Math.cos((angle - 90) * Math.PI / 180);
            const y = centerY + radius * Math.sin((angle - 90) * Math.PI / 180);
            
            return (
              <line
                key={index}
                x1={`${centerX}%`}
                y1={`${centerY}%`}
                x2={`${x}%`}
                y2={`${y}%`}
                stroke="#e5e7eb"
                strokeWidth="2"
                strokeDasharray="5,5"
                className="animate-pulse"
              />
            );
          })}
        </svg>

        {/* Central Node */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 2 }}>
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full w-32 h-32 flex items-center justify-center shadow-2xl mind-map-node opacity-0">
            <div className="text-center">
              <MapPin className="w-8 h-8 mx-auto mb-1" />
              <div className="text-sm font-bold">Trip Plan</div>
              <div className="text-xs opacity-90">{travelPlan.days.length} Days</div>
            </div>
          </div>
        </div>

        {/* Day Nodes */}
        <div className="relative w-full h-96 md:h-[600px]">
          {travelPlan.days.map((day, index) => {
            const angle = (index * 360) / travelPlan.days.length;
            const centerX = 50;
            const centerY = 50;
            const radius = 35;
            const x = centerX + radius * Math.cos((angle - 90) * Math.PI / 180);
            const y = centerY + radius * Math.sin((angle - 90) * Math.PI / 180);
            
            return (
              <div
                key={day.day}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 mind-map-node opacity-0 max-h-96 overflow-y-auto"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  zIndex: 3
                }}
              >
                <div className={`${colors[index % colors.length]} text-white rounded-xl p-3 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 min-w-72 max-w-80`}>
                  <div className="flex items-center mb-3">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="font-bold text-lg">{day.day}</span>
                    <span className="ml-auto text-xs opacity-75">({day.nodes.length} activities)</span>
                  </div>
                  
                  <div className="space-y-3">
                    {day.nodes.map((node, nodeIndex) => (
                      <div key={nodeIndex} className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
                        <div className="flex items-center mb-1">
                          <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                          <span className="text-xs font-semibold opacity-90">{node.time}</span>
                        </div>
                        <h4 className="font-semibold text-xs mb-1 truncate" title={node.place}>{node.place}</h4>
                        <p className="text-xs opacity-90 leading-tight line-clamp-2" title={node.activity}>{node.activity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline View */}
      <div className="mt-16 bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Camera className="w-6 h-6 mr-2 text-blue-600" />
          Detailed Timeline
        </h3>
        <div className="space-y-8">
          {travelPlan.days.map((day, dayIndex) => (
            <div key={day.day} className="border-l-4 border-blue-500 pl-6 relative">
              <div className="absolute -left-3 top-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{dayIndex + 1}</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">{day.day}</h4>
              <div className="grid gap-4">
                {day.nodes.map((node, nodeIndex) => (
                  <div key={nodeIndex} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-4 border-blue-300">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <Clock className="w-4 h-4 mr-2 text-gray-600" />
                          <span className="font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded text-sm">{node.time}</span>
                        </div>
                        <div className="flex items-center mb-1">
                          <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                          <span className="font-semibold text-gray-900 text-lg">{node.place}</span>
                        </div>
                        <p className="text-gray-700 ml-6 leading-relaxed">{node.activity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .mind-map-node {
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .animate-bounce-in {
          opacity: 1 !important;
          animation: bounceIn 0.6s ease-out;
        }
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.3);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.05);
          }
          70% {
            transform: translate(-50%, -50%) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default MindMap;