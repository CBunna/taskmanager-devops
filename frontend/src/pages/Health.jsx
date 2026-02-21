import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { healthAPI } from '../services/api';

const Health = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHealth = async () => {
    try {
      const response = await healthAPI.check();
      setHealth(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch health status');
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getServiceStatus = (status) => {
    return status === 'connected' ? (
      <span className="text-green-600">✓ Connected</span>
    ) : (
      <span className="text-red-600">✗ Disconnected</span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading health status...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">System Health</h1>
          <button
            onClick={fetchHealth}
            className="btn-secondary text-sm"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {health && (
          <div className="space-y-6">
            <div className={`card border-2 ${getStatusColor(health.status)}`}>
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">
                  {health.status.toUpperCase()}
                </h2>
                <p className="text-sm">Application Status</p>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Database</span>
                  {getServiceStatus(health.db)}
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Redis Cache</span>
                  {getServiceStatus(health.redis)}
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Uptime</span>
                  <span>{Math.floor(health.uptime / 60)} minutes</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Response Time</span>
                  <span>{health.responseTime}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium">Last Check</span>
                  <span>{new Date(health.timestamp).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Health;
