import { useState } from "react";
import { useLocation } from "wouter";
import { Search, ChevronRight, BarChart3 } from "lucide-react";
import { useListProblems, getListProblemsQueryKey, useGetProblemStats } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const DIFFICULTIES = ["All", "Easy", "Medium", "Hard"] as const;
type Difficulty = (typeof DIFFICULTIES)[number];

const CATEGORIES = ["All", "Arrays", "Stack", "Linked List", "Dynamic Programming", "Binary Search", "Sliding Window", "Two Pointers", "Graph", "Backtracking", "Design"] as const;

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

export default function Problems() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("All");
  const [category, setCategory] = useState("All");

  const { data: problems, isLoading } = useListProblems(
    {
      ...(difficulty !== "All" ? { difficulty } : {}),
      ...(category !== "All" ? { category } : {}),
    },
    { query: { queryKey: getListProblemsQueryKey({ difficulty: difficulty !== "All" ? difficulty : undefined, category: category !== "All" ? category : undefined }) } }
  );
  const { data: stats } = useGetProblemStats();

  const filtered = problems?.filter(
    (p) => !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.tags.some((t) => t.includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full">
      {/* Stats bar */}
      {stats && (
        <div className="flex items-center gap-6 px-4 py-3 border-b border-border bg-card shrink-0">
          <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
            <BarChart3 className="w-4 h-4" />
            <span className="font-medium text-foreground">{stats.total}</span> problems
          </div>
          {Object.entries(stats.byDifficulty).map(([d, count]) => (
            <div key={d} className="flex items-center gap-1.5 text-sm">
              <DifficultyBadge difficulty={d} />
              <span className="text-muted-foreground">{count}</span>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-b border-border shrink-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problems..."
            className="pl-8 h-8 text-sm w-52"
            data-testid="input-search-problems"
          />
        </div>

        <div className="flex items-center gap-1">
          {DIFFICULTIES.map((d) => (
            <Button
              key={d}
              variant={difficulty === d ? "secondary" : "ghost"}
              size="sm"
              className="h-7 text-xs px-2.5"
              onClick={() => setDifficulty(d)}
              data-testid={`filter-difficulty-${d.toLowerCase()}`}
            >
              {d}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-1 flex-wrap">
          {CATEGORIES.slice(0, 6).map((c) => (
            <Button
              key={c}
              variant={category === c ? "secondary" : "ghost"}
              size="sm"
              className="h-7 text-xs px-2.5"
              onClick={() => setCategory(c)}
              data-testid={`filter-category-${c.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {c}
            </Button>
          ))}
        </div>
      </div>

      {/* Problem list */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="divide-y divide-border">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-5 w-16 rounded ml-auto" />
              </div>
            ))}
          </div>
        ) : filtered?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
            <Search className="w-8 h-8 mb-2 opacity-40" />
            <p className="text-sm">No problems match your filters</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered?.map((problem, idx) => (
              <button
                key={problem.id}
                onClick={() => setLocation(`/problems/${problem.id}`)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent/50 transition-colors text-left group"
                data-testid={`problem-row-${problem.id}`}
              >
                <span className="text-xs text-muted-foreground w-6 text-right shrink-0">{idx + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                      {problem.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <span className="text-xs text-muted-foreground">{problem.category}</span>
                    {problem.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs text-muted-foreground/60">
                        · {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <DifficultyBadge difficulty={problem.difficulty} />
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
