import { Editor } from "@monaco-editor/react";
import { useEffect, useRef } from "react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const CodeEditor = ({ value, onChange }: CodeEditorProps) => {
  const editorRef = useRef<any>(null);

  useEffect(() => {
    // Configure Monaco for Python LSP-like features
    const setupPythonLanguage = async () => {
      if (typeof window !== 'undefined') {
        const monaco = await import('monaco-editor');
        
        // Configure Python language features
        monaco.languages.registerCompletionItemProvider('python', {
          provideCompletionItems: (model, position) => {
            const word = model.getWordUntilPosition(position);
            const range = {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: word.startColumn,
              endColumn: word.endColumn
            };
            
            const suggestions: any[] = [
              // Python built-in functions
              { label: 'print', kind: monaco.languages.CompletionItemKind.Function, insertText: 'print(${1:value})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Print to console', range },
              { label: 'len', kind: monaco.languages.CompletionItemKind.Function, insertText: 'len(${1:obj})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Return length of object', range },
              { label: 'range', kind: monaco.languages.CompletionItemKind.Function, insertText: 'range(${1:stop})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Create a range object', range },
              { label: 'input', kind: monaco.languages.CompletionItemKind.Function, insertText: 'input(${1:prompt})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Get user input', range },
              { label: 'str', kind: monaco.languages.CompletionItemKind.Function, insertText: 'str(${1:obj})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Convert to string', range },
              { label: 'int', kind: monaco.languages.CompletionItemKind.Function, insertText: 'int(${1:value})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Convert to integer', range },
              { label: 'float', kind: monaco.languages.CompletionItemKind.Function, insertText: 'float(${1:value})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Convert to float', range },
              { label: 'list', kind: monaco.languages.CompletionItemKind.Function, insertText: 'list(${1:iterable})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Create a list', range },
              { label: 'dict', kind: monaco.languages.CompletionItemKind.Function, insertText: 'dict(${1:})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Create a dictionary', range },
              { label: 'open', kind: monaco.languages.CompletionItemKind.Function, insertText: 'open(${1:filename}, ${2:mode})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Open a file', range },
              // Python keywords
              { label: 'def', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'def ${1:function_name}(${2:params}):\n    ${3:pass}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Define a function', range },
              { label: 'class', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'class ${1:ClassName}:\n    def __init__(self${2:, params}):\n        ${3:pass}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Define a class', range },
              { label: 'if', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'if ${1:condition}:\n    ${2:pass}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'If statement', range },
              { label: 'for', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'for ${1:item} in ${2:iterable}:\n    ${3:pass}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'For loop', range },
              { label: 'while', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'while ${1:condition}:\n    ${2:pass}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'While loop', range },
              { label: 'try', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'try:\n    ${1:pass}\nexcept ${2:Exception} as ${3:e}:\n    ${4:pass}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Try-except block', range },
              { label: 'import', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'import ${1:module}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Import a module', range },
              { label: 'from', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'from ${1:module} import ${2:name}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Import from module', range },
            ];
            return { suggestions };
          }
        });

        // Configure hover provider for documentation
        monaco.languages.registerHoverProvider('python', {
          provideHover: (model, position) => {
            const word = model.getWordAtPosition(position);
            if (!word) return null;
            
            const docs: Record<string, string> = {
              'print': '**print**(*objects, sep=\' \', end=\'\\n\', file=sys.stdout, flush=False)\n\nPrint objects to the text stream file, separated by sep and followed by end.',
              'len': '**len**(s)\n\nReturn the length (the number of items) of an object.',
              'range': '**range**(stop) or range(start, stop[, step])\n\nReturn an object that produces a sequence of integers.',
              'input': '**input**([prompt])\n\nRead a string from standard input. The trailing newline is stripped.',
            };
            
            if (docs[word.word]) {
              return {
                contents: [{ value: docs[word.word] }]
              };
            }
            return null;
          }
        });
      }
    };

    setupPythonLanguage();
  }, []);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };
  return (
    <div className="h-full w-full rounded-2xl overflow-hidden bg-glass/20 backdrop-blur-glass border border-glass-border/30 shadow-glass">
      <Editor
        height="100%"
        defaultLanguage="python"
        value={value}
        onChange={(value) => onChange(value || "")}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          fontSize: 14,
          fontFamily: "'JetBrains Mono', monospace",
          minimap: { enabled: false },
          padding: { top: 16, bottom: 16 },
          scrollBeyondLastLine: false,
          renderLineHighlight: "all",
          lineHeight: 24,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          smoothScrolling: true,
          fontLigatures: true,
          // IntelliSense features
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          wordBasedSuggestions: "allDocuments",
          parameterHints: { enabled: true },
          autoClosingBrackets: "always",
          autoClosingQuotes: "always",
          formatOnPaste: true,
          formatOnType: true,
        }}
      />
    </div>
  );
};
