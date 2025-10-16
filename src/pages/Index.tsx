import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { CodeEditor } from "@/components/CodeEditor";
import { OutputConsole } from "@/components/OutputConsole";
import { Button } from "@/components/ui/button";
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

  useEffect(() => {
    const initPyodide = async () => {
      try {
        setOutput("Loading Python environment...");
        pyodideRef.current = await loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
        });
        setOutput("Python environment ready! Run your code to see output.");
        setIsLoading(false);
        toast.success("Python environment loaded!");
      } catch (error) {
        setOutput(`Error loading Python: ${error}`);
        setIsLoading(false);
        toast.error("Failed to load Python environment");
      }
    };
    initPyodide();
  }, []);

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
        {/* Control Panel */}
        <div className="mb-6 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-3">
            <Button 
              onClick={handleRun} 
              disabled={isRunning || isLoading}
              size="lg"
              className="shadow-glow hover:shadow-glow/70 transition-all"
            >
              <Play className="w-4 h-4" />
              {isLoading ? "Loading..." : isRunning ? "Running..." : "Run Code"}
            </Button>
            <Button 
              variant="glass" 
              onClick={handleReset}
              size="lg"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="glass" 
              onClick={handleClear}
            >
              Clear All
            </Button>
            <Button 
              variant="secondary"
            >
              <Download className="w-4 h-4" />
              Save
            </Button>
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
        <div className="mt-6 p-4 rounded-2xl bg-gradient-primary backdrop-blur-glass border border-glass-border/30 shadow-glass">
          <p className="text-sm text-center text-foreground/80">
            💡 <strong>Tip:</strong> PyteCode is a Progressive Web App. Install it on your device for a native app experience!
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
