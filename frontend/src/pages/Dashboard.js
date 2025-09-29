import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
  Upload, 
  BarChart3, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  Activity,
  Leaf
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [activityTimeline, setActivityTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDetections: 0,
    healthyPlants: 0,
    diseasesFound: 0
  });
  const [lastDisease, setLastDisease] = useState(null);

  const getTreatmentAdvice = (disease) => {
    const treatments = {
      'Early Blight': 'Apply copper-based fungicide every 7-10 days. Remove infected leaves.',
      'Late Blight': 'Use systemic fungicides. Ensure proper air circulation.',
      'Powdery Mildew': 'Apply sulfur-based fungicide. Increase plant spacing.',
      'Black_rot': 'Apply fungicides and remove infected berries. Maintain good air circulation.',
      'Esca': 'Prune affected areas and apply fungicides. Improve vineyard management.',
      'Leaf_blight': 'Remove infected leaves and apply appropriate fungicides.',
      'Healthy': 'Continue regular monitoring and maintain good practices.',
      'Bacterial Spot': 'Use copper-based bactericides. Avoid overhead watering.',
      'Septoria Leaf Spot': 'Apply fungicides containing chlorothalonil or mancozeb.',
      'Anthracnose': 'Use fungicides with active ingredients like azoxystrobin.',
      'default': 'Consult with a local agricultural expert for specific treatment.'
    };
    return treatments[disease] || treatments.default;
  };

  const fetchHistory = useCallback(async () => {
    try {
      console.log('Fetching history...');
      console.log('Current user:', user);
      const response = await axios.get('/api/history/');
      console.log('History response:', response.data);
      
      const data = response.data.history;
      setHistory(data);
      
      // Set activity timeline if available
      if (response.data.activity_timeline) {
        setActivityTimeline(response.data.activity_timeline);
      }
      
      // Use statistics from backend
      if (response.data.statistics) {
        setStats({
          totalDetections: response.data.statistics.total_scans,
          healthyPlants: response.data.statistics.healthy_plants,
          diseasesFound: response.data.statistics.diseased_plants
        });
      } else {
        // Fallback to calculated statistics
        const total = data.length;
        const healthy = data.filter(item => 
          item.disease && item.disease.toLowerCase().includes('healthy')
        ).length;
        const diseases = total - healthy;
        
        setStats({
          totalDetections: total,
          healthyPlants: healthy,
          diseasesFound: diseases
        });
      }

      // Set last disease for treatment advice
      if (data.length > 0) {
        const lastDetection = data[0]; // Most recent detection
        setLastDisease({
          disease: lastDetection.disease || 'Unknown',
          crop: lastDetection.crop || 'Unknown Crop',
          confidence: lastDetection.confidence || 0,
          date: lastDetection.timestamp,
          treatment: getTreatmentAdvice(lastDetection.disease)
        });
      }
    } catch (error) {
      console.error('Error fetching history:', error.response?.status, error.response?.data);
      console.error('Error message:', error.message);
      console.error('Error config:', error.config);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
    
    // Listen for refresh trigger from detection page
    const handleStorageChange = () => {
      const refreshTrigger = localStorage.getItem('dashboardRefresh');
      if (refreshTrigger) {
        fetchHistory();
        localStorage.removeItem('dashboardRefresh');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check on focus (when user returns from detection page)
    const handleFocus = () => {
      fetchHistory();
    };
    
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchHistory]);

  const StatCard = ({ icon: Icon, title, value, color, delay, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`card p-6 text-center ${color} hover:shadow-lg transition-shadow`}
    >
      <div className="flex justify-center mb-4">
        <div className={`p-3 rounded-full ${color === 'bg-green-50' ? 'bg-green-100' : color === 'bg-blue-50' ? 'bg-blue-100' : 'bg-orange-100'}`}>
          <Icon className={`h-8 w-8 ${color === 'bg-green-50' ? 'text-green-600' : color === 'bg-blue-50' ? 'text-blue-600' : 'text-orange-600'}`} />
        </div>
      </div>
      <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
      <p className="text-gray-600 font-medium">{title}</p>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </motion.div>
  );

  const RecentDetectionCard = ({ item, index }) => {
    const isHealthy = item.disease && item.disease.toLowerCase().includes('healthy');
    const confidencePercent = item.confidence ? (item.confidence * 100).toFixed(1) : '0.0';
    
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`card p-4 border-l-4 ${
          isHealthy ? 'border-green-500 bg-green-50' : 'border-orange-500 bg-orange-50'
        } hover:shadow-md transition-shadow`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isHealthy ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : (
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            )}
            <div>
              <h4 className="font-semibold text-gray-900">{item.disease}</h4>
              <p className="text-sm text-gray-600">{item.crop || 'Unknown Crop'}</p>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{item.created_at}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-lg font-bold ${
              isHealthy ? 'text-green-600' : 'text-orange-600'
            }`}>
              {confidencePercent}%
            </div>
            <div className="text-xs text-gray-500">Confidence</div>
          </div>
        </div>
      </motion.div>
    );
  };

  const ActivityTimeline = () => {
    // Use activity timeline from backend if available, otherwise use history
    const activities = activityTimeline.length > 0 ? activityTimeline : history.slice(0, 5);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card p-6"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <Clock className="h-5 w-5 text-primary-600" />
          <span>Activity Timeline</span>
        </h3>
        <div className="space-y-3">
          {activities.map((item, index) => {
            const isHealthy = item.disease && item.disease.toLowerCase().includes('healthy');
            const isDetection = item.type === 'detection';
            return (
              <div key={item.id || index} className="flex items-center space-x-3">
                {isDetection ? (
                  isHealthy ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                  )
                ) : (
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {isDetection 
                      ? `${item.crop || 'Unknown Crop'} - ${item.disease}`
                      : item.description
                    }
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
                {isDetection && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isHealthy ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {(item.confidence * 100).toFixed(0)}%
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  };

  const LastDiseaseSuggestion = () => {
    if (!lastDisease) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <Leaf className="h-5 w-5 text-blue-600" />
          <span>Last Disease Suggestion</span>
        </h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">Last detected:</p>
            <p className="font-semibold text-gray-900">
              {lastDisease.disease} on {lastDisease.crop}
            </p>
            <p className="text-sm text-gray-500">{(lastDisease.confidence * 100).toFixed(1)}% confidence</p>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-900 mb-1">Treatment Advice:</p>
            <p className="text-sm text-gray-700">{lastDisease.treatment}</p>
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome back, {user?.first_name || user?.email}! 👋
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Monitor your crop health and disease detection history
          </p>
          <Link
            to="/detect"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Upload className="h-5 w-5" />
            <span>Detect Disease Now</span>
          </Link>
        </motion.div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={BarChart3}
            title="Total Scans"
            value={stats.totalDetections}
            color="bg-blue-50"
            delay={0.1}
            subtitle="All time detections"
          />
          <StatCard
            icon={AlertTriangle}
            title="Diseased Plants"
            value={stats.diseasesFound}
            color="bg-orange-50"
            delay={0.2}
            subtitle="Plants with issues"
          />
          <StatCard
            icon={CheckCircle}
            title="Healthy Plants"
            value={stats.healthyPlants}
            color="bg-green-50"
            delay={0.3}
            subtitle="Disease-free crops"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Detections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <Activity className="h-6 w-6 text-primary-600" />
                <span>Recent Detections</span>
              </h2>
              <div className="text-sm text-gray-500">
                {history.length} detection{history.length !== 1 ? 's' : ''}
              </div>
            </div>

            {history.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-20 blur-xl"></div>
                  <div className="relative bg-white rounded-full p-6 inline-block shadow-lg">
                    <Upload className="h-20 w-20 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No detections yet</h3>
                <p className="text-gray-600 mb-8 text-lg">Start by detecting diseases in your crops to monitor their health</p>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-lg opacity-30"></div>
                  <Link 
                    to="/detect" 
                    className="relative inline-flex items-center space-x-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <Upload className="h-6 w-6" />
                    <span>Detect Disease</span>
                  </Link>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {history.slice(0, 5).map((item, index) => (
                  <RecentDetectionCard key={item.id} item={item} index={index} />
                ))}
                {history.length > 5 && (
                  <div className="text-center pt-4">
                    <button className="text-primary-600 hover:text-primary-700 font-medium">
                      View all {history.length} detections
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Activity Timeline */}
            <ActivityTimeline />
            
            {/* Last Disease Suggestion */}
            <LastDiseaseSuggestion />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 