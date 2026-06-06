import { RouterProvider } from "react-router-dom"; 
import { router } from "./routes";
import { PortfolioProvider } from "@/contexts/PortfolioContext";

export default function App() {
  return (
    <PortfolioProvider>
      <RouterProvider router={router} />
    </PortfolioProvider>
  );
}
