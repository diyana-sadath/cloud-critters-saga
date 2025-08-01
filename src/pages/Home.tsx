import { useState } from "react";
import { Link } from "react-router-dom";
import { CloudUpload } from "@/components/CloudUpload";
import { CritterResult } from "@/components/CritterResult";
import { Button } from "@/components/ui/button";
import { Trophy, BookOpen } from "lucide-react";
import { toast } from "sonner";

const generateUniqueId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// Base URL for the API - update this to match your backend URL
const API_BASE_URL = "http://localhost:3001";

// Interface for the AI response
interface AICritterResponse {
  name: string;
  story: string;
}

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
      
      const response = await fetch(`${API_BASE_URL}/api/generate-critter`, {
        method: "POST",
        body: formData,
      });
      
      let critterName = "Fluffy McBounceface"; // Fallback
      let critterStory = "A mysterious cloud creature!"; // Fallback
      
      if (response.ok) {
        const aiResponse: AICritterResponse = await response.json();
        critterName = aiResponse.name || critterName;
        critterStory = aiResponse.story || critterStory;
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
        
        <CritterResult 
          critter={discoveredCritter}
          hasLiked={hasLiked}
          onLike={handleLike}
          onShare={handleShare}
          onSaveToWiki={handleSaveToWiki}
        />
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