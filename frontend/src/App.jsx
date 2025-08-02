import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import EditPage from "./pages/EditPage"; /// ✅ Added
import NoteDetailPage from "./pages/NoteDetailPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Navbar />
   <Routes>
  <Route path="/" element={<HomePage />} />

  <Route
    path="/create"
    element={
      <ProtectedRoute>
        <CreatePage />
      </ProtectedRoute>
    }
  />

  <Route
    path="/edit/:id"
    element={
      <ProtectedRoute>
        <EditPage />
      </ProtectedRoute>
    }
  />

  <Route
    path="/notes/:id"
    element={
      <ProtectedRoute>
        <NoteDetailPage />
      </ProtectedRoute>
    }
  />
</Routes>

    </>
  );
}

export default App;
