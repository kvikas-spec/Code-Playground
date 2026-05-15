import { useState } from "react";
import { Package, Plus, Trash2, Loader2, X, Search, ExternalLink } from "lucide-react";
import {
  useListPackages,
  useInstallPackage,
  useRemovePackage,
  getListPackagesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

const POPULAR_PACKAGES = [
  { name: "lodash", description: "Utility functions" },
  { name: "dayjs", description: "Date manipulation" },
  { name: "axios", description: "HTTP client" },
  { name: "zod", description: "Schema validation" },
  { name: "uuid", description: "UUID generation" },
  { name: "mathjs", description: "Math library" },
  { name: "validator", description: "String validation" },
  { name: "chalk", description: "Terminal styling" },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function PackagesPanel({ open, onClose }: Props) {
  const [search, setSearch] = useState("");
  const [installing, setInstalling] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: packages, isLoading } = useListPackages({
    query: { queryKey: getListPackagesQueryKey(), enabled: open },
  });
  const installPkg = useInstallPackage();
  const removePkg = useRemovePackage();

  const installedNames = new Set(packages?.map((p) => p.name) ?? []);

  const handleInstall = (name: string) => {
    const pkgName = name.trim();
    if (!pkgName) return;
    setInstalling(pkgName);
    installPkg.mutate(
      { data: { name: pkgName } },
      {
        onSuccess: (pkg) => {
          queryClient.invalidateQueries({ queryKey: getListPackagesQueryKey() });
          setSearch("");
          toast({ title: `Installed ${pkg.name}@${pkg.version}` });
        },
        onError: (err) => {
          const msg = (err as { data?: { error?: string } })?.data?.error ?? "Installation failed";
          toast({ title: "Install failed", description: msg, variant: "destructive" });
        },
        onSettled: () => setInstalling(null),
      }
    );
  };

  const handleRemove = (name: string) => {
    removePkg.mutate(
      { name },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListPackagesQueryKey() });
          toast({ title: `Removed ${name}` });
        },
        onError: () => {
          toast({ title: "Remove failed", variant: "destructive" });
        },
      }
    );
  };

  const filteredPopular = POPULAR_PACKAGES.filter(
    (p) => !search || p.name.includes(search.toLowerCase())
  );

  const isSearchCustom =
    search.trim().length > 0 &&
    !POPULAR_PACKAGES.some((p) => p.name === search.trim());

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-80 flex flex-col p-0 gap-0 bg-sidebar border-l border-border">
        <SheetHeader className="px-4 pt-4 pb-3 border-b border-border shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              <SheetTitle className="text-sm font-semibold">Packages</SheetTitle>
              {packages && packages.length > 0 && (
                <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                  {packages.length}
                </span>
              )}
            </div>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onClose}>
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
          <SheetDescription className="text-xs text-muted-foreground mt-1">
            Install npm packages and use them with <code className="font-mono bg-muted px-1 rounded">require()</code>
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-auto">
          {/* Install input */}
          <div className="px-3 py-3 border-b border-border">
            <div className="flex gap-1.5">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Package name..."
                  className="pl-7 h-8 text-xs font-mono"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && search.trim()) handleInstall(search.trim());
                  }}
                  data-testid="input-package-name"
                />
              </div>
              <Button
                size="sm"
                className="h-8 px-3 shrink-0 gap-1"
                disabled={!search.trim() || !!installing}
                onClick={() => handleInstall(search.trim())}
                data-testid="button-install-package"
              >
                {installing ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Plus className="w-3 h-3" />
                )}
                Add
              </Button>
            </div>
            {installing && (
              <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                Installing {installing}...
              </p>
            )}
          </div>

          {/* Installed packages */}
          {isLoading ? (
            <div className="px-3 py-3 space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : packages && packages.length > 0 ? (
            <div className="px-3 py-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2 px-1">
                Installed
              </p>
              <div className="space-y-1">
                {packages.map((pkg) => (
                  <div
                    key={pkg.name}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-muted/40 border border-border group"
                    data-testid={`pkg-installed-${pkg.name}`}
                  >
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-mono text-foreground font-medium">{pkg.name}</span>
                      <span className="text-xs text-muted-foreground ml-1.5">@{pkg.version}</span>
                    </div>
                    <a
                      href={`https://www.npmjs.com/package/${pkg.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                      title="View on npm"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      onClick={() => handleRemove(pkg.name)}
                      disabled={removePkg.isPending}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      title="Remove"
                      data-testid={`pkg-remove-${pkg.name}`}
                    >
                      {removePkg.isPending ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="px-3 py-4 text-center">
              <Package className="w-7 h-7 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">No packages installed yet</p>
            </div>
          )}

          {/* Popular packages */}
          <div className="px-3 py-2 border-t border-border">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2 px-1">
              {search ? "Suggestions" : "Popular"}
            </p>
            <div className="space-y-1">
              {isSearchCustom && (
                <button
                  onClick={() => handleInstall(search.trim())}
                  disabled={!!installing || installedNames.has(search.trim())}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/60 transition-colors text-left group disabled:opacity-50"
                  data-testid={`pkg-suggest-custom`}
                >
                  <Plus className="w-3 h-3 text-primary shrink-0" />
                  <span className="text-xs font-mono text-foreground">{search.trim()}</span>
                  <span className="text-xs text-muted-foreground ml-auto">install</span>
                </button>
              )}
              {filteredPopular.map((pkg) => {
                const isInstalled = installedNames.has(pkg.name);
                return (
                  <button
                    key={pkg.name}
                    onClick={() => !isInstalled && handleInstall(pkg.name)}
                    disabled={isInstalled || !!installing}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/60 transition-colors text-left disabled:cursor-default disabled:opacity-70"
                    data-testid={`pkg-suggest-${pkg.name}`}
                  >
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-mono text-foreground">{pkg.name}</span>
                      <span className="text-xs text-muted-foreground ml-1.5 truncate">{pkg.description}</span>
                    </div>
                    {isInstalled ? (
                      <span className="text-xs text-primary shrink-0">installed</span>
                    ) : (
                      <Plus className="w-3 h-3 text-muted-foreground group-hover:text-foreground shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Usage hint */}
          <div className="px-3 pb-4">
            <div className="bg-muted/30 border border-border rounded-md p-3 mt-2">
              <p className="text-xs text-muted-foreground font-medium mb-1.5">Usage in code</p>
              <pre className="text-xs text-foreground font-mono leading-relaxed">{`const _ = require('lodash');\nconst sum = _.sum([1, 2, 3]);\nconsole.log(sum); // 6`}</pre>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
