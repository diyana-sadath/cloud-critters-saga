import { Trophy, Medal, Crown, Heart, TrendingUp, Home, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export const Leaderboard = () => {
  const [critters, setCritters] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'alltime'>('daily');
  const [sortBy, setSortBy] = useState<'absurdity' | 'likes'>('absurdity');

  useEffect(() => {
    fetchCritters();
  }, []);

  const fetchCritters = async () => {
    try {
      const response = await fetch('http://localhost:3001/critters');
      const data = await response.json();
      // Add ranks to the data
      const sortedData = data
        .sort((a: any, b: any) => sortBy === 'absurdity' ? b.absurdityScore - a.absurdityScore : b.likes - a.likes)
        .map((critter: any, index: number) => ({
          ...critter,
          rank: index + 1,
          trend: 'same' // You can implement trend logic later
        }));
      setCritters(sortedData);
    } catch (error) {
      console.error('Error fetching critters:', error);
    }
  };

  const handleVote = async (critterId: number) => {
    const critter = critters.find(c => c.id === critterId);
    if (!critter) return;
    
    try {
      await fetch(`http://localhost:3001/critters/${critterId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ likes: critter.likes + 1 })
      });
      fetchCritters(); // Refresh the list
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-sunshine-yellow" />;
      case 2:
        return <Medal className="w-6 h-6 text-muted-foreground" />;
      case 3:
        return <Medal className="w-6 h-6 text-accent" />;
      default:
        return <div className="w-4 h-4 bg-muted-foreground/50 rounded-full" />;
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

  const getScoreDisplay = (critter: any) => {
    return sortBy === 'absurdity' ? `${critter.absurdityScore}%` : `${critter.likes} ❤️`;
  };

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex justify-center gap-4 p-4">
        <Link to="/">
          <Button variant="outline" className="cloud-button">
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </Link>
        <Link to="/wiki">
          <Button variant="outline" className="cloud-button">
            <BookOpen className="w-4 h-4 mr-2" />
            Cloud Lore Wiki
          </Button>
        </Link>
      </div>
      
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
        {critters.slice(0, 3).map((critter, index) => (
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
          {critters.map((critter, index) => (
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
                <Button
                  onClick={() => handleVote(critter.id)}
                  variant="outline"
                  size="sm"
                  className="cloud-button"
                >
                  <Heart className="w-4 h-4 mr-1" />
                  Vote
                </Button>
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