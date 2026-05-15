import { Link, useLocation } from "wouter";
import { Code2, BookOpen, Bookmark, Terminal } from "lucide-react";

const navItems = [
  { href: "/", label: "Playground", icon: Terminal },
  { href: "/problems", label: "Problems", icon: BookOpen },
  { href: "/snippets", label: "Snippets", icon: Bookmark },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="flex items-center gap-4 px-4 h-12 border-b border-border bg-sidebar shrink-0">
        <div className="flex items-center gap-2 mr-2">
          <Code2 className="w-5 h-5 text-primary" />
          <span className="font-semibold text-sm tracking-tight text-foreground">JS Playground</span>
        </div>
        <nav className="flex items-center gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = href === "/" ? location === "/" : location.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors ${
                  isActive
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
                data-testid={`nav-${label.toLowerCase()}`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
