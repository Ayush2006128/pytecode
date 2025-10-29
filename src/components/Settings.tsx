import { Settings as SettingsIcon, Package, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { LibrarySettings } from "./LibrarySettings";
import { ThemeSettings } from "./ThemeSettings";

interface SettingsProps {
  selectedLibraries: string[];
  onLibrariesChange: (libraries: string[]) => void;
}

export const Settings = ({ selectedLibraries, onLibrariesChange }: SettingsProps) => {
  const [showLibraries, setShowLibraries] = useState(false);
  const [showTheme, setShowTheme] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <>
      <TooltipProvider>
        <DropdownMenu onOpenChange={setIsDropdownOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="glass" size="sm" aria-label="Settings">
                  <SettingsIcon 
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isDropdownOpen ? 'rotate-[-90deg]' : 'rotate-0'
                    }`}
                  />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end" className="w-56 bg-popover/95 backdrop-blur-lg border-border z-50">
            <DropdownMenuItem onClick={() => setShowLibraries(true)} className="cursor-pointer">
              <Package className="w-4 h-4 mr-2" />
              Manage Libraries
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowTheme(true)} className="cursor-pointer">
              <Palette className="w-4 h-4 mr-2" />
              Change Theme
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TooltipProvider>

      <LibrarySettings
        selectedLibraries={selectedLibraries}
        onLibrariesChange={onLibrariesChange}
        isOpen={showLibraries}
        onOpenChange={setShowLibraries}
      />

      <ThemeSettings
        isOpen={showTheme}
        onOpenChange={setShowTheme}
      />
    </>
  );
};
