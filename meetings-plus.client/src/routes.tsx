import { createBrowserRouter, redirect } from "react-router-dom";
import App from "./App";
import LinearIndex from "./components/linear/LinearIndex";

type Connected = {
  connected: boolean;
};

async function linearLoader() {
  const res = await fetch("http://localhost:3000/linear/status");
  const data: Connected = await res.json();

  if (!data.connected) {
    return redirect("/");
  }

  return data;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/linear",
    element: <LinearIndex />,
    loader: linearLoader,
  },
]);
