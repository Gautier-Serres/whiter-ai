import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import DemoPage from "./pages/DemoPage";
import TeamPage from "./pages/TeamPage";
import "./index.css";

function Router() {
  const path = window.location.pathname;
  if (path === "/demo") return <DemoPage />;
  if (path === "/team") return <TeamPage />;
  return <App />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);
