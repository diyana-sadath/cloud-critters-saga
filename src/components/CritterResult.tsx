import { useState } from "react";
import { Heart, Share, BookOpen, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CloudCritter {
  id: string;
  name: string;
  species: string;
  backstory: string;
  cloudImage: string;
  absurdityScore: number;
  likes: number;
  discovered: Date;
}

interface CritterResultProps {
  critter: CloudCritter;
  onLike?: () => void;
  onShare?: () => void;
  onSaveToWiki?: () => void;
  hasLiked?: boolean;
}

export const CritterResult = ({
  critter,
  onLike,
  onShare,
  onSaveToWiki,
  hasLiked = false,
}: CritterResultProps) => {
  const [savedToWiki, setSavedToWiki] = useState(false);

  const absurdityLevel =
    critter.absurdityScore >= 90
      ? "LEGENDARY"
      : critter.absurdityScore >= 70
      ? "EPIC"
      : critter.absurdityScore >= 50
      ? "RARE"
      : "COMMON";

  const absurdityColor =
    critter.absurdityScore >= 90
      ? "bg-magic-purple"
      : critter.absurdityScore >= 70
      ? "bg-magic-pink"
      : critter.absurdityScore >= 50
      ? "bg-primary"
      : "bg-secondary";

  const handleSaveToWiki = async () => {
    try {
      const response = await fetch("http://localhost:4000/cloudwiki", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: critter.name,
          species: critter.species,
          backstory: critter.backstory,
          image_url: critter.cloudImage,
          absurdity_score: critter.absurdityScore,
          likes: critter.likes,
          created_at: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save critter to CloudWiki.");
      }

      setSavedToWiki(true);
    } catch (error) {
      console.error("Error saving to wiki:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold magic-gradient mb-2">
          🎉 Cloud Critter Discovered!
        </h2>
        <p className="text-muted-foreground">
          A magical new friend has been found in your clouds!
        </p>
      </div>

      <Card className="overflow-hidden cloud-button border-2">
        {/* Cloud Image */}
        <div className="relative h-64 bg-gradient-to-b from-sky-gradient-start to-sky-gradient-end">
          <img
            src={critter.cloudImage}
            alt={`Cloud formation containing ${critter.name}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4">
            <Badge className={`${absurdityColor} text-white font-bold px-3 py-1`}>
              {absurdityLevel} ✨
            </Badge>
          </div>
        </div>

        {/* Critter Info */}
        <div className="p-6 space-y-4">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold magic-gradient">{critter.name}</h3>
            <p className="text-lg text-accent font-medium">{critter.species}</p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">📖 Backstory</h4>
            <p className="text-sm leading-relaxed">{critter.backstory}</p>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Trophy className="w-4 h-4" />
                {critter.absurdityScore}% Absurd
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {critter.likes} likes
              </span>
            </div>
            <span>Discovered {critter.discovered.toLocaleDateString()}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              variant={hasLiked ? "default" : "outline"}
              onClick={onLike}
              className="flex-1 cloud-button"
            >
              <Heart className={`w-4 h-4 mr-2 ${hasLiked ? "fill-current" : ""}`} />
              {hasLiked ? "Liked!" : "Like"}
            </Button>

            <Button
              variant="outline"
              onClick={handleSaveToWiki}
              disabled={savedToWiki}
              className="flex-1 cloud-button"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              {savedToWiki ? "Saved!" : "Save to Wiki"}
            </Button>

            <Button variant="outline" onClick={onShare} className="cloud-button">
              <Share className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      <div className="text-center">
        <Button
          variant="outline"
          size="lg"
          onClick={() => window.location.reload()}
          className="cloud-button"
        >
          Discover Another Critter! 🔍
        </Button>
      </div>
    </div>
  );
};
