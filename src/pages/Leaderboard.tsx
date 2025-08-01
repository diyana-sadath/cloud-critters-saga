import { Trophy, Medal, Crown, Heart, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// Mock leaderboard data
const mockLeaderboard = [
  {
    id: "2",
    name: "Sir Whiskers Von Zoom", 
    species: "Lightning Cat",
    cloudImage: "/placeholder.svg",
    absurdityScore: 95,
    likes: 78,
    rank: 1,
    trend: "up"
  },
  {
    id: "1", 
    name: "Fluffy McBounceface",
    species: "Cloud Bunny",
    cloudImage: "/placeholder.svg", 
    absurdityScore: 87,
    likes: 42,
    rank: 2,
    trend: "same"
  },
  {
    id: "3",
    name: "Princess Bubble Giggles",
    species: "Soap Dragon", 
    cloudImage: "/placeholder.svg",
    absurdityScore: 72,
    likes: 56,
    rank: 3,
    trend: "down"
  },
  {
    id: "4",
    name: "Captain Poof Tornado",
    species: "Windstorm Hamster",
    cloudImage: "/placeholder.svg",
    absurdityScore: 68,
    likes: 34,
    rank: 4,
    trend: "up"
  },
  {
    id: "5", 
    name: "Lady Sparkle Mist",
    species: "Rainbow Unicorn",
    cloudImage: "/placeholder.svg",
    absurdityScore: 65,
    likes: 67,
    rank: 5,
    trend: "up"
  }
];

export const Leaderboard = () => {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'alltime'>('daily');
  const [sortBy, setSortBy] = useState<'absurdity' | 'likes'>('absurdity');

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-sunshine-yellow" />;
      case 2:
        return <Medal className="w-6 h-6 text-muted-foreground" />;
      case 3:
        return <Medal className="w-6 h-6 text-accent" />;
      default:
        return <div className="w-6 h-6 flex items-center justify-center text-lg font-bold">#{rank}</div>;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default:
        return <div className="w-4 h-4 bg-muted-foreground/50 rounded-full" />;
    }
  };

  const getScoreDisplay = (critter: typeof mockLeaderboard[0]) => {
    return sortBy === 'absurdity' ? `${critter.absurdityScore}%` : `${critter.likes} ❤️`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold magic-gradient">
          🏆 Critter Leaderboard
        </h1>
        <p className="text-xl text-muted-foreground">
          The most absurd and beloved cloud critters of all time!
        </p>
      </div>

      {/* Controls */}
      <Card className="p-4 cloud-button">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-2">
            <Button
              variant={timeframe === 'daily' ? 'default' : 'outline'}
              onClick={() => setTimeframe('daily')}
              className="cloud-button"
            >
              Today
            </Button>
            <Button
              variant={timeframe === 'weekly' ? 'default' : 'outline'} 
              onClick={() => setTimeframe('weekly')}
              className="cloud-button"
            >
              This Week
            </Button>
            <Button
              variant={timeframe === 'alltime' ? 'default' : 'outline'}
              onClick={() => setTimeframe('alltime')}
              className="cloud-button"
            >
              All Time
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant={sortBy === 'absurdity' ? 'default' : 'outline'}
              onClick={() => setSortBy('absurdity')}
              className="cloud-button"
            >
              <Trophy className="w-4 h-4 mr-2" />
              By Absurdity
            </Button>
            <Button
              variant={sortBy === 'likes' ? 'default' : 'outline'}
              onClick={() => setSortBy('likes')}
              className="cloud-button"
            >
              <Heart className="w-4 h-4 mr-2" />
              By Likes
            </Button>
          </div>
        </div>
      </Card>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockLeaderboard.slice(0, 3).map((critter, index) => (
          <Card 
            key={critter.id} 
            className={`
              p-6 text-center cloud-button relative overflow-hidden
              ${index === 0 ? 'md:order-2 ring-2 ring-sunshine-yellow' : ''}
              ${index === 1 ? 'md:order-1' : ''}
              ${index === 2 ? 'md:order-3' : ''}
            `}
          >
            {index === 0 && (
              <div className="absolute -top-2 -right-2 w-16 h-16 bg-sunshine-yellow rounded-full flex items-center justify-center sparkle">
                <Crown className="w-8 h-8 text-white" />
              </div>
            )}
            
            <div className="space-y-4">
              <div className="relative">
                <img 
                  src={critter.cloudImage}
                  alt={critter.name}
                  className="w-20 h-20 mx-auto rounded-full object-cover border-4 border-border"
                />
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  {getRankIcon(critter.rank)}
                </div>
              </div>
              
              <div>
                <h3 className="font-bold magic-gradient">{critter.name}</h3>
                <p className="text-sm text-accent">{critter.species}</p>
              </div>
              
              <div className="text-2xl font-bold text-primary">
                {getScoreDisplay(critter)}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Full Rankings */}
      <Card className="cloud-button">
        <div className="p-4 border-b">
          <h3 className="font-semibold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Full Rankings
          </h3>
        </div>
        
        <div className="space-y-2">
          {mockLeaderboard.map((critter, index) => (
            <div 
              key={critter.id}
              className={`
                flex items-center gap-4 p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors
                ${index < 3 ? 'bg-primary/5' : ''}
              `}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  {getRankIcon(critter.rank)}
                  {getTrendIcon(critter.trend)}
                </div>
                
                <img 
                  src={critter.cloudImage}
                  alt={critter.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-border"
                />
                
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium magic-gradient">{critter.name}</h4>
                  <p className="text-sm text-muted-foreground">{critter.species}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <div className="font-bold">{critter.absurdityScore}%</div>
                  <div className="text-muted-foreground">Absurdity</div>
                </div>
                <div className="text-center">
                  <div className="font-bold">{critter.likes}</div>
                  <div className="text-muted-foreground">Likes</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Rankings update every hour • {timeframe === 'daily' ? 'Showing today\'s' : timeframe === 'weekly' ? 'Showing this week\'s' : 'Showing all-time'} top critters
        </p>
      </div>
    </div>
  );
};