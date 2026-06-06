import { createBrowserRouter } from "react-router-dom"; 
import PortfolioLayout from "./components/PortfolioLayout";
import Home from "./pages/Home";
import BlogDetails from "./pages/BlogDetails";
import RichProjectDetail from "./pages/RichProjectDetail";
import AchievementsPage from "./pages/AchievementsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: PortfolioLayout,
    children: [
      { index: true, Component: Home },
     {
  path: "projects/:slug",
  Component: RichProjectDetail,
},
      { path: "blog/:id", Component: BlogDetails },
    ],
  },
  {
    path: "/achievements",
    Component: AchievementsPage,
  },

]);
