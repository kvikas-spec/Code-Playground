import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/layout";
import Playground from "@/pages/playground";
import Problems from "@/pages/problems";
import ProblemDetail from "@/pages/problem-detail";
import Snippets from "@/pages/snippets";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/">
          {() => <Playground />}
        </Route>
        <Route path="/problems" component={Problems} />
        <Route path="/problems/:id">
          {(params) => <ProblemDetail params={params} />}
        </Route>
        <Route path="/snippets/:id">
          {(params) => <Playground snippetId={Number(params.id)} />}
        </Route>
        <Route path="/snippets" component={Snippets} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
