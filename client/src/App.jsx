import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './pages/Dashboard';

// Simple auth check - adjust logic based on your auth storage (e.g., localStorage JWT)
const isAuthenticated = () => {
  return !!localStorage.getItem('token'); // or another key you store JWT in
};

// PrivateRoute component to protect routes
function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/login" 
          element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Register />} 
        />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
