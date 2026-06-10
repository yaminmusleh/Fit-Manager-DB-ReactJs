import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Members from "./pages/Members";
import Memberships from "./pages/Memberships";
import Trainers from "./pages/Trainers";
import Sessions from "./pages/Sessions";
import Equipment from "./pages/Equipment";
import Maintenance from "./pages/Maintenance";
import Lockers from "./pages/Lockers";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "members",
        element: <Members />,
      },
      {
        path: "memberships",
        element: <Memberships />,
      },
      {
        path: "trainers",
        element: <Trainers />,
      },
      {
        path: "sessions",
        element: <Sessions />,
      },
      {
        path: "equipment",
        element: <Equipment />,
      },
      {
        path: "maintenance",
        element: <Maintenance />,
      },
      {
        path: "lockers",
        element: <Lockers />,
      },
    ],
  },
]);
export default router;
