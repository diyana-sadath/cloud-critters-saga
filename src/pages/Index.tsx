import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Home } from "./Home";
import { Wiki } from "./Wiki";
import { Leaderboard } from "./Leaderboard";

const Index = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'wiki' | 'leaderboard'>('home');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'wiki':
        return <Wiki />;
      case 'leaderboard':
        return <Leaderboard />;
      default:
        return <Home />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderCurrentPage()}
    </Layout>
  );
};

export default Index;
