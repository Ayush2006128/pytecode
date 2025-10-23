import { Editor, loader } from "@monaco-editor/react";
import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const CodeEditor = ({ value, onChange }: CodeEditorProps) => {
  const editorRef = useRef<any>(null);
  const { theme } = useTheme();
  const monacoSetupDone = useRef(false);

  useEffect(() => {
    // Configure Monaco before it loads
    loader.init().then((monaco) => {
      if (monacoSetupDone.current) return;
      monacoSetupDone.current = true;

      // Register Python completion provider
      monaco.languages.registerCompletionItemProvider('python', {
        provideCompletionItems: (model, position) => {
          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn
          };
          
          const suggestions = [
            // Built-in functions
            { label: 'print', kind: monaco.languages.CompletionItemKind.Function, insertText: 'print(${1:value})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Print to console', range },
            { label: 'len', kind: monaco.languages.CompletionItemKind.Function, insertText: 'len(${1:obj})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Return the length of an object', range },
            { label: 'range', kind: monaco.languages.CompletionItemKind.Function, insertText: 'range(${1:stop})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Create a range object', range },
            { label: 'input', kind: monaco.languages.CompletionItemKind.Function, insertText: 'input(${1:prompt})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Read input from user', range },
            { label: 'str', kind: monaco.languages.CompletionItemKind.Function, insertText: 'str(${1:obj})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Convert to string', range },
            { label: 'int', kind: monaco.languages.CompletionItemKind.Function, insertText: 'int(${1:value})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Convert to integer', range },
            { label: 'float', kind: monaco.languages.CompletionItemKind.Function, insertText: 'float(${1:value})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Convert to float', range },
            { label: 'list', kind: monaco.languages.CompletionItemKind.Class, insertText: 'list(${1:iterable})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Create a list', range },
            { label: 'dict', kind: monaco.languages.CompletionItemKind.Class, insertText: 'dict(${1:})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Create a dictionary', range },
            { label: 'tuple', kind: monaco.languages.CompletionItemKind.Class, insertText: 'tuple(${1:iterable})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Create a tuple', range },
            { label: 'set', kind: monaco.languages.CompletionItemKind.Class, insertText: 'set(${1:iterable})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Create a set', range },
            { label: 'open', kind: monaco.languages.CompletionItemKind.Function, insertText: 'open(${1:filename}, ${2:mode})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Open a file', range },
            { label: 'type', kind: monaco.languages.CompletionItemKind.Function, insertText: 'type(${1:obj})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Return the type of an object', range },
            { label: 'isinstance', kind: monaco.languages.CompletionItemKind.Function, insertText: 'isinstance(${1:obj}, ${2:type})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Check if object is instance of type', range },
            { label: 'sum', kind: monaco.languages.CompletionItemKind.Function, insertText: 'sum(${1:iterable})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Sum all items in an iterable', range },
            { label: 'max', kind: monaco.languages.CompletionItemKind.Function, insertText: 'max(${1:iterable})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Return the largest item', range },
            { label: 'min', kind: monaco.languages.CompletionItemKind.Function, insertText: 'min(${1:iterable})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Return the smallest item', range },
            { label: 'abs', kind: monaco.languages.CompletionItemKind.Function, insertText: 'abs(${1:number})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Return absolute value', range },
            { label: 'round', kind: monaco.languages.CompletionItemKind.Function, insertText: 'round(${1:number})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Round a number', range },
            { label: 'sorted', kind: monaco.languages.CompletionItemKind.Function, insertText: 'sorted(${1:iterable})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Return a sorted list', range },
            { label: 'enumerate', kind: monaco.languages.CompletionItemKind.Function, insertText: 'enumerate(${1:iterable})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Return enumerate object', range },
            { label: 'zip', kind: monaco.languages.CompletionItemKind.Function, insertText: 'zip(${1:iterable1}, ${2:iterable2})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Zip iterables together', range },
            { label: 'map', kind: monaco.languages.CompletionItemKind.Function, insertText: 'map(${1:function}, ${2:iterable})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Apply function to all items', range },
            { label: 'filter', kind: monaco.languages.CompletionItemKind.Function, insertText: 'filter(${1:function}, ${2:iterable})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Filter items by function', range },
            { label: 'any', kind: monaco.languages.CompletionItemKind.Function, insertText: 'any(${1:iterable})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Return True if any element is true', range },
            { label: 'all', kind: monaco.languages.CompletionItemKind.Function, insertText: 'all(${1:iterable})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Return True if all elements are true', range },
            // Keywords
            { label: 'def', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'def ${1:function_name}(${2:params}):\n    ${3:pass}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Define a function', range },
            { label: 'class', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'class ${1:ClassName}:\n    def __init__(self${2:, params}):\n        ${3:pass}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Define a class', range },
            { label: 'if', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'if ${1:condition}:\n    ${2:pass}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'If statement', range },
            { label: 'elif', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'elif ${1:condition}:\n    ${2:pass}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Else if statement', range },
            { label: 'else', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'else:\n    ${1:pass}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Else statement', range },
            { label: 'for', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'for ${1:item} in ${2:iterable}:\n    ${3:pass}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'For loop', range },
            { label: 'while', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'while ${1:condition}:\n    ${2:pass}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'While loop', range },
            { label: 'try', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'try:\n    ${1:pass}\nexcept ${2:Exception} as ${3:e}:\n    ${4:pass}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Try-except block', range },
            { label: 'with', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'with ${1:expression} as ${2:variable}:\n    ${3:pass}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Context manager', range },
            { label: 'import', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'import ${1:module}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Import a module', range },
            { label: 'from', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'from ${1:module} import ${2:name}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Import from module', range },
            { label: 'return', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'return ${1:value}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Return from function', range },
            { label: 'lambda', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'lambda ${1:args}: ${2:expression}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Lambda function', range },
          ];
          
          return { suggestions };
        }
      });

      // Register hover provider
      monaco.languages.registerHoverProvider('python', {
        provideHover: (model, position) => {
          const word = model.getWordAtPosition(position);
          if (!word) return null;
          
          const docs: Record<string, string> = {
            'print': '```python\nprint(*objects, sep=\' \', end=\'\\n\', file=sys.stdout, flush=False)\n```\nPrint objects to the text stream.',
            'len': '```python\nlen(s)\n```\nReturn the length (number of items) of an object.',
            'range': '```python\nrange(stop)\nrange(start, stop[, step])\n```\nReturn a sequence of numbers.',
            'input': '```python\ninput([prompt])\n```\nRead a string from standard input.',
            'str': '```python\nstr(object=b\'\', encoding=\'utf-8\', errors=\'strict\')\n```\nReturn a string version of object.',
            'int': '```python\nint([x])\nint(x, base=10)\n```\nConvert a number or string to an integer.',
            'float': '```python\nfloat([x])\n```\nConvert a string or number to a floating point number.',
            'list': '```python\nlist([iterable])\n```\nReturn a new list.',
            'dict': '```python\ndict(**kwarg)\ndict(mapping, **kwarg)\ndict(iterable, **kwarg)\n```\nCreate a new dictionary.',
            'tuple': '```python\ntuple([iterable])\n```\nReturn a new tuple.',
            'set': '```python\nset([iterable])\n```\nReturn a new set object.',
            'type': '```python\ntype(object)\n```\nReturn the type of an object.',
            'isinstance': '```python\nisinstance(object, classinfo)\n```\nReturn whether an object is an instance of a class.',
            'sum': '```python\nsum(iterable, /, start=0)\n```\nReturn the sum of a sequence of numbers.',
            'max': '```python\nmax(iterable, *[, key, default])\nmax(arg1, arg2, *args[, key])\n```\nReturn the largest item.',
            'min': '```python\nmin(iterable, *[, key, default])\nmin(arg1, arg2, *args[, key])\n```\nReturn the smallest item.',
            'abs': '```python\nabs(x)\n```\nReturn the absolute value of a number.',
            'round': '```python\nround(number[, ndigits])\n```\nRound a number to a given precision.',
            'sorted': '```python\nsorted(iterable, *, key=None, reverse=False)\n```\nReturn a new sorted list.',
            'enumerate': '```python\nenumerate(iterable, start=0)\n```\nReturn an enumerate object.',
            'zip': '```python\nzip(*iterables)\n```\nMake an iterator that aggregates elements from iterables.',
            'map': '```python\nmap(function, iterable, ...)\n```\nApply function to every item of iterable.',
            'filter': '```python\nfilter(function, iterable)\n```\nConstruct an iterator from elements of iterable for which function returns true.',
            'any': '```python\nany(iterable)\n```\nReturn True if any element of the iterable is true.',
            'all': '```python\nall(iterable)\n```\nReturn True if all elements of the iterable are true.',
          };
          
          if (docs[word.word]) {
            return {
              contents: [{ value: docs[word.word] }]
            };
          }
          return null;
        }
      });

      console.log('Python IntelliSense configured');
    });
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
        theme={theme === "light" ? "vs-light" : "vs-dark"}
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
