import { Search, Filter, Calendar, Trophy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

// Mock data for the wiki
const mockCritters = [
  {
    id: "1",
    name: "Fluffy McBounceface",
    species: "Cloud Bunny",
    backstory: "Fluffy McBounceface loves to hop from cloud to cloud collecting rainbow sprinkles for his magical carrot garden.",
    cloudImage: "/placeholder.svg",
    absurdityScore: 87,
    likes: 42,
    discovered: new Date("2024-01-15")
  },
  {
    id: "2", 
    name: "Sir Whiskers Von Zoom",
    species: "Lightning Cat",
    backstory: "Sir Whiskers can run faster than lightning bolts and his whiskers can predict the weather. He loves tuna-flavored raindrops!",
    cloudImage: "/placeholder.svg",
    absurdityScore: 95,
    likes: 78,
    discovered: new Date("2024-01-14")
  },
  {
    id: "3",
    name: "Princess Bubble Giggles",
    species: "Soap Dragon",
    backstory: "Princess Bubble Giggles breathes soap bubbles instead of fire and loves to give everyone surprise baths from the sky!",
    cloudImage: "/placeholder.svg", 
    absurdityScore: 72,
    likes: 56,
    discovered: new Date("2024-01-13")
  }
];

export const Wiki = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'likes' | 'absurdity'>('newest');

  const filteredCritters = mockCritters
    .filter(critter => 
      critter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      critter.species.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.discovered.getTime() - a.discovered.getTime();
        case 'oldest':
          return a.discovered.getTime() - b.discovered.getTime();
        case 'likes':
          return b.likes - a.likes;
        case 'absurdity':
          return b.absurdityScore - a.absurdityScore;
        default:
          return 0;
      }
    });

  const getAbsurdityLevel = (score: number) => {
    if (score >= 90) return { level: "LEGENDARY", color: "bg-magic-purple" };
    if (score >= 70) return { level: "EPIC", color: "bg-magic-pink" };
    if (score >= 50) return { level: "RARE", color: "bg-primary" };
    return { level: "COMMON", color: "bg-secondary" };
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold magic-gradient">
          ☁️ Cloud Lore Wiki
        </h1>
        <p className="text-xl text-muted-foreground">
          A magical collection of all discovered cloud critters
        </p>
      </div>

      {/* Search and Filter */}
      <Card className="p-4 cloud-button">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search critters by name or species..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={sortBy === 'newest' ? 'default' : 'outline'}
              onClick={() => setSortBy('newest')}
              className="cloud-button"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Newest
            </Button>
            <Button
              variant={sortBy === 'likes' ? 'default' : 'outline'}
              onClick={() => setSortBy('likes')}
              className="cloud-button"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Popular
            </Button>
            <Button
              variant={sortBy === 'absurdity' ? 'default' : 'outline'}
              onClick={() => setSortBy('absurdity')}
              className="cloud-button"
            >
              <Filter className="w-4 h-4 mr-2" />
              Absurd
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 text-center cloud-button">
          <div className="text-2xl font-bold magic-gradient">{mockCritters.length}</div>
          <div className="text-sm text-muted-foreground">Total Critters</div>
        </Card>
        <Card className="p-4 text-center cloud-button">
          <div className="text-2xl font-bold magic-gradient">
            {mockCritters.reduce((sum, c) => sum + c.likes, 0)}
          </div>
          <div className="text-sm text-muted-foreground">Total Likes</div>
        </Card>
        <Card className="p-4 text-center cloud-button">
          <div className="text-2xl font-bold magic-gradient">
            {Math.round(mockCritters.reduce((sum, c) => sum + c.absurdityScore, 0) / mockCritters.length)}%
          </div>
          <div className="text-sm text-muted-foreground">Avg Absurdity</div>
        </Card>
      </div>

      {/* Critters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCritters.map((critter) => {
          const { level, color } = getAbsurdityLevel(critter.absurdityScore);
          
          return (
            <Card key={critter.id} className="overflow-hidden cloud-button hover:scale-105 transition-transform">
              <div className="relative h-32 bg-gradient-to-b from-sky-gradient-start to-sky-gradient-end">
                <img 
                  src={critter.cloudImage} 
                  alt={critter.name}
                  className="w-full h-full object-cover"
                />
                <Badge className={`absolute top-2 right-2 ${color} text-white text-xs`}>
                  {level}
                </Badge>
              </div>
              
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold magic-gradient text-lg">{critter.name}</h3>
                  <p className="text-sm text-accent">{critter.species}</p>
                </div>
                
                <p className="text-xs text-muted-foreground line-clamp-3">
                  {critter.backstory}
                </p>
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>❤️ {critter.likes}</span>
                  <span>🎯 {critter.absurdityScore}%</span>
                  <span>{critter.discovered.toLocaleDateString()}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredCritters.length === 0 && (
        <Card className="p-8 text-center cloud-button">
          <p className="text-muted-foreground">No critters found matching your search. Try different keywords!</p>
        </Card>
      )}
    </div>
  );
};