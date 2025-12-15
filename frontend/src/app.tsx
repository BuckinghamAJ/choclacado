import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import Nav from "~/components/Nav";
import "./app.css";
import { ShareSideBar } from "./components/Share";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { Toaster } from "./components/ui/toast";

export default function App() {
  return (
    <Router
      root={(props) => (
        <>
          <SidebarProvider class="inline">
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
