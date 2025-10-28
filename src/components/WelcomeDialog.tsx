import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon } from "lucide-react";
import PythonLogo from "@/assets/PythonLogo.svg";
import { Capacitor } from "@capacitor/core";

interface WelcomeDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onClick: () => void;
}

export default function WelcomeDialog({
  open,
  setOpen,
  onClick,
}: WelcomeDialogProps) {
  return (
    <Dialog
      open={open && Capacitor.getPlatform() !== "android"}
      onOpenChange={setOpen}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <img src={PythonLogo} alt="Python Logo" className="w-6 h-6" />
            Welcome to PyteCode!
          </DialogTitle>
          <DialogDescription className="text-base space-y-4 pt-4">
            <p>
              PyteCode is a powerful Python IDE that runs entirely in your
              browser. Write, execute, and visualize Python code with zero setup
              required.
            </p>

            <div className="space-y-3">
              <p className="font-semibold text-foreground">Key Features:</p>
              <ul className="list-disc list-inside space-y-2 ml-2 text-sm">
                <li>
                  <strong>Smart Editor:</strong> Syntax highlighting and
                  auto-completion
                </li>
                <li>
                  <strong>Python Libraries:</strong> Use the settings menu
                  <SettingsIcon /> to load NumPy, Pandas, Matplotlib, and more
                </li>
                <li>
                  <strong>Keyboard Shortcuts:</strong> Shift+Enter to run, Alt+R
                  to reset, Ctrl+S to save
                </li>
                <li>
                  <strong>Progressive Web App:</strong> Install for offline
                  access
                </li>
                <li>
                  <strong>Theme Options:</strong> Switch between light, dark,
                  and system themes
                </li>
              </ul>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end">
          <Button onClick={onClick}>Start Coding</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
