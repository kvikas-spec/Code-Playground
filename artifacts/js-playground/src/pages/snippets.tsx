import { useLocation } from "wouter";
import { Bookmark, Trash2, ExternalLink, Plus, Loader2, Clock } from "lucide-react";
import { useListSnippets, useDeleteSnippet, getListSnippetsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function Snippets() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: snippets, isLoading } = useListSnippets();
  const deleteSnippet = useDeleteSnippet();

  const handleDelete = (id: number, title: string) => {
    deleteSnippet.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListSnippetsQueryKey() });
          toast({ title: `Deleted "${title}"` });
        },
      }
    );
  };

  const handleOpen = (code: string) => {
    sessionStorage.setItem("playground-code", code);
    setLocation("/");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold">Saved Snippets</h2>
          {snippets && (
            <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              {snippets.length}
            </span>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={() => setLocation("/")}
          data-testid="button-new-snippet"
        >
          <Plus className="w-3.5 h-3.5" />
          New in Playground
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="divide-y divide-border">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="px-4 py-4 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-16 w-full rounded" />
              </div>
            ))}
          </div>
        ) : !snippets || snippets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
            <Bookmark className="w-10 h-10 opacity-30" />
            <p className="text-sm">No saved snippets yet</p>
            <p className="text-xs opacity-60">Save code from the Playground to see it here</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation("/")}
              data-testid="button-go-playground"
            >
              Open Playground
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {snippets.map((snippet) => (
              <div
                key={snippet.id}
                className="group px-4 py-4 hover:bg-accent/30 transition-colors"
                data-testid={`snippet-card-${snippet.id}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium text-foreground truncate">{snippet.title}</h3>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                      <Clock className="w-3 h-3" />
                      {formatDate(snippet.createdAt)}
                      <span className="mx-1">·</span>
                      {snippet.code.split("\n").length} lines
                    </div>
                    <pre className="text-xs text-muted-foreground bg-muted/50 rounded border border-border px-3 py-2 overflow-hidden font-mono leading-relaxed line-clamp-4 max-h-20">
                      {snippet.code.slice(0, 400)}
                    </pre>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => handleOpen(snippet.code)}
                      title="Open in Playground"
                      data-testid={`snippet-open-${snippet.id}`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(snippet.id, snippet.title)}
                      disabled={deleteSnippet.isPending}
                      title="Delete snippet"
                      data-testid={`snippet-delete-${snippet.id}`}
                    >
                      {deleteSnippet.isPending ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
