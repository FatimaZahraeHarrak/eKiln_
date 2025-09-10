import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const TotalPiecesChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Initialize with placeholder data structure
  const placeholderData = [
    { day: 'Monday', pieces: 0 },
    { day: 'Tuesday', pieces: 0 },
    { day: 'Wednesday', pieces: 0 },
    { day: 'Thursday', pieces: 0 },
    { day: 'Friday', pieces: 0 },
    { day: 'Saturday', pieces: 0 },
    { day: 'Sunday', pieces: 0 }
  ];

  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const startTime = Date.now();

        const response = await axios.get('http://localhost:8000/api/total-pieces-by-day', {
          cancelToken: source.token,
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          timeout: 60000 // 10 seconds timeout
        });

        const responseTime = Date.now() - startTime;
        const data = response.data;

        // Validate API response structure
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('Invalid API response structure');
        }

        // Ensure all days are present
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const validatedData = days.map(day => {
          const item = data.find(d => d.day === day);
          return item || { day, pieces: 0 };
        });

        setChartData(validatedData);
        setLastUpdated(new Date());
        console.debug(`API call successful. Response time: ${responseTime}ms`);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log('Request canceled:', err.message);
          return;
        }

        console.error('Error fetching production data:', err);

        let errorMessage = 'Failed to load production data';
        if (err.response) {
          // Server responded with error status (4xx/5xx)
          errorMessage = `Server error: ${err.response.status}`;
          if (err.response.data?.error) {
            errorMessage += ` - ${err.response.data.error}`;
          }
          if (err.response.data?.message) {
            errorMessage += ` (${err.response.data.message})`;
          }
        } else if (err.request) {
          // Request was made but no response received
          errorMessage = 'Network error: No response from server';
        } else {
          // Other errors
          errorMessage = err.message;
        }

        setError(errorMessage);
        setChartData(placeholderData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Refresh data every 5 minutes
    const interval = setInterval(fetchData, 300000);

    return () => {
      clearInterval(interval);
      source.cancel('Component unmounted, request canceled');
    };
  }, []);

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: '12px',
          padding: '16px 20px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          fontSize: '14px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#1f2937' }}>
            {label}
          </p>
          <p style={{ 
            margin: 0, 
            color: '#6366f1', 
            fontWeight: '700',
            fontSize: '16px'
          }}>
            {`${payload[0].value} pièces`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate max value for Y-axis with buffer
  const maxValue = Math.max(...chartData.map(item => item.pieces), 0);
  const yAxisMax = maxValue > 0 ? Math.ceil((maxValue + 1000) / 1000) * 1000 : 4000;

  return (
    <div style={{
      height: '100%',
      width: '100%',
      position: 'relative',
      padding: '24px 20px',
      background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
      borderRadius: '16px',
      border: '1px solid rgba(226, 232, 240, 0.8)',
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
      minHeight: '320px',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div>
          <h3 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: '700',
            color: '#0f172a',
            letterSpacing: '-0.025em'
          }}>
            Production Hebdomadaire
          </h3>
          <p style={{
            margin: '4px 0 0 0',
            fontSize: '13px',
            color: '#64748b',
            fontWeight: '500'
          }}>
            Total des pièces par jour
          </p>
        </div>
        
        {lastUpdated && !error && (
          <div style={{
            fontSize: '11px',
            color: '#64748b',
            background: 'rgba(99, 102, 241, 0.08)',
            padding: '6px 12px',
            borderRadius: '20px',
            border: '1px solid rgba(99, 102, 241, 0.15)',
            fontWeight: '500'
          }}>
            ● Mis à jour: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid rgba(99, 102, 241, 0.1)',
            borderTop: '4px solid #6366f1',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <div style={{
            fontSize: '14px',
            color: '#64748b',
            fontWeight: '500'
          }}>
            Chargement des données...
          </div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'linear-gradient(135deg, #fef2f2 0%, #ffffff 100%)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '16px',
          padding: '24px',
          textAlign: 'center',
          maxWidth: '320px',
          boxShadow: '0 8px 32px rgba(239, 68, 68, 0.1)'
        }}>
          <div style={{
            fontSize: '32px',
            marginBottom: '12px'
          }}>
            ⚠️
          </div>
          <div style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#dc2626',
            marginBottom: '8px'
          }}>
            Erreur de chargement
          </div>
          <div style={{
            fontSize: '13px',
            color: '#7f1d1d',
            marginBottom: '16px'
          }}>
            {error}
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 6px 16px rgba(220, 38, 38, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)';
            }}
          >
            Recharger
          </button>
        </div>
      )}

      {/* Chart */}
      {!loading && !error && (
        <div style={{ height: 'calc(100% - 80px)', minHeight: '240px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                </linearGradient>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.1}/>
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02}/>
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="none"
                stroke="rgba(148, 163, 184, 0.15)"
                vertical={false}
                horizontal={true}
              />

              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{ 
                  fontSize: 12, 
                  fill: '#64748b', 
                  fontWeight: '500',
                  fontFamily: 'system-ui, sans-serif'
                }}
                tickFormatter={(value) => value.substring(0, 3)}
                padding={{ left: 20, right: 20 }}
              />

              <YAxis
                tickCount={5}
                axisLine={false}
                tickLine={false}
                domain={[0, 'dataMax + 200']}
                tick={{ 
                  fontSize: 11, 
                  fill: '#94a3b8', 
                  fontWeight: '500',
                  fontFamily: 'system-ui, sans-serif'
                }}
                width={50}
                allowDecimals={false}
              />

              <Tooltip content={<CustomTooltip />} />

              <Line
                type="monotone"
                dataKey="pieces"
                stroke="url(#lineGradient)"
                strokeWidth={3}
                dot={{ 
                  fill: '#ffffff', 
                  stroke: '#6366f1', 
                  strokeWidth: 3, 
                  r: 5,
                  filter: 'drop-shadow(0 2px 4px rgba(99, 102, 241, 0.3))'
                }}
                activeDot={{ 
                  r: 7, 
                  strokeWidth: 3, 
                  fill: '#ffffff', 
                  stroke: '#6366f1',
                  filter: 'drop-shadow(0 4px 8px rgba(99, 102, 241, 0.4))'
                }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Status Indicator */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '11px',
        color: '#94a3b8',
        fontWeight: '500'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: error ? '#ef4444' : '#10b981',
          boxShadow: error ? '0 0 8px rgba(239, 68, 68, 0.4)' : '0 0 8px rgba(16, 185, 129, 0.4)'
        }}></div>
        {error ? 'Problème de connexion' : 'Données en temps réel'}
      </div>
    </div>
  );
};

export default TotalPiecesChart;