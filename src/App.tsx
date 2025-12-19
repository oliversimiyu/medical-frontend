import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './state/store';
import Layout from './components/Layout/Layout';
import Notifications from './components/Notifications/Notifications';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import Dashboard from './pages/Dashboard/Dashboard';
import ClaimsList from './pages/ClaimsList/ClaimsList';
import ClaimDetail from './pages/ClaimDetail/ClaimDetail';
import Upload from './pages/Upload/Upload';
import GraphView from './pages/GraphView/GraphView';
import Investigation from './pages/Investigation/Investigation';
import AuditLog from './pages/AuditLog/AuditLog';

function App() {
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  return (
    <Router>
      <Notifications />
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignUp />}
        />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Layout>
                <Navigate to="/dashboard" />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Layout>
                <Dashboard />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/claims"
          element={
            isAuthenticated ? (
              <Layout>
                <ClaimsList />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/claims/:id"
          element={
            isAuthenticated ? (
              <Layout>
                <ClaimDetail />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/upload"
          element={
            isAuthenticated ? (
              <Layout>
                <Upload />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/graph"
          element={
            isAuthenticated ? (
              <Layout>
                <GraphView />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/investigation"
          element={
            isAuthenticated ? (
              <Layout>
                <Investigation />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/audit"
          element={
            isAuthenticated ? (
              <Layout>
                <AuditLog />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
