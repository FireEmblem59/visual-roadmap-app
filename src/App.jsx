// src/App.jsx

import { useAuth } from "./features/auth/AuthProvider";
import LoginPage from "./pages/LoginPage";
import RoadmapPage from "./pages/RoadmapPage";
import MainLayout from "./components/layout/MainLayout";

function App() {
  const { currentUser } = useAuth();

  // If there's no user, show the beautiful login page.
  if (!currentUser) {
    return <LoginPage />;
  }

  // If there IS a user, show the RoadmapPage wrapped in our MainLayout.
  return (
    <MainLayout>
      <RoadmapPage />
    </MainLayout>
  );
}

export default App;
