import { Cloud, Sparkles, Trophy, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  currentPage?: 'home' | 'wiki' | 'leaderboard';
  onNavigate?: (page: 'home' | 'wiki' | 'leaderboard') => void;
}

export const Layout = ({ children, currentPage = 'home', onNavigate }: LayoutProps) => {
  return (
    <div className="min-h-screen">
      {/* Floating clouds background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <Cloud className="absolute top-10 left-10 w-20 h-20 text-cloud-shadow/30 cloud-float" />
        <Cloud className="absolute top-32 right-20 w-16 h-16 text-cloud-shadow/20 cloud-float-delayed" />
        <Cloud className="absolute bottom-40 left-1/4 w-24 h-24 text-cloud-shadow/25 cloud-float" />
        <Sparkles className="absolute top-20 right-1/3 w-6 h-6 text-magic-pink sparkle" />
        <Sparkles className="absolute bottom-60 right-10 w-8 h-8 text-magic-purple sparkle" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <Cloud className="w-8 h-8 text-primary soft-glow" />
                <h1 className="text-3xl font-bold magic-gradient">Baadal Baba</h1>
              </div>
              <p className="text-xs text-muted-foreground text-right pr-2">nee manasil kaanunnath njan maanath kaanum ;)</p>
            </div>
            
            {onNavigate && (
              <nav className="flex gap-2">
                <Button
                  variant={currentPage === 'home' ? 'default' : 'ghost'}
                  onClick={() => onNavigate('home')}
                  className="cloud-button"
                >
                  <Cloud className="w-4 h-4 mr-2" />
                  Discover
                </Button>
                <Button
                  variant={currentPage === 'wiki' ? 'default' : 'ghost'}
                  onClick={() => onNavigate('wiki')}
                  className="cloud-button"
                >
                  <Book className="w-4 h-4 mr-2" />
                  Wiki
                </Button>
                <Button
                  variant={currentPage === 'leaderboard' ? 'default' : 'ghost'}
                  onClick={() => onNavigate('leaderboard')}
                  className="cloud-button"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Leaderboard
                </Button>
              </nav>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};