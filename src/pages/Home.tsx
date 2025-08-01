import { useState } from "react";
import { CloudUpload } from "@/components/CloudUpload";
import { CritterResult } from "@/components/CritterResult";
import { toast } from "sonner";

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
    
    // Mock processing delay
    setTimeout(() => {
      const critter = {
        ...mockCritter,
        cloudImage: imageUrl,
        // Add some randomization to make it feel more dynamic
        absurdityScore: Math.floor(Math.random() * 40) + 60,
        likes: Math.floor(Math.random() * 100),
      };
      
      setDiscoveredCritter(critter);
      setIsProcessing(false);
      toast.success("🎉 Cloud critter discovered!");
    }, 3000);
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