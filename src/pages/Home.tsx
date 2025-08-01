import { useState } from 'react';
import { CloudUpload } from '../components/CloudUpload';
import { toast } from 'sonner';
import { Heart, BookOpen, Trophy, Home as HomeIcon, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Button } from '@/components/ui/button';

const generateUniqueId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// Base URL for the API - update this to match your backend URL
const API_BASE_URL = "http://localhost:3001";

// Mock data for demonstration
const mockCritter = {
  id: "1",
  name: "Fluffy McBounceface",
  species: "Cloud Bunny",
  backstory: "Fluffy McBounceface loves to hop from cloud to cloud collecting rainbow sprinkles for his magical carrot garden. He once saved a baby bird by turning into a trampoline cloud! His favorite snack is marshmallow soup and he can sneeze glitter.",
  cloudImage: "",
  absurdityScore: 87,
  likes: 42,
  discovered: new Date()
};

export const Home = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [discoveredCritter, setDiscoveredCritter] = useState<typeof mockCritter | null>(null);
  const [hasLiked, setHasLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleImageUpload = async (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
    setIsProcessing(true);
    
    try {
      // Try AI generation first (friend's code)
      const formData = new FormData();
      formData.append("image", file);
      
      // Real AI image analysis with Google Gemini Vision!
      let critterName = "Fluffy McBounceface"; // Fallback
      let critterStory = "A mysterious cloud creature!"; // Fallback
      
      try {
        const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;
        if (!apiKey) {
          throw new Error('Google AI API key not found');
        }
        
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // Convert image to base64
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = imageUrl;
        });
        
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const base64Data = canvas.toDataURL('image/jpeg').split(',')[1];
        
        const prompt = `Look carefully at this cloud image. What animal, creature, or character do you see in the cloud formations? Be creative and imaginative! Based on what you observe in the cloud shapes, create:

1. give a funny apt indian name for the creature you see in the cloud(eg: sathyaki varma, rohith mahesh, diyana sadath,dakshayani etc )
2. A short, funny backstory about the creature's dark family history, what this creature does in the sky and how it ended up there. creature may be dead or alive.

Format your response as:
Name: [creature name]
Story: [short story about the creature]

Be freakishly accurate and real and creative and scared - you're seeing animals or characters in the cloud shapes!`;
        
        const result = await model.generateContent([
          prompt,
          {
            inlineData: {
              data: base64Data,
              mimeType: "image/jpeg"
            }
          }
        ]);
        
        const response = await result.response;
        const text = response.text();
        
        console.log('Gemini Vision Response:', text);
        
        // Parse the response
        const nameMatch = text.match(/Name:\s*(.+?)(?=\n|Story:|$)/i);
        const storyMatch = text.match(/Story:\s*(.+?)(?=\n|$)/i);
        
        if (nameMatch && nameMatch[1]) {
          critterName = nameMatch[1].trim();
        }
        if (storyMatch && storyMatch[1]) {
          critterStory = storyMatch[1].trim();
        }
        
        console.log('Parsed Critter:', { name: critterName, story: critterStory });
        
      } catch (error) {
        console.error('Gemini Vision API Error:', error);
        // Fallback to local generation if API fails
        const titles = ["Sir", "Princess", "Captain", "Professor", "Lord", "Lady", "Baron", "Duchess", "Admiral", "Count"];
        const firstNames = ["Whiskers", "Fluffy", "Bouncy", "Sparkle", "Thunder", "Misty", "Cloudy", "Nimbus", "Cirrus", "Cumulus"];
        const lastNames = ["McBounceface", "Von Zoom", "Cloudtail", "Stormwhisker", "Puffington", "Drizzleton", "Mistborn", "Skyhopper", "Windchaser", "Rainmaker"];
        
        const title = titles[Math.floor(Math.random() * titles.length)];
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        
        critterName = `${title} ${firstName} ${lastName}`;
        critterStory = "This mysterious cloud creature loves to dance among the clouds!";
      }
      
      // Create critter with AI data OR fallback data
      const uniqueId = generateUniqueId();
      const critter = {
        id: uniqueId,
        name: critterName,
        species: "Cloud Critter",
        backstory: critterStory,
        cloudImage: imageUrl,
        absurdityScore: Math.floor(Math.random() * 40) + 60,
        likes: 0,
        discovered: new Date()
      };
      
      setDiscoveredCritter(critter);
      toast.success("🎉 Cloud critter discovered!");
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error("Failed to process image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLike = async () => {
    if (!discoveredCritter || hasLiked) return;

    try {
      // First, make sure the critter is saved to database
      if (!isSaved) {
        await handleSaveToWiki();
        // Wait a moment for the save to complete
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Now update the likes in the database
      const response = await fetch(`http://localhost:3001/critters/${discoveredCritter.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          likes: discoveredCritter.likes + 1 
        })
      });

      if (response.ok) {
        // Update local state only after successful API call
        setHasLiked(true);
        setDiscoveredCritter({
          ...discoveredCritter,
          likes: discoveredCritter.likes + 1
        });
        toast.success("❤️ Liked! This critter loves you too!");
      } else {
        toast.error("Failed to like critter. Please try again.");
      }
    } catch (error) {
      console.error('Error liking critter:', error);
      toast.error("Network error. Please check your connection.");
    }
  };

  const handleShare = () => {
    toast.success("🔗 Sharing link copied to clipboard!");
    // In a real app, you'd copy the share URL to clipboard
  };

  const handleSaveToWiki = async () => {
    if (!discoveredCritter) return;
    
    try {
      // Create the data object to send
      const critterData = {
        id: discoveredCritter.id, // Use the existing critter ID
        name: discoveredCritter.name,
        species: discoveredCritter.species,
        story: discoveredCritter.backstory, // Note: your Home uses 'backstory', DB uses 'story'
        cloudImage: discoveredCritter.cloudImage,
        absurdityScore: discoveredCritter.absurdityScore,
        likes: discoveredCritter.likes,
        createdAt: new Date().toISOString()
      };
  
      // Send POST request to JSON Server
      const response = await fetch('http://localhost:3001/critters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(critterData)
      });
  
      if (response.ok) {
        toast.success("📚 Critter saved to Cloud Lore Wiki!");
        setIsSaved(true); // Add this line
      } else {
        toast.error("Failed to save critter. Please try again.");
      }
    } catch (error) {
      console.error('Error saving critter:', error);
      toast.error("Network error. Please check your connection.");
    }
  };

  if (discoveredCritter) {
    return (
      <div className="space-y-6">
        {/* Navigation Header */}
        <div className="flex justify-center gap-4 p-4">
          <Link to="/leaderboard">
            <Button variant="outline" className="cloud-button">
              <Trophy className="w-4 h-4 mr-2" />
              Leaderboard
            </Button>
          </Link>
          <Link to="/wiki">
            <Button variant="outline" className="cloud-button">
              <BookOpen className="w-4 h-4 mr-2" />
              Cloud Lore Wiki
            </Button>
          </Link>
        </div>
        
        {/* Critter Display */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border-2 border-purple-200 shadow-lg">
          <div className="relative">
            <img 
              src={discoveredCritter.cloudImage} 
              alt="Cloud" 
              className="w-full h-64 object-cover rounded-2xl mb-6"
            />
            <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
              RARE ✨
            </div>
          </div>
          
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-purple-800 mb-2">{discoveredCritter.name}</h2>
            <p className="text-lg text-purple-600">{discoveredCritter.species}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">📖 Backstory</h3>
            <p className="text-gray-600 leading-relaxed">{discoveredCritter.backstory}</p>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-500">
              🎲 {discoveredCritter.absurdityScore}% Absurd
            </div>
            <div className="text-sm text-gray-500">
              ❤️ {discoveredCritter.likes} likes
            </div>
            <div className="text-sm text-gray-500">
              Discovered {new Date().toLocaleDateString()}
            </div>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={handleLike}
              disabled={hasLiked}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                hasLiked 
                  ? 'bg-pink-200 text-pink-800 cursor-not-allowed' 
                  : 'bg-pink-500 text-white hover:bg-pink-600 hover:scale-105'
              }`}
            >
              <Heart className={`w-5 h-5 mr-2 inline ${hasLiked ? 'fill-current' : ''}`} />
              {hasLiked ? 'Liked!' : 'Like'}
            </button>
            
            <button
              onClick={handleSaveToWiki}
              disabled={isSaved}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                isSaved 
                  ? 'bg-green-200 text-green-800 cursor-not-allowed' 
                  : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105'
              }`}
            >
              <BookOpen className="w-5 h-5 mr-2 inline" />
              {isSaved ? 'Saved!' : 'Save to Wiki'}
            </button>
            
            <button
              onClick={handleShare}
              className="px-6 py-3 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 hover:scale-105 transition-all"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex justify-center gap-4 p-4">
        <Link to="/leaderboard">
          <Button variant="outline" className="cloud-button">
            <Trophy className="w-4 h-4 mr-2" />
            Leaderboard
          </Button>
        </Link>
        <Link to="/wiki">
          <Button variant="outline" className="cloud-button">
            <BookOpen className="w-4 h-4 mr-2" />
            Cloud Lore Wiki
          </Button>
        </Link>
      </div>
      
      <CloudUpload 
        onImageUpload={handleImageUpload}
        isProcessing={isProcessing}
      />
    </div>
  );
};