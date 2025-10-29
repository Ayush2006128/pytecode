import { Palette, Sun, Moon, LaptopMinimalCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useTheme } from "next-themes";

interface ThemeSettingsProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ThemeSettings = ({ isOpen, onOpenChange }: ThemeSettingsProps) => {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    const themeName = newTheme === "system" ? "System" : newTheme === "light" ? "Light" : "Dark";
    toast.success(`Theme changed to ${themeName}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
                onClick={() => handleThemeChange("light")}
              >
                <Sun /> Light Theme
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => handleThemeChange("dark")}
              >
                <Moon /> Dark Theme
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => handleThemeChange("system")}
              >
                <LaptopMinimalCheck /> System Theme
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

