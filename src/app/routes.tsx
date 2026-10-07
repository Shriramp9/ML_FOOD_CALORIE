import { createBrowserRouter } from "react-router";
import { Onboarding } from "./components/Onboarding";
import { SignupLogin } from "./components/SignupLogin";
import { ProfileSetup } from "./components/ProfileSetup";
import { Dashboard } from "./components/Dashboard";
import { ScanScreen } from "./components/ScanScreen";
import { DetectionResults } from "./components/DetectionResults";
import { History } from "./components/History";
import { Reports } from "./components/Reports";
import { Profile } from "./components/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Onboarding,
  },
  {
    path: "/signup",
    Component: SignupLogin,
  },
  {
    path: "/login",
    Component: SignupLogin,
  },
  {
    path: "/profile-setup",
    Component: ProfileSetup,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/scan",
    Component: ScanScreen,
  },
  {
    path: "/detection-results",
    Component: DetectionResults,
  },
  {
    path: "/history",
    Component: History,
  },
  {
    path: "/reports",
    Component: Reports,
  },
  {
    path: "/profile",
    Component: Profile,
  },
]);
