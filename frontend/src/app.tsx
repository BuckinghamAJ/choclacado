import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import { SidebarProvider } from "./components/ui/sidebar";
import { Toaster } from "./components/ui/toast";

export default function App() {
  return (
    <Router
      root={(props) => (
        <>
          <SidebarProvider class="inline" defaultOpen={false}>
            <Suspense>{props.children}</Suspense>
            <Toaster />
          </SidebarProvider>
        </>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
