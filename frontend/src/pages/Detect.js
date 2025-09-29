import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { 
  Upload, 
  X, 
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Download,
  Loader
} from 'lucide-react';

const Detect = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Dropzone for file upload
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCapturedImage(reader.result);
        setResult(null);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp']
    },
    multiple: false
  });

  const resetDetection = () => {
    setCapturedImage(null);
    setResult(null);
    setError('');
  };

  const analyzeImage = async () => {
    if (!capturedImage) return;

    setIsAnalyzing(true);
    setError('');

    try {
      const response = await axios.post('/api/detect/', {
        image: capturedImage
      });

      console.log('API Response:', response.data); // Debug log

      setResult({
        disease: response.data.detection.disease,
        confidence: response.data.detection.confidence,
        detectionId: response.data.detection.id
      });
      
      // Trigger dashboard refresh
      localStorage.setItem('dashboardRefresh', Date.now().toString());
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Detection Error:', error); // Debug log
      setError(error.response?.data?.error || 'Failed to analyze image');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadImage = () => {
    if (capturedImage) {
      const link = document.createElement('a');
      link.href = capturedImage;
      link.download = 'crop-detection.jpg';
      link.click();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Disease Detection
        </h1>
        <p className="text-xl text-gray-600">
          Upload an image of your crop to detect diseases
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Methods */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Image</h2>
            
            <div className="space-y-4">
              {/* File Upload Option */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="card p-6 cursor-pointer hover:bg-gray-50 transition-all duration-300"
                {...getRootProps()}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Upload className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Upload Image</h3>
                    <p className="text-gray-600">Upload an image from your device to detect diseases</p>
                  </div>
                </div>
                <input {...getInputProps()} />
              </motion.div>
            </div>

            {/* Dropzone */}
            {isDragActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-8 border-2 border-dashed border-primary-300 bg-primary-50 rounded-xl text-center"
              >
                <Upload className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <p className="text-primary-700 font-medium">Drop your image here</p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Preview Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Preview</h2>
            
            <AnimatePresence mode="wait">
              {capturedImage ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <img
                      src={capturedImage}
                      alt="Captured crop"
                      className="w-full h-64 object-cover rounded-xl"
                    />
                    <button
                      onClick={resetDetection}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={analyzeImage}
                      disabled={isAnalyzing}
                      className="btn-primary flex items-center space-x-2"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader className="h-5 w-5 animate-spin" />
                          <span>Analyzing...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5" />
                          <span>Analyze Image</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={downloadImage}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <Download className="h-5 w-5" />
                      <span>Download</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Upload an image to get started</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-red-100 border border-red-200 rounded-xl flex items-center space-x-2"
              >
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="text-red-700 font-medium">{error}</span>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Results Section */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Analysis Results</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Disease Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Detection Result</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    {result.disease && result.disease.toLowerCase().includes('healthy') ? (
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-8 w-8 text-orange-600" />
                    )}
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">{result.disease || 'Unknown'}</h4>
                      <p className="text-gray-600">
                        {result.disease && result.disease.toLowerCase().includes('healthy')
                          ? 'Your crop appears to be healthy!' 
                          : 'Disease detected in your crop.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confidence */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Confidence Level</h3>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-2">
                      {result.confidence ? (result.confidence * 100).toFixed(1) : '0.0'}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.confidence ? result.confidence * 100 : 0}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-3 rounded-full ${
                          result.disease && result.disease.toLowerCase().includes('healthy') ? 'bg-green-500' : 'bg-orange-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-center space-x-4">
              <button
                onClick={resetDetection}
                className="btn-secondary flex items-center space-x-2"
              >
                <RotateCcw className="h-5 w-5" />
                <span>Detect Another Image</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Detect; 