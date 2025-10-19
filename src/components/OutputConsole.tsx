import { Terminal } from "lucide-react";

interface OutputConsoleProps {
  output: string;
}

export const OutputConsole = ({ output }: OutputConsoleProps) => {
  return (
    <div className="h-full w-full rounded-2xl overflow-hidden bg-glass/20 backdrop-blur-glass border border-glass-border/30 shadow-glass">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-glass-border/20 bg-glass/10">
        <Terminal className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Output</span>
      </div>
      <div className="p-4 h-[calc(100%-49px)] overflow-y-auto overflow-x-auto">
        <pre className="font-mono text-sm text-foreground/90 whitespace-pre-wrap break-words min-h-full">
          {output || "Run your code to see the output here..."}
        </pre>
      </div>
    </div>
  );
};
