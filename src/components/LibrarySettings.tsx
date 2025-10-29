import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
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

const AVAILABLE_LIBRARIES = [
  { id: 'numpy', name: 'NumPy', description: 'Numerical computing' },
  { id: 'pandas', name: 'Pandas', description: 'Data manipulation and analysis' },
  { id: 'matplotlib', name: 'Matplotlib', description: 'Data visualization' },
  { id: 'scipy', name: 'SciPy', description: 'Scientific computing' },
  { id: 'scikit-learn', name: 'Scikit-learn', description: 'Machine learning' },
] as const;

interface LibrarySettingsProps {
  selectedLibraries: string[];
  onLibrariesChange: (libraries: string[]) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LibrarySettings = ({ 
  selectedLibraries, 
  onLibrariesChange, 
  isOpen, 
  onOpenChange 
}: LibrarySettingsProps) => {
  const [tempLibraries, setTempLibraries] = useState<string[]>(selectedLibraries);

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
    onOpenChange(false);
    toast.success("Library preferences saved!");
  };

  const handleOpen = (open: boolean) => {
    if (open) {
      setTempLibraries(selectedLibraries);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
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
                    id={`library-${library.id}`}
                    checked={tempLibraries.includes(library.id)}
                    onCheckedChange={() => handleToggleLibrary(library.id)}
                  />
                  <div className="grid gap-1 leading-none">
                    <label
                      htmlFor={`library-${library.id}`}
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
  );
};

