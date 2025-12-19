import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockStatsService } from '../../services/mockServices';
import './Dashboard.css';

interface DashboardStats {
  totalClaims: number;
  flaggedClaims: number;
  highRiskClaims: number;
  avgFraudScore: number;
  riskDistribution: Array<{ name: string; value: number }>;
  trends: Array<{ date: string; count: number; flagged: number }>;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await mockStatsService.fetchDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (!stats) {
    return <div className="error">Failed to load dashboard data.</div>;
  }

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="dashboard">
      <h1>Fraud Detection Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <p className="stat-label">Total Claims</p>
            <p className="stat-value">{stats.totalClaims}</p>
          </div>
        </div>

        <div className="stat-card highlight">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <p className="stat-label">Flagged Claims</p>
            <p className="stat-value">{stats.flaggedClaims}</p>
          </div>
        </div>

        <div className="stat-card danger">
          <div className="stat-icon">🚨</div>
          <div className="stat-content">
            <p className="stat-label">High Risk</p>
            <p className="stat-value">{stats.highRiskClaims}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <p className="stat-label">Avg Fraud Score</p>
            <p className="stat-value">{stats.avgFraudScore.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h2>Risk Level Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.riskDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {stats.riskDistribution.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Claims Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} name="Total Claims" />
              <Line type="monotone" dataKey="flagged" stroke="#ef4444" strokeWidth={2} name="Flagged" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
