import { useCallback, useEffect, useRef, useState } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { Play, Save, Trash2, ChevronDown, Loader2, Clock, Package } from "lucide-react";
import {
  getGetSnippetQueryKey,
  getListPackagesQueryKey,
  getListSnippetsQueryKey,
  useCreateSnippet,
  useDeleteSnippet,
  useGetSnippet,
  useListPackages,
  useListSnippets,
  useRunCode,
  useUpdateSnippet,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PackagesPanel from "@/components/packages-panel";
import type { Snippet } from "@workspace/api-client-react";
import { useLocation } from "wouter";

const TEMPLATES = [
  {
    label: "Hello World",
    code: `// Hello World
console.log("Hello, World!");
`,
  },
  {
    label: "Array Methods",
    code: `// Array manipulation examples
const nums = [1, 2, 3, 4, 5];

const doubled = nums.map(n => n * 2);
console.log("Doubled:", doubled);

const evens = nums.filter(n => n % 2 === 0);
console.log("Evens:", evens);

const sum = nums.reduce((acc, n) => acc + n, 0);
console.log("Sum:", sum);
`,
  },
  {
    label: "Fibonacci",
    code: `// Fibonacci sequence
function fibonacci(n) {
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}

for (let i = 0; i <= 10; i++) {
  console.log(\`fib(\${i}) = \${fibonacci(i)}\`);
}
`,
  },
  {
    label: "Binary Search",
    code: `// Binary Search
function binarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}

const sorted = [1, 3, 5, 7, 9, 11, 13, 15];
console.log(binarySearch(sorted, 7));   // 3
console.log(binarySearch(sorted, 6));   // -1
`,
  },
  {
    label: "Sorting Algorithms",
    code: `// Merge Sort
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    result.push(left[i] <= right[j] ? left[i++] : right[j++]);
  }
  return [...result, ...left.slice(i), ...right.slice(j)];
}

const arr = [38, 27, 43, 3, 9, 82, 10];
console.log("Unsorted:", arr);
console.log("Sorted:", mergeSort(arr));
`,
  },
];

type PlaygroundProps = {
  snippetId?: number;
};

export default function Playground({ snippetId }: PlaygroundProps) {
  const [, setLocation] = useLocation();
  const [code, setCode] = useState(TEMPLATES[0].code);
  const [output, setOutput] = useState("");
  const [hasError, setHasError] = useState(false);
  const [execTime, setExecTime] = useState<number | null>(null);
  const [saveOpen, setSaveOpen] = useState(false);
  const [packagesOpen, setPackagesOpen] = useState(false);
  const [snippetTitle, setSnippetTitle] = useState("");
  const editorRef = useRef<unknown>(null);
  const primarySaveRef = useRef<() => void>(() => { });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const runCode = useRunCode();
  const createSnippet = useCreateSnippet();
  const updateSnippet = useUpdateSnippet();
  const deleteSnippet = useDeleteSnippet();
  const { data: snippets } = useListSnippets();
  const {
    data: openedSnippet,
    isLoading: isSnippetLoading,
    isError: isSnippetError,
  } = useGetSnippet(snippetId ?? 0);
  const { data: packages } = useListPackages({ query: { queryKey: getListPackagesQueryKey() } });
  const savedSnippets: Snippet[] = Array.isArray(snippets) ? snippets : [];

  useEffect(() => {
    if (!openedSnippet) return;
    setCode(openedSnippet.code);
    setOutput("");
    setExecTime(null);
    setHasError(false);
  }, [openedSnippet]);

  const handleUpdateSnippet = useCallback(() => {
    if (!openedSnippet || updateSnippet.isPending) return;

    updateSnippet.mutate(
      { id: openedSnippet.id, data: { title: openedSnippet.title, code } },
      {
        onSuccess: (snippet) => {
          queryClient.setQueryData(getGetSnippetQueryKey(snippet.id), snippet);
          queryClient.invalidateQueries({ queryKey: getListSnippetsQueryKey() });
          toast({ title: "Snippet updated" });
        },
        onError: () => {
          toast({ title: "Failed to update snippet", variant: "destructive" });
        },
      }
    );
  }, [code, openedSnippet, queryClient, toast, updateSnippet]);

  const handleRun = () => {
    runCode.mutate(
      { data: { code } },
      {
        onSuccess: (result) => {
          setExecTime(result.executionTime);
          if (result.error) {
            setOutput(result.error);
            setHasError(true);
          } else {
            setOutput(result.output || "(no output)");
            setHasError(false);
          }
        },
        onError: () => {
          setOutput("Failed to execute code. Please try again.");
          setHasError(true);
        },
      }
    );
  };

  const handleSave = () => {
    if (!snippetTitle.trim()) return;
    createSnippet.mutate(
      { data: { title: snippetTitle.trim(), code } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListSnippetsQueryKey() });
          setSaveOpen(false);
          setSnippetTitle("");
          toast({ title: "Snippet saved" });
        },
      }
    );
  };

  const handlePrimarySave = useCallback(() => {
    if (openedSnippet) {
      handleUpdateSnippet();
      return;
    }

    setSaveOpen(true);
    setSnippetTitle("");
  }, [handleUpdateSnippet, openedSnippet]);

  useEffect(() => {
    primarySaveRef.current = handlePrimarySave;
  }, [handlePrimarySave]);

  const handleDeleteSnippet = (id: number) => {
    deleteSnippet.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListSnippetsQueryKey() });
          toast({ title: "Snippet deleted" });
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleRun();
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
      e.preventDefault();
      handlePrimarySave();
    }
  };

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      primarySaveRef.current();
    });
  };
  const handleOpen = (id: number) => {
    setLocation(`/snippets/${id}`);
  };

  return (
    <div className="flex flex-col h-full" onKeyDown={handleKeyDown}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-card shrink-0">
        <Button
          onClick={handleRun}
          disabled={runCode.isPending}
          size="sm"
          className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
          data-testid="button-run"
        >
          {runCode.isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current" />
          )}
          Run
        </Button>

        <span className="text-xs text-muted-foreground hidden sm:block">
          {isSnippetLoading
            ? "Loading snippet..."
            : openedSnippet
              ? openedSnippet.title
              : "Ctrl+Enter to run"}
        </span>
        {isSnippetError && (
          <span className="text-xs text-destructive hidden sm:block">
            Snippet not found
          </span>
        )}

        <div className="flex-1" />

        {/* Templates dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs" data-testid="button-templates">
              Templates
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-xs text-muted-foreground">Starter templates</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {TEMPLATES.map((t) => (
              <DropdownMenuItem
                key={t.label}
                onClick={() => setCode(t.code)}
                className="text-sm"
                data-testid={`template-${t.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {t.label}
              </DropdownMenuItem>
            ))}
            {/* {savedSnippets.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs text-muted-foreground">Saved snippets</DropdownMenuLabel>
                {savedSnippets.map((s) => (
                  <DropdownMenuItem
                    key={s.id}
                    className="flex items-center justify-between text-sm group"
                    data-testid={`snippet-load-${s.id}`}

                    onSelect={() => handleOpen(s.id)}
                  // onSelect={() => setCode(s.code)}
                  >
                    <span className="truncate">{s.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSnippet(s.id);
                        // handleOpen(s.id)
                      }}
                      className="opacity-0 group-hover:opacity-100 ml-2 text-muted-foreground hover:text-destructive transition-opacity"
                      data-testid={`snippet-delete-${s.id}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </DropdownMenuItem>
                ))}
              </>
            )} */}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={() => setPackagesOpen(true)}
          data-testid="button-packages"
        >
          <Package className="w-3.5 h-3.5" />
          Packages
          {packages && packages.length > 0 && (
            <span className="ml-0.5 bg-primary text-primary-foreground text-[10px] font-bold px-1 py-px rounded-full leading-none">
              {packages.length}
            </span>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={handlePrimarySave}
          disabled={Boolean(openedSnippet && updateSnippet.isPending)}
          data-testid="button-save"
        >
          {openedSnippet && updateSnippet.isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          {openedSnippet ? "Update" : "Save"}
        </Button>
      </div>

      {/* Editor + Output split */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor panel */}
        <div className="flex-1 min-w-0 overflow-hidden border-r border-border">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            value={code}
            onChange={(val) => setCode(val ?? "")}
            theme="vs-dark"
            onMount={handleEditorMount}
            options={{
              fontSize: 13,
              fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, monospace",
              fontLigatures: true,
              minimap: { enabled: false },
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              wordWrap: "on",
              padding: { top: 12, bottom: 12 },
              renderLineHighlight: "line",
              smoothScrolling: true,
              cursorSmoothCaretAnimation: "on",
              tabSize: 2,
            }}
          />
        </div>

        {/* Output panel */}
        <div className="w-80 lg:w-96 flex flex-col shrink-0 bg-card">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Output</span>
            {execTime !== null && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground" data-testid="text-exec-time">
                <Clock className="w-3 h-3" />
                {execTime}ms
              </span>
            )}
          </div>
          <div className="flex-1 overflow-auto p-3 output-panel" data-testid="output-panel">
            {runCode.isPending ? (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Running...
              </div>
            ) : output ? (
              <pre
                className={`whitespace-pre-wrap text-sm leading-relaxed ${hasError ? "text-destructive" : "text-foreground"
                  }`}
                data-testid={hasError ? "output-error" : "output-result"}
              >
                {output}
              </pre>
            ) : (
              <p className="text-muted-foreground text-sm italic">
                Run your code to see output here
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Packages panel */}
      <PackagesPanel open={packagesOpen} onClose={() => setPackagesOpen(false)} />

      {/* Save dialog */}
      <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Snippet</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="snippet-title" className="text-sm">Title</Label>
            <Input
              id="snippet-title"
              value={snippetTitle}
              onChange={(e) => setSnippetTitle(e.target.value)}
              placeholder="e.g. Binary Search"
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              autoFocus
              data-testid="input-snippet-title"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setSaveOpen(false)}>Cancel</Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!snippetTitle.trim() || createSnippet.isPending}
              data-testid="button-save-confirm"
            >
              {createSnippet.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
