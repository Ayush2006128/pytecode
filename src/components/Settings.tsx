import { Settings as SettingsIcon, Package, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { toast } from "sonner";
import { useTheme } from "next-themes";

const AVAILABLE_LIBRARIES = [
  { id: 'numpy', name: 'NumPy', description: 'Numerical computing' },
  { id: 'pandas', name: 'Pandas', description: 'Data manipulation and analysis' },
  { id: 'matplotlib', name: 'Matplotlib', description: 'Data visualization' },
  { id: 'scipy', name: 'SciPy', description: 'Scientific computing' },
  { id: 'scikit-learn', name: 'Scikit-learn', description: 'Machine learning' },
] as const;

interface SettingsProps {
  selectedLibraries: string[];
  onLibrariesChange: (libraries: string[]) => void;
}

export const Settings = ({ selectedLibraries, onLibrariesChange }: SettingsProps) => {
  const [showLibraries, setShowLibraries] = useState(false);
  const [showTheme, setShowTheme] = useState(false);
  const [tempLibraries, setTempLibraries] = useState<string[]>(selectedLibraries);
  const { theme, setTheme } = useTheme();

  const handleToggleLibrary = (libraryId: string) => {
    setTempLibraries(prev => 
      prev.includes(libraryId) 
        ? prev.filter(id => id !== libraryId)
        : [...prev, libraryId]
    );
  };

  const handleSaveLibraries = () => {
    onLibrariesChange(tempLibraries);
    localStorage.setItem('pytecode-libraries', JSON.stringify(tempLibraries));
    setShowLibraries(false);
    toast.success("Library preferences saved!");
  };

  const handleOpenLibraries = () => {
    setTempLibraries(selectedLibraries);
    setShowLibraries(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="glass" size="sm" aria-label="Settings">
            <SettingsIcon className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-popover/95 backdrop-blur-lg border-border z-50">
          <DropdownMenuItem onClick={handleOpenLibraries} className="cursor-pointer">
            <Package className="w-4 h-4 mr-2" />
            Manage Libraries
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowTheme(true)} className="cursor-pointer">
            <Palette className="w-4 h-4 mr-2" />
            Change Theme
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Library Management Dialog */}
      <Dialog open={showLibraries} onOpenChange={setShowLibraries}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Manage Python Libraries
            </DialogTitle>
            <DialogDescription className="text-base space-y-4 pt-4">
              <p className="text-sm text-muted-foreground">
                Select which libraries you want to load. Only selected libraries will be available in your Python environment.
              </p>
              <div className="space-y-2 border border-border rounded-lg p-4 bg-muted/30">
                {AVAILABLE_LIBRARIES.map((library) => (
                  <div key={library.id} className="flex items-start space-x-3 py-2">
                    <Checkbox
                      id={`settings-${library.id}`}
                      checked={tempLibraries.includes(library.id)}
                      onCheckedChange={() => handleToggleLibrary(library.id)}
                    />
                    <div className="grid gap-1 leading-none">
                      <label
                        htmlFor={`settings-${library.id}`}
                        className="text-sm font-medium text-foreground cursor-pointer"
                      >
                        {library.name}
                      </label>
                      <p className="text-xs text-muted-foreground">
                        {library.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => setTempLibraries(AVAILABLE_LIBRARIES.map(lib => lib.id))}
            >
              Select All
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setTempLibraries([])}
            >
              Clear All
            </Button>
            <Button onClick={handleSaveLibraries}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Theme Dialog */}
      <Dialog open={showTheme} onOpenChange={setShowTheme}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Change Theme
            </DialogTitle>
            <DialogDescription className="text-base space-y-4 pt-4">
              <p className="text-sm text-muted-foreground">
                Choose your preferred color theme for the application.
              </p>
              <div className="space-y-3">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => {
                    setTheme("light");
                    toast.success("Theme changed to Light");
                    setShowTheme(false);
                  }}
                >
                  ☀️ Light Theme
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => {
                    setTheme("dark");
                    toast.success("Theme changed to Dark");
                    setShowTheme(false);
                  }}
                >
                  🌙 Dark Theme
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => {
                    setTheme("system");
                    toast.success("Theme changed to System");
                    setShowTheme(false);
                  }}
                >
                  💻 System Theme
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};
