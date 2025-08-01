import { useState } from "react";
import { CloudUpload } from "@/components/CloudUpload";
import { CritterResult } from "@/components/CritterResult";
import { toast } from "sonner";

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

  const handleImageUpload = async (file: File) => {
    // Create a preview URL
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
    setIsProcessing(true);
    
    try {
      // Create form data to send the image
      const formData = new FormData();
      formData.append('image', file);
      
      // Call our AI API endpoint
      const response = await fetch(`${API_BASE_URL}/api/generate-critter`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to process image');
      }
      
      const aiResponse: AICritterResponse = await response.json();
      
      // Create a critter with the AI-generated content
      const critter = {
        id: Date.now().toString(),
        name: aiResponse.name || 'Mystery Cloud Creature',
        species: 'Cloud Critter',
        backstory: aiResponse.story || 'This cloud creature is too mysterious for words!',
        cloudImage: imageUrl,
        absurdityScore: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
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
    const handleImageUpload = async (file: File) => {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      setIsProcessing(true);
    
      try {
        const formData = new FormData();
        formData.append("image", file);
    
        const response = await fetch(`${API_BASE_URL}/api/generate-critter`, {
          method: "POST",
          body: formData,
        });
    
        if (!response.ok) {
          throw new Error("Failed to process image");
        }
    
        const aiResponse: AICritterResponse = await response.json();
        console.log("🧠 AI Response:", aiResponse); // 👈 Add this line
    
        const critter = {
          id: Date.now().toString(),
          name: aiResponse.name || "Mystery Cloud Creature",
          species: "Cloud Critter",
          backstory: aiResponse.story || "This cloud creature is too mysterious for words!",
          cloudImage: imageUrl,
          absurdityScore: Math.floor(Math.random() * 40) + 60,
          likes: 0,
          discovered: new Date(),
        };
    
        setDiscoveredCritter(critter);
        toast.success("🎉 Cloud critter discovered!");
      } catch (error) {
        console.error("Error processing image:", error);
        toast.error("Failed to process image. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    };
    
  };

  const handleLike = () => {
    if (!hasLiked && discoveredCritter) {
      setHasLiked(true);
      setDiscoveredCritter({
        ...discoveredCritter,
        likes: discoveredCritter.likes + 1
      });
      toast.success("❤️ Liked! This critter loves you too!");
    }
  };

  const handleShare = () => {
    toast.success("🔗 Sharing link copied to clipboard!");
    // In a real app, you'd copy the share URL to clipboard
  };

  const handleSaveToWiki = () => {
    toast.success("📚 Critter saved to Cloud Lore Wiki!");
    // In a real app, this would save to your database
  };

  if (discoveredCritter) {
    return (
      <CritterResult 
        critter={discoveredCritter}
        hasLiked={hasLiked}
        onLike={handleLike}
        onShare={handleShare}
        onSaveToWiki={handleSaveToWiki}
      />
    );
  }

  return (
    <CloudUpload 
      onImageUpload={handleImageUpload}
      isProcessing={isProcessing}
    />
  );
};