import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import routes from "tempo-routes";
import Home from "./components/pages/home";
import { Toaster } from "./components/ui/toaster";
import { LoadingScreen } from "./components/ui/loading-spinner";

function App() {
  return (
    <>
      <Suspense fallback={<LoadingScreen text="Loading application..." />}>
        <Home />
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </Suspense>
      <Toaster />
    </>
  );
}

export default App;