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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Play, RotateCcw, Download } from "lucide-react";
import { toast } from "sonner";
import { loadPyodide, type PyodideInterface } from "pyodide";
import { Checkbox } from "@/components/ui/checkbox";
import { PythonLogo } from "@/components/PythonLogo";

const AVAILABLE_LIBRARIES = [
  { id: 'numpy', name: 'NumPy', description: 'Numerical computing' },
  { id: 'pandas', name: 'Pandas', description: 'Data manipulation and analysis' },
  { id: 'matplotlib', name: 'Matplotlib', description: 'Data visualization' },
  { id: 'scipy', name: 'SciPy', description: 'Scientific computing' },
  { id: 'scikit-learn', name: 'Scikit-learn', description: 'Machine learning' },
] as const;

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
  const [graphicsOutput, setGraphicsOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [selectedLibraries, setSelectedLibraries] = useState<string[]>([]);
  const pyodideRef = useRef<PyodideInterface | null>(null);
  const isInstalled = usePWAInstall();
  const [pyodideReady, setPyodideReady] = useState(false);

  // Show welcome dialog on every visit
  useEffect(() => {
    setShowWelcome(true);
    setIsLoading(false);
    
    // Load previously selected libraries if any
    const savedLibs = localStorage.getItem('pytecode-libraries');
    if (savedLibs) {
      setSelectedLibraries(JSON.parse(savedLibs));
    }
  }, []);

  const handleStartCoding = () => {
    setShowWelcome(false);
  };

  useEffect(() => {
    if (selectedLibraries.length === 0 || pyodideReady) return;

    const initPyodide = async () => {
      try {
        setIsLoading(true);
        setOutput("Loading Python environment...");
        pyodideRef.current = await loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
        });
        
        if (selectedLibraries.length > 0) {
          const libNames = selectedLibraries.map(id => 
            AVAILABLE_LIBRARIES.find(lib => lib.id === id)?.name
          ).filter(Boolean).join(', ');
          
          setOutput(`Loading libraries (${libNames})...`);
          await pyodideRef.current.loadPackage(selectedLibraries);
          
          setOutput(`Python environment ready! Libraries: ${libNames}\nRun your code to see output.`);
          toast.success(`Python loaded with ${libNames}!`);
        } else {
          setOutput("Python environment ready! No additional libraries loaded.\nRun your code to see output.");
          toast.success("Python environment loaded!");
        }
        
        setIsLoading(false);
        setPyodideReady(true);
      } catch (error) {
        setOutput(`Error loading Python: ${error}`);
        setIsLoading(false);
        toast.error("Failed to load Python environment");
      }
    };
    initPyodide();
  }, [selectedLibraries, pyodideReady]);

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
    setGraphicsOutput([]);
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

      // Setup matplotlib to capture plots
      await pyodide.runPythonAsync(`
import matplotlib
import matplotlib.pyplot as plt
import io
import base64

matplotlib.use('Agg')
plt.clf()
      `);

      // Run the Python code
      await pyodide.runPythonAsync(code);
      
      // Capture any matplotlib figures
      const figures = await pyodide.runPythonAsync(`
import matplotlib.pyplot as plt
figures = []
for i in plt.get_fignums():
    fig = plt.figure(i)
    buf = io.BytesIO()
    fig.savefig(buf, format='png', bbox_inches='tight')
    buf.seek(0)
    img_str = base64.b64encode(buf.read()).decode('utf-8')
    figures.append(img_str)
    buf.close()
plt.close('all')
figures
      `);
      
      if (figures && figures.length > 0) {
        setGraphicsOutput(figures.toJs());
      }
      
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
    setGraphicsOutput([]);
    toast.success("Editor cleared!");
  };

  const handleReset = () => {
    setCode(DEFAULT_CODE);
    setOutput("");
    setGraphicsOutput([]);
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

  const handleLibrariesChange = (libraries: string[]) => {
    setSelectedLibraries(libraries);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl animate-glow" />
      </div>

      <Header 
        selectedLibraries={selectedLibraries}
        onLibrariesChange={handleLibrariesChange}
      />

      {/* Welcome Dialog */}
      <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-3">
              <PythonLogo size={28} />
              Welcome to PyteCode!
            </DialogTitle>
            <DialogDescription className="text-base space-y-4 pt-4">
              <p>
                PyteCode is a powerful Python IDE that runs entirely in your browser. 
                Write, execute, and visualize Python code with zero setup required.
              </p>
              
              <div className="space-y-3">
                <p className="font-semibold text-foreground">Key Features:</p>
                <ul className="list-disc list-inside space-y-2 ml-2 text-sm">
                  <li><strong>Smart Editor:</strong> Syntax highlighting and auto-completion</li>
                  <li><strong>Python Libraries:</strong> Use the settings menu (⚙️) to load NumPy, Pandas, Matplotlib, and more</li>
                  <li><strong>Keyboard Shortcuts:</strong> Shift+Enter to run, Alt+R to reset, Ctrl+S to save</li>
                  <li><strong>Progressive Web App:</strong> Install for offline access</li>
                  <li><strong>Theme Options:</strong> Switch between light, dark, and system themes</li>
                </ul>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={handleStartCoding}>
              Start Coding
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
                  <p className="flex items-center gap-2">
                    Execute your Python code
                    <kbd className="px-2 py-0.5 text-xs bg-muted rounded border">Shift+Enter</kbd>
                  </p>
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
                    <p className="flex items-center gap-2">
                      Reset to default example code
                      <kbd className="px-2 py-0.5 text-xs bg-muted rounded border">Alt+R</kbd>
                    </p>
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
                    <p className="flex items-center gap-2">
                      Clear all code and output
                      <kbd className="px-2 py-0.5 text-xs bg-muted rounded border">Alt+Delete</kbd>
                    </p>
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
                  <p className="flex items-center gap-2">
                    Download code as .py file
                    <kbd className="px-2 py-0.5 text-xs bg-muted rounded border">Ctrl+S</kbd>
                  </p>
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
            <OutputConsole output={output} graphicsOutput={graphicsOutput} />
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
