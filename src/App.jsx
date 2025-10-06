import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginRegister from "./components/LoginRegister";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import ViewDepartment from "./pages/ViewDepartment"; // <-- import new page

function App() {
  return (
    <Router>
      <div className="p-4 max-w-5xl mx-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/auth" />} />
          <Route path="/auth" element={<LoginRegister />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/department/:id"   // <-- route to view a single department
            element={
              <PrivateRoute>
                <ViewDepartment />
              </PrivateRoute>
            }
          />

          {/* Fallback for unknown routes */}
          <Route
            path="*"
            element={
              <h1 className="text-center mt-20 text-2xl font-bold">
                404 - Page Not Found
              </h1>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
