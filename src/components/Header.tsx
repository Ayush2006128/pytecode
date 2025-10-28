import { Sparkles, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { usePWAInstall } from "@/hooks/use-pwa-install";
import { Settings } from "@/components/Settings";
import { PythonLogo } from "@/components/PythonLogo";
import { Capacitor } from "@capacitor/core";

interface HeaderProps {
  selectedLibraries?: string[];
  onLibrariesChange?: (libraries: string[]) => void;
}

export const Header = ({
  selectedLibraries = [],
  onLibrariesChange,
}: HeaderProps) => {
  const navigate = useNavigate();
  const isInstalled = usePWAInstall();

  return (
    <header className="relative">
      <div className="absolute inset-0 bg-gradient-glow animate-glow opacity-30" />
      <div className="relative flex items-center justify-between px-6 py-4 bg-glass/10 backdrop-blur-glass border-b border-glass-border/30">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
            <div className="relative bg-gradient-primary p-2 rounded-xl border border-glass-border/50 shadow-glow">
              <PythonLogo size={24} />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              PyteCode
              <Sparkles className="w-4 h-4 text-primary animate-glow" />
            </h1>
            <p className="text-xs text-muted-foreground">Python Playground</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-sm">
            <span className="text-xs font-medium text-primary">Beta</span>
          </div>
          {!isInstalled && Capacitor.getPlatform() !== "android" && (
            <Button
              variant="glass"
              size="sm"
              onClick={() => navigate("/install")}
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Install</span>
            </Button>
          )}
          {onLibrariesChange && (
            <Settings
              selectedLibraries={selectedLibraries}
              onLibrariesChange={onLibrariesChange}
            />
          )}
        </div>
      </div>
    </header>
  );
};
