import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ShiftChart() {
  const [data, setData] = useState([
    { shift: '5am-2pm', total: 0 },
    { shift: '2pm-10pm', total: 0 },
    { shift: '10pm-5am', total: 0 },
  ]);

  // Modern gradient colors for the bars
  const COLORS = [
    { primary: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' },
    { primary: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' },
    { primary: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }
  ];

  useEffect(() => {
    const source = axios.CancelToken.source();
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:8000/api/total-pieces-by-shift', {
          cancelToken: source.token,
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          timeout: 10000 // 10 seconds timeout
        });
        
        const json = response.data;
        console.log(json)

        // Map API response to shift labels
        const chartData = [
          { shift: '5am-2pm', total: json?.shift1 || 0 },
          { shift: '2pm-10pm', total: json?.shift2 || 0 },
          { shift: '10pm-5am', total: json?.shift3 || 0 },
        ];

        setData(chartData);
      } catch (err) {
        console.error('Failed to fetch shift data', err);
      }
    }

    fetchData();
  }, []);

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
          borderRadius: '12px',
          padding: '16px 20px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          fontSize: '14px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <p style={{ 
            margin: '0 0 8px 0', 
            fontWeight: '600', 
            color: '#1f2937',
            fontSize: '15px'
          }}>
            {label}
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '3px',
              background: payload[0].payload.shift === '5am–2pm' ? COLORS[0].primary : 
                         payload[0].payload.shift === '2pm–10pm' ? COLORS[1].primary : COLORS[2].primary
            }}></div>
            <p style={{ 
              margin: 0, 
              color: '#374151', 
              fontWeight: '700',
              fontSize: '16px'
            }}>
              {`${payload[0].value} pièces`}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const maxValue = Math.max(...data.map(item => item.total), 0);

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
        marginBottom: '24px'
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '18px',
          fontWeight: '700',
          color: '#0f172a',
          letterSpacing: '-0.025em'
        }}>
          Production par Équipe
        </h3>
        <p style={{
          margin: '4px 0 0 0',
          fontSize: '13px',
          color: '#64748b',
          fontWeight: '500'
        }}>
          Dernières 24 heures
        </p>
      </div>

      {/* Chart */}
      <div style={{ height: 'calc(100% - 80px)', minHeight: '240px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            barCategoryGap="25%"
          >
            <defs>
              {COLORS.map((color, index) => (
                <linearGradient key={index} id={`gradient${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color.primary} stopOpacity={0.9}/>
                  <stop offset="100%" stopColor={color.primary} stopOpacity={0.7}/>
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid 
              strokeDasharray="none" 
              stroke="rgba(148, 163, 184, 0.15)"
              vertical={false}
            />
            
            <XAxis 
              dataKey="shift" 
              tickLine={false}
              axisLine={false}
              tick={{ 
                fontSize: 12, 
                fill: '#64748b', 
                fontWeight: '500',
                fontFamily: 'system-ui, sans-serif'
              }}
              interval={0}
            />
            
            <YAxis 
              allowDecimals={false} 
              domain={[0, maxValue > 0 ? maxValue + Math.ceil(maxValue * 0.2) : 100]}
              tickLine={false}
              axisLine={false}
              tick={{ 
                fontSize: 11, 
                fill: '#94a3b8', 
                fontWeight: '500',
                fontFamily: 'system-ui, sans-serif'
              }}
              width={50}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Bar
              dataKey="total"
              radius={[8, 8, 0, 0]}
              maxBarSize={80}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`url(#gradient${index})`}
                  style={{
                    filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '20px',
        right: '20px',
        display: 'flex',
        justifyContent: 'center',
        gap: '24px',
        flexWrap: 'wrap'
      }}>
        {data.map((item, index) => (
          <div key={index} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '11px',
            color: '#64748b',
            fontWeight: '500'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '3px',
              background: COLORS[index].primary,
              boxShadow: `0 2px 4px ${COLORS[index].primary}40`
            }}></div>
            <span>{item.shift}</span>
            <span style={{ 
              fontWeight: '700', 
              color: '#374151',
              background: 'rgba(0, 0, 0, 0.05)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '10px'
            }}>
              {item.total}
            </span>
          </div>
        ))}
      </div>

      {/* Decorative Elements */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        width: '40px',
        height: '40px',
        background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        opacity: 0.7
      }}>
        📊
      </div>
    </div>
  );
}