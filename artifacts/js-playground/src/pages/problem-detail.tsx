import { useState } from "react";
import { useLocation } from "wouter";
import Editor from "@monaco-editor/react";
import { Play, ArrowLeft, CheckCircle2, XCircle, Loader2, Clock } from "lucide-react";
import { useGetProblem, getGetProblemQueryKey, useRunCode } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const cls =
    difficulty === "Easy"
      ? "badge-easy"
      : difficulty === "Medium"
      ? "badge-medium"
      : "badge-hard";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${cls}`}>
      {difficulty}
    </span>
  );
}

interface Props {
  params: { id: string };
}

export default function ProblemDetail({ params }: Props) {
  const [, setLocation] = useLocation();
  const [code, setCode] = useState<string | null>(null);
  const [output, setOutput] = useState("");
  const [hasError, setHasError] = useState(false);
  const [execTime, setExecTime] = useState<number | null>(null);

  const { data: problem, isLoading } = useGetProblem(params.id, {
    query: {
      queryKey: getGetProblemQueryKey(params.id),
    },
  });

  const runCode = useRunCode();

  const currentCode = code ?? problem?.starterCode ?? "";

  const handleRun = () => {
    runCode.mutate(
      { data: { code: currentCode } },
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
          setOutput("Execution failed. Please try again.");
          setHasError(true);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-5 w-16 ml-2 rounded" />
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className="w-80 lg:w-96 p-4 space-y-3 border-r border-border">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="flex-1" />
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
        <XCircle className="w-10 h-10 opacity-40" />
        <p>Problem not found</p>
        <Button variant="ghost" size="sm" onClick={() => setLocation("/problems")}>
          Back to Problems
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-3 py-2 border-b border-border bg-card shrink-0">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-xs h-8 px-2"
          onClick={() => setLocation("/problems")}
          data-testid="button-back"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Problems
        </Button>
        <div className="w-px h-4 bg-border" />
        <h1 className="text-sm font-semibold text-foreground truncate" data-testid="text-problem-title">
          {problem.title}
        </h1>
        <DifficultyBadge difficulty={problem.difficulty} />
        <div className="flex-1" />
        <Button
          onClick={handleRun}
          disabled={runCode.isPending}
          size="sm"
          className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
          data-testid="button-run-problem"
        >
          {runCode.isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current" />
          )}
          Run
        </Button>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Problem description + test cases */}
        <div className="w-80 lg:w-[400px] shrink-0 flex flex-col border-r border-border overflow-hidden">
          <Tabs defaultValue="description" className="flex flex-col flex-1 overflow-hidden">
            <TabsList className="shrink-0 mx-3 mt-2 mb-0 h-8 bg-muted/50 rounded">
              <TabsTrigger value="description" className="text-xs h-6 px-3">Description</TabsTrigger>
              <TabsTrigger value="tests" className="text-xs h-6 px-3">Test Cases</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="flex-1 overflow-auto p-4 mt-2 prose prose-sm prose-invert max-w-none">
              <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap font-sans">
                {problem.description.replace(/`([^`]+)`/g, (_, code) => code)}
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {problem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground border border-border"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="tests" className="flex-1 overflow-auto p-4 mt-2 space-y-3">
              {problem.testCases.map((tc, i) => (
                <div key={i} className="rounded-md border border-border bg-muted/30 overflow-hidden">
                  <div className="px-3 py-1.5 border-b border-border bg-muted/50">
                    <span className="text-xs font-medium text-muted-foreground">Case {i + 1}</span>
                  </div>
                  <div className="p-3 space-y-2">
                    <div>
                      <span className="text-xs text-muted-foreground block mb-0.5">Input</span>
                      <code className="text-xs text-foreground font-mono block bg-background rounded px-2 py-1 border border-border">
                        {tc.input}
                      </code>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block mb-0.5">Expected</span>
                      <code className="text-xs text-primary font-mono block bg-background rounded px-2 py-1 border border-border">
                        {tc.expected}
                      </code>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right: Editor + Output */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              value={currentCode}
              onChange={(val) => setCode(val ?? "")}
              theme="vs-dark"
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

          {/* Output */}
          <div className="h-40 shrink-0 border-t border-border flex flex-col bg-card">
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-border">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Output</span>
              <div className="flex items-center gap-2">
                {execTime !== null && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {execTime}ms
                  </span>
                )}
                {output && !runCode.isPending && (
                  hasError ? (
                    <XCircle className="w-3.5 h-3.5 text-destructive" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  )
                )}
              </div>
            </div>
            <div className="flex-1 overflow-auto p-3 output-panel" data-testid="problem-output-panel">
              {runCode.isPending ? (
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Running...
                </div>
              ) : output ? (
                <pre
                  className={`whitespace-pre-wrap text-sm leading-relaxed ${
                    hasError ? "text-destructive" : "text-foreground"
                  }`}
                >
                  {output}
                </pre>
              ) : (
                <p className="text-muted-foreground text-sm italic">
                  Run your code to see output
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
