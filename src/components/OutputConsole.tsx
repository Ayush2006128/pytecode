import { useState } from "react";
import { Terminal, Image as ImageIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OutputConsoleProps {
  output: string;
  graphicsOutput?: string[];
}

export const OutputConsole = ({ output, graphicsOutput = [] }: OutputConsoleProps) => {
  const [viewMode, setViewMode] = useState<"console" | "graphics">("console");
  const hasGraphics = graphicsOutput.length > 0;

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden bg-glass/20 backdrop-blur-glass border border-glass-border/30 shadow-glass">
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-glass-border/20 bg-glass/10">
        <div className="flex items-center gap-2">
          {viewMode === "console" ? (
            <Terminal className="w-4 h-4 text-primary" />
          ) : (
            <ImageIcon className="w-4 h-4 text-primary" />
          )}
          <span className="text-sm font-medium text-foreground">
            {viewMode === "console" ? "Console Output" : "Graphics Output"}
          </span>
        </div>
        
        <Select value={viewMode} onValueChange={(value: "console" | "graphics") => setViewMode(value)}>
          <SelectTrigger className="w-[140px] h-8 bg-background/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-background border-glass-border">
            <SelectItem value="console">Console</SelectItem>
            <SelectItem value="graphics" disabled={!hasGraphics}>
              Graphics {!hasGraphics && "(none)"}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="p-4 h-[calc(100%-49px)] overflow-y-auto overflow-x-auto">
        {viewMode === "console" ? (
          <pre className="font-mono text-sm text-foreground/90 whitespace-pre-wrap break-words min-h-full">
            {output || "Run your code to see the output here..."}
          </pre>
        ) : (
          <div className="space-y-4">
            {hasGraphics ? (
              graphicsOutput.map((img, idx) => (
                <div key={idx} className="rounded-lg overflow-hidden border border-glass-border/30">
                  <img 
                    src={`data:image/png;base64,${img}`} 
                    alt={`Plot ${idx + 1}`}
                    className="w-full h-auto"
                  />
                </div>
              ))
            ) : (
              <p className="text-sm text-foreground/70 text-center py-8">
                No graphics output. Use matplotlib to create plots.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
