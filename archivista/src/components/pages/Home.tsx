import React, { useEffect, useState } from 'react';
import { artifactService, Artifact } from '../../services/artifactService';
import { useAuth } from '../../context/AuthContext';
import CountUp from 'react-countup';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import "./Documents.css"

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Home = () => {
  const { user } = useAuth();
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtifacts = async () => {
      setIsLoading(true);
      try {
        const data = await artifactService.getAllArtifacts();
        setArtifacts(data);
      } catch (err: any) {
        setError('Failed to fetch statistics');
      } finally {
        setIsLoading(false);
      }
    };
    fetchArtifacts();
  }, []);

  // Calculate statistics
  const totalArtifacts = artifacts.length;
  const artifactsByType = artifacts.reduce((acc: Record<string, number>, artifact) => {
    const type = artifact.type || 'Unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  const artifactsByPeriod = artifacts.reduce((acc: Record<string, number>, artifact) => {
    const period = artifact.period || 'Unknown';
    acc[period] = (acc[period] || 0) + 1;
    return acc;
  }, {});

  // Chart configurations
  const typeChartData = {
    labels: Object.keys(artifactsByType),
    datasets: [
      {
        data: Object.values(artifactsByType),
        backgroundColor: [
          'rgba(63, 203, 243, 0.8)',
          'rgba(63, 203, 243, 0.6)',
          'rgba(63, 203, 243, 0.4)',
          'rgba(63, 203, 243, 0.2)',
          'rgba(63, 203, 243, 0.1)',
        ],
        borderColor: [
          'rgba(63, 203, 243, 1)',
          'rgba(63, 203, 243, 0.8)',
          'rgba(63, 203, 243, 0.6)',
          'rgba(63, 203, 243, 0.4)',
          'rgba(63, 203, 243, 0.2)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const periodChartData = {
    labels: Object.keys(artifactsByPeriod),
    datasets: [
      {
        label: 'Artifacts',
        data: Object.values(artifactsByPeriod),
        backgroundColor: 'rgba(63, 203, 243, 0.6)',
        borderColor: 'rgba(63, 203, 243, 1)',
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            size: 12,
          },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(26, 29, 36, 0.9)',
        titleColor: '#3fcbf3',
        bodyColor: '#fff',
        padding: 12,
        borderColor: 'rgba(63, 203, 243, 0.1)',
        borderWidth: 1,
        displayColors: true,
        usePointStyle: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
        },
      },
    },
  };

  return (
    <div className="content" style={{ padding: '24px', maxWidth: '100%' }}>
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto',
        padding: '0 16px'
      }}>
        <h1 style={{ 
          fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', 
          marginBottom: '0.5em',
          textAlign: 'center',
          transition: 'all 0.3s ease'
        }}>
          Statistics Dashboard
        </h1>
        <p style={{ 
          color: '#3fcbf3', 
          fontSize: 'clamp(1rem, 2vw, 1.2rem)', 
          marginBottom: 48, 
          opacity: 0.9,
          textAlign: 'center',
          transition: 'all 0.3s ease'
        }}>
          Archivista Collection Overview
        </p>
        {isLoading ? (
          <div className="loading-spinner" />
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <div style={{ 
            width: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 'clamp(24px, 4vw, 48px)',
            transition: 'all 0.3s ease'
          }}>
            {/* Total Artifacts Card */}
            <div className="stats-card" style={{
              background: 'linear-gradient(135deg, rgba(63, 203, 243, 0.1), rgba(63, 203, 243, 0.05))',
              borderRadius: '20px',
              padding: 'clamp(24px, 4vw, 32px)',
              border: '1px solid rgba(63, 203, 243, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              cursor: 'default'
            }}>
              <h2 style={{ 
                color: '#3fcbf3', 
                fontSize: 'clamp(1rem, 2vw, 1.2rem)', 
                marginBottom: '24px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                transition: 'all 0.3s ease'
              }}>
                Total Collection Size
              </h2>
              <div style={{
                fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
                fontWeight: 'bold',
                color: '#fff',
                textShadow: '0 0 20px rgba(63, 203, 243, 0.3)',
                transition: 'all 0.3s ease'
              }}>
                <CountUp 
                  end={totalArtifacts} 
                  duration={2} 
                  separator="," 
                  enableScrollSpy={true}
                  scrollSpyOnce={true}
                />
              </div>
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.6)', 
                marginTop: '8px',
                fontSize: 'clamp(0.9rem, 1.5vw, 1rem)',
                transition: 'all 0.3s ease'
              }}>
                Artifacts in Database
              </p>
            </div>

            {/* Charts Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 500px), 1fr))', 
              gap: 'clamp(16px, 3vw, 32px)',
              transition: 'all 0.3s ease'
            }}>
              {/* Artifacts by Type Chart */}
              <div className="stats-card" style={{
                background: '#1a1d24',
                borderRadius: '20px',
                padding: 'clamp(24px, 4vw, 32px)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                cursor: 'default'
              }}>
                <h2 style={{ 
                  color: '#3fcbf3', 
                  fontSize: 'clamp(1rem, 2vw, 1.2rem)', 
                  marginBottom: '24px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  transition: 'all 0.3s ease'
                }}>
                  Artifacts by Type
                </h2>
                <div style={{ height: '300px', position: 'relative' }}>
                  <Doughnut 
                    data={typeChartData} 
                    options={{
                      ...chartOptions,
                      cutout: '60%',
                    }}
                  />
                </div>
              </div>

              {/* Artifacts by Period Chart */}
              <div className="stats-card" style={{
                background: '#1a1d24',
                borderRadius: '20px',
                padding: 'clamp(24px, 4vw, 32px)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                cursor: 'default'
              }}>
                <h2 style={{ 
                  color: '#3fcbf3', 
                  fontSize: 'clamp(1rem, 2vw, 1.2rem)', 
                  marginBottom: '24px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  transition: 'all 0.3s ease'
                }}>
                  Artifacts by Period
                </h2>
                <div style={{ height: '300px', position: 'relative' }}>
                  <Bar 
                    data={periodChartData} 
                    options={chartOptions}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
