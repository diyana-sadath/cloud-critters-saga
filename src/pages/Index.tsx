import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Home } from "./Home";
import Wiki from "./Wiki";
import { Leaderboard } from "./Leaderboard";
import { CritterResult } from "@/components/CritterResult";

interface CritterData {
  name: string;
  story: string;
  cloudImage: string;
  absurdityScore: number;
  likes: number;
  discovered: Date;
  species: string;
  id: string;
}

const Index = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'wiki' | 'leaderboard' | 'result'>('home');
  const [critter, setCritter] = useState<CritterData | null>(null);

  const handleCritterGenerated = (data: { name: string; story: string }, imageUrl: string) => {
    const newCritter: CritterData = {
      name: data.name,
      story: data.story,
      cloudImage: imageUrl,
      absurdityScore: Math.floor(Math.random() * 101), // random for now
      likes: 0,
      discovered: new Date(),
      species: "?? Unknown Species",
      id: crypto.randomUUID(),
    };
    setCritter(newCritter);
    setCurrentPage("result");
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onCritterGenerated={handleCritterGenerated} />;
      case 'wiki':
        return <Wiki />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'result':
        return critter && (
          <CritterResult 
            critter={critter}
            onLike={() => setCritter({ ...critter, likes: critter.likes + 1 })}
            onSaveToWiki={() => {
              fetch("http://localhost:4000/cloudwiki", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  id: critter.id,
                  name: critter.name,
                  story: critter.story,
                  image_url: critter.cloudImage,
                  silly_score: critter.absurdityScore,
                  votes: critter.likes,
                }),
              });
              alert("Saved to Cloud Lore Wiki!");
            }}
            onShare={() => navigator.clipboard.writeText(`${critter.name}: ${critter.story}`)}
          />
        );
      default:
        return <Home onCritterGenerated={handleCritterGenerated} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderCurrentPage()}
    </Layout>
  );
};

export default Index;
