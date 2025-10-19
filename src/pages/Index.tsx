import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { CodeEditor } from "@/components/CodeEditor";
import { OutputConsole } from "@/components/OutputConsole";
import { Button } from "@/components/ui/button";
import { usePWAInstall } from "@/hooks/use-pwa-install";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Play, RotateCcw, Download } from "lucide-react";
import { toast } from "sonner";
import { loadPyodide, type PyodideInterface } from "pyodide";

const DEFAULT_CODE = `# Welcome to PyteCode!
# Write your Python code here and click Run

def greet(name):
    return f"Hello, {name}! 🐍"

print(greet("PyteCode"))

# Try some calculations
numbers = [1, 2, 3, 4, 5]
squared = [n**2 for n in numbers]
print(f"Squared numbers: {squared}")
`;

const Index = () => {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pyodideRef = useRef<PyodideInterface | null>(null);
  const isInstalled = usePWAInstall();

  useEffect(() => {
    const initPyodide = async () => {
      try {
        setOutput("Loading Python environment...");
        pyodideRef.current = await loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
        });
        
        setOutput("Loading libraries (numpy, pandas)...");
        await pyodideRef.current.loadPackage(['numpy', 'pandas']);
        
        setOutput("Python environment ready! Libraries: numpy, pandas\nRun your code to see output.");
        setIsLoading(false);
        toast.success("Python environment loaded with numpy & pandas!");
      } catch (error) {
        setOutput(`Error loading Python: ${error}`);
        setIsLoading(false);
        toast.error("Failed to load Python environment");
      }
    };
    initPyodide();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Shift+Enter: Run code
      if (e.shiftKey && e.key === 'Enter') {
        e.preventDefault();
        if (!isRunning && !isLoading) {
          handleRun();
        }
      }
      // Alt+R: Reset
      else if (e.altKey && e.key === 'r') {
        e.preventDefault();
        handleReset();
      }
      // Alt+Delete: Clear
      else if (e.altKey && e.key === 'Delete') {
        e.preventDefault();
        handleClear();
      }
      // Ctrl+S: Save
      else if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, isRunning, isLoading]);

  const handleRun = async () => {
    if (!pyodideRef.current) {
      toast.error("Python environment not ready yet");
      return;
    }

    setIsRunning(true);
    setOutput("");
    toast.info("Executing code...");

    try {
      const pyodide = pyodideRef.current;
      
      // Capture stdout and stderr
      let outputBuffer = "";
      pyodide.setStdout({
        batched: (text) => {
          outputBuffer += text + "\n";
        },
      });
      pyodide.setStderr({
        batched: (text) => {
          outputBuffer += "Error: " + text + "\n";
        },
      });

      // Setup stdin to handle input() function
      pyodide.setStdin({
        stdin: () => {
          const userInput = prompt("Enter input:");
          return userInput !== null ? userInput : "";
        },
      });

      // Run the Python code
      await pyodide.runPythonAsync(code);
      
      setOutput(outputBuffer || "Code executed successfully with no output.");
      toast.success("Code executed!");
    } catch (error: any) {
      setOutput(`Error:\n${error.message}`);
      toast.error("Execution failed");
    } finally {
      setIsRunning(false);
    }
  };

  const handleClear = () => {
    setCode("");
    setOutput("");
    toast.success("Editor cleared!");
  };

  const handleReset = () => {
    setCode(DEFAULT_CODE);
    setOutput("");
    toast.success("Code reset to default!");
  };

  const handleSave = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const filename = `pytecode${day}${month}.py`;
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success(`File saved as ${filename}`);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl animate-glow" />
      </div>

      <Header />

      <main className="container mx-auto px-4 py-6">
        <TooltipProvider>
          {/* Control Panel */}
          <div className="mb-6 flex flex-wrap gap-3 items-center justify-between">
            <div className="flex gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    onClick={handleRun} 
                    disabled={isRunning || isLoading}
                    size="lg"
                    className="shadow-glow hover:shadow-glow/70 transition-all"
                    aria-label="Run Python code"
                  >
                    <Play className="w-4 h-4" />
                    {isLoading ? "Loading..." : isRunning ? "Running..." : "Run Code"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Execute your Python code</p>
                </TooltipContent>
              </Tooltip>

              <AlertDialog>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="glass" 
                        size="lg"
                        aria-label="Reset code to default"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Reset
                      </Button>
                    </AlertDialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Reset to default example code</p>
                  </TooltipContent>
                </Tooltip>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset to Default Code?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will replace your current code with the default example. Any unsaved changes will be lost.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleReset}>Reset</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            
            <div className="flex gap-3">
              <AlertDialog>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="glass"
                        aria-label="Clear all code"
                      >
                        Clear All
                      </Button>
                    </AlertDialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Clear all code and output</p>
                  </TooltipContent>
                </Tooltip>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear All Code?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will delete all your code and clear the output. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClear}>Clear All</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="secondary"
                    onClick={handleSave}
                    aria-label="Save code to file"
                  >
                    <Download className="w-4 h-4" />
                    Save
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download code as .py file</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

        {/* Editor and Output Grid */}
        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-220px)]">
          <div className="h-full">
            <CodeEditor value={code} onChange={setCode} />
          </div>
          <div className="h-full">
            <OutputConsole output={output} />
          </div>
        </div>

          {/* Info Card */}
          {!isInstalled && (
            <div className="mt-6 p-4 rounded-2xl bg-gradient-primary backdrop-blur-glass border border-glass-border/30 shadow-glass">
              <p className="text-sm text-center text-foreground/80">
                💡 <strong>Tip:</strong> PyteCode is a Progressive Web App. Install it on your device for a native app experience!
              </p>
            </div>
          )}
        </TooltipProvider>
      </main>
    </div>
  );
};

export default Index;
