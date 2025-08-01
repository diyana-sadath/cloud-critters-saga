import { useEffect, useState } from 'react';
import { BookOpen, X } from 'lucide-react';

interface Cloudimal {
  id: string | number;
  cloudImage: string;
  name: string;
  story: string;
  absurdityScore: number;
  likes: number;
  species?: string;
  createdAt?: string;
}

export default function Wiki() {
  const [cloudimals, setCloudimals] = useState<Cloudimal[]>([]);
  const [selectedCritter, setSelectedCritter] = useState<Cloudimal | null>(null);

  // Fetch all critters on mount
  useEffect(() => {
    fetchCloudimals();
  }, []);

  const fetchCloudimals = async () => {
    try {
      const res = await fetch('http://localhost:3001/critters');
      if (!res.ok) throw new Error('Failed to fetch critters');
      const data = await res.json();
      setCloudimals(data);
    } catch (error) {
      console.error('Error fetching critters:', error);
      // Set empty array to prevent rendering errors
      setCloudimals([]);
    }
  };

  // Upvote logic
  const upvote = async (id: string | number, currentLikes: number) => {
    try {
      const response = await fetch(`http://localhost:3001/critters/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          likes: (currentLikes || 0) + 1 
        }),
      });

      if (!response.ok) throw new Error('Failed to update likes');

      // Update local state to avoid full refresh
      setCloudimals(prev => 
        prev.map(critter => 
          critter.id === id 
            ? { ...critter, likes: (critter.likes || 0) + 1 } 
            : critter
        )
      );
      
      // Also update the selected critter if it's the one being upvoted
      if (selectedCritter && selectedCritter.id === id) {
        setSelectedCritter({
          ...selectedCritter,
          likes: (selectedCritter.likes || 0) + 1
        });
      }
    } catch (error) {
      console.error('Error upvoting critter:', error);
    }
  };

  // Toggle modal for viewing full story
  const openCritterModal = (critter: Cloudimal) => {
    setSelectedCritter(critter);
    document.body.style.overflow = 'hidden';
  };

  const closeCritterModal = () => {
    setSelectedCritter(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center magic-gradient">🌥 Cloud Critter Wiki</h1>
      
      {cloudimals.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No cloud critters found. Go discover some first!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cloudimals.map((critter) => (
            <div 
              key={critter.id} 
              className="bg-white shadow-xl rounded-xl p-4 border border-gray-100 hover:shadow-2xl transition-shadow cursor-pointer"
              onClick={() => openCritterModal(critter)}
            >
              <div className="relative h-48 w-full mb-4 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={critter.cloudImage}
                  alt={critter.name}
                  className="h-full w-full object-cover object-center"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2MxYzVjYiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPgo8cGF0aCBkPSJNMTkgM0g1YTIgMiAwIDAgMC0yIDJ2MTRhMiAyIDAgMCAwIDIgMmgxNGEyIDIgMCAwIDAgMi0yVjVhMiAyIDAgMCAwLTItMnoiPjwvcGF0aD4KPGNpcmNsZSBjeD0iOC41IiBjeT0iOC41IiByPSIxLjUiPjwvY2lyY2xlPgo8cG9seWxpbmUgcG9pbnRzPSIyMSAxNSAzIDE1IDguMTI5IDkuMzQ0YTIgMiAwIDAgMSAyLjc0MiAwTDE2IDExLjUiPjwvcG9seWxpbmU+Cjwvc3ZnPg==';
                    target.className = 'h-full w-full object-contain p-8 bg-gray-100';
                  }}
                />
              </div>

              <h2 className="text-xl font-bold text-blue-800">{critter.name}</h2>
              {critter.species && (
                <p className="text-xs text-gray-500 mb-1">{critter.species}</p>
              )}
              <p className="text-sm text-gray-700 mb-2 line-clamp-3">
                {critter.story}
              </p>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center text-sm">
                  <span className="text-yellow-500 mr-1">★</span>
                  <span className="text-gray-600">{critter.absurdityScore}/10</span>
                </div>
                <div className="flex items-center">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      upvote(critter.id, critter.likes);
                    }}
                    className="text-sm text-blue-500 hover:text-blue-700 flex items-center"
                  >
                    ❤️ {critter.likes || 0}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Story Modal */}
      {selectedCritter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div 
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={closeCritterModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            
            <div className="p-6">
              <div className="relative h-64 w-full mb-6 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={selectedCritter.cloudImage}
                  alt={selectedCritter.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2MxYzVjYiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPgo8cGF0aCBkPSJNMTkgM0g1YTIgMiAwIDAgMC0yIDJ2MTRhMiAyIDAgMCAwIDIgMmgxNGEyIDIgMCAwIDAgMi0yVjVhMiAyIDAgMCAwLTItMnoiPjwvcGF0aD4KPGNpcmNsZSBjeD0iOC41IiBjeT0iOC41IiByPSIxLjUiPjwvY2lyY2xlPgo8cG9seWxpbmUgcG9pbnRzPSIyMSAxNSAzIDE1IDguMTI5IDkuMzQ0YTIgMiAwIDAgMSAyLjc0MiAwTDE2IDExLjUiPjwvcG9seWxpbmU+Cjwvc3ZnPg==';
                    target.className = 'h-full w-full object-contain p-12 bg-gray-100';
                  }}
                />
              </div>
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedCritter.name}</h2>
                  {selectedCritter.species && (
                    <p className="text-sm text-gray-500">{selectedCritter.species}</p>
                  )}
                </div>
                <div className="flex items-center bg-yellow-100 text-yellow-800 text-sm font-medium px-2.5 py-0.5 rounded">
                  <span className="text-yellow-500 mr-1">★</span>
                  {selectedCritter.absurdityScore}/10 Absurdity
                </div>
              </div>
              
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">The Story</h3>
                <p className="text-gray-700 whitespace-pre-line">{selectedCritter.story}</p>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {selectedCritter.createdAt && (
                    <span>Discovered on {new Date(selectedCritter.createdAt).toLocaleDateString()}</span>
                  )}
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    upvote(selectedCritter.id, selectedCritter.likes);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                >
                  ❤️ Like this Critter ({selectedCritter.likes || 0})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
