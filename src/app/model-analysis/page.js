"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { Upload, FileSpreadsheet, TrendingUp, Target, CheckCircle, XCircle, Download, X, Info, FileDown } from "lucide-react";
import axios from "axios";

export default function EvaluateExcel() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  const BASE_URL = "https://pdfreader2-imp3.onrender.com";
  // const BASE_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return alert("Please select an Excel file first!");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setError(null);

      // Simulating API call with new response format for demo
      // setTimeout(() => {
      //   const mockResult = {
      //     overall_metrics: {
      //       overall_average_score: 0.917,
      //       precision: 0.578,
      //       recall: 0.917,
      //       MAP: 0.528,
      //       MRR: 0.611,
      //       NDCG: 0.661
      //     },
      //     details: [
      //       {
      //         query: "What is FastAPI?",
      //         expected: ["1LryeZsINjifN4R3X8vTtnAwONqsXAnz7", "13rl3Fc1QeJRvoPWhXnrHh9hhWEktsC9f"],
      //         predicted: ["1gXod5v2D8OrVFHL9LQJU9NYI_WDM1onL", "13rl3Fc1QeJRvoPWhXnrHh9hhWEktsC9f", "12bvQvTTVZnOg3SuKAi6lIzLR6jL11nAA"],
      //         score_per_id: [1, 1],
      //         average_score: 1,
      //         precision: 0.4,
      //         recall: 1,
      //         average_precision: 0.5,
      //         reciprocal_rank: 0.5,
      //         ndcg: 0.651
      //       },
      //       {
      //         query: "AI कैसे काम करता है?",
      //         expected: ["1gXod5v2D8OrVFHL9LQJU9NYI_WDM1onL"],
      //         predicted: ["1cE1dwhFOD_tSpVgOHnjznwl7FNd0aCF4", "12bvQvTTVZnOg3SuKAi6lIzLR6jL11nAA", "1gXod5v2D8OrVFHL9LQJU9NYI_WDM1onL"],
      //         score_per_id: [1],
      //         average_score: 1,
      //         precision: 0.333,
      //         recall: 1,
      //         average_precision: 0.333,
      //         reciprocal_rank: 0.333,
      //         ndcg: 0.5
      //       },
      //       {
      //         query: "What is Artificial Intelligence?",
      //         expected: ["1tm8shLBaCtWBFhFoVEngsMxUSOHtCZ64", "12bvQvTTVZnOg3SuKAi6lIzLR6jL11nAA"],
      //         predicted: ["12bvQvTTVZnOg3SuKAi6lIzLR6jL11nAA", "1gXod5v2D8OrVFHL9LQJU9NYI_WDM1onL"],
      //         score_per_id: [0, 1],
      //         average_score: 0.75,
      //         precision: 1,
      //         recall: 0.75,
      //         average_precision: 0.75,
      //         reciprocal_rank: 1,
      //         ndcg: 0.832
      //       },
      //       {
      //         query: "Machine Learning basics",
      //         expected: ["1abc123def456ghi789", "1xyz987uvw654"],
      //         predicted: ["1abc123def456ghi789", "1different123", "1xyz987uvw654"],
      //         score_per_id: [1, 1],
      //         average_score: 1,
      //         precision: 0.667,
      //         recall: 1,
      //         average_precision: 0.833,
      //         reciprocal_rank: 1,
      //         ndcg: 0.893
      //       },
      //       {
      //         query: "Deep Learning concepts",
      //         expected: ["1deep456learning789"],
      //         predicted: ["1wrong123", "1deep456learning789"],
      //         score_per_id: [1],
      //         average_score: 1,
      //         precision: 0.5,
      //         recall: 1,
      //         average_precision: 0.5,
      //         reciprocal_rank: 0.5,
      //         ndcg: 0.631
      //       }
      //     ]
      //   };
      //   setResult(mockResult);
      //   setLoading(false);
      // }, 2000);

      // Uncomment for real API call
      const response = await axios.post(
        `${BASE_URL}/evaluate-excel`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setResult(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Something went wrong");
      setLoading(false);
    }
  };

  const downloadSampleFile = () => {
    const sampleData = [
      ['query', 'expected_ids'],
    //   ['What is FastAPI?', '1LryeZsINjifN4R3X8vTtnAwONqsXAnz7,13rl3Fc1QeJRvoPWhXnrHh9hhWEktsC9f'],
    //   ['AI कैसे काम करता है?', '1gXod5v2D8OrVFHL9LQJU9NYI_WDM1onL'],
    //   ['What is Artificial Intelligence?', '1tm8shLBaCtWBFhFoVEngsMxUSOHtCZ64,12bvQvTTVZnOg3SuKAi6lIzLR6jL11nAA'],
    //   ['Machine Learning basics', '1abc123def456ghi789,1xyz987uvw654'],
    //   ['Deep Learning concepts', '1deep456learning789']
    ];

    // Create CSV content
    const csvContent = sampleData.map(row => row.join(',')).join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_excel_evaluation.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (!mounted) return null;

  // Prepare chart data
  const chartData = result?.details?.map((item, idx) => ({
    name: `Q${idx + 1}`,
    fullQuery: item.query,
    score: Math.round(item.average_score * 100),
    precision: Math.round(item.precision * 100),
    recall: Math.round(item.recall * 100),
    ndcg: Math.round(item.ndcg * 100),
    expected: item.expected?.length || 0,
    predicted: item.predicted?.length || 0,
    correct: item.score_per_id?.filter(s => s === 1).length || 0
  })) || [];

  // Radar chart data for overall metrics
  const radarData = result?.overall_metrics ? [
    { metric: 'Overall Score', value: Math.round(result.overall_metrics.overall_average_score * 100) },
    { metric: 'Precision', value: Math.round(result.overall_metrics.precision * 100) },
    { metric: 'Recall', value: Math.round(result.overall_metrics.recall * 100) },
    { metric: 'MAP', value: Math.round(result.overall_metrics.MAP * 100) },
    { metric: 'MRR', value: Math.round(result.overall_metrics.MRR * 100) },
    { metric: 'NDCG', value: Math.round(result.overall_metrics.NDCG * 100) }
  ] : [];

  const scoreDistribution = result?.details?.reduce((acc, item) => {
    const score = Math.round(item.average_score * 100);
    if (score >= 90) acc.excellent++;
    else if (score >= 70) acc.good++;
    else if (score >= 50) acc.fair++;
    else acc.poor++;
    return acc;
  }, { excellent: 0, good: 0, fair: 0, poor: 0 });

  const pieData = scoreDistribution ? [
    { name: 'Excellent (90-100%)', value: scoreDistribution.excellent, color: '#10b981' },
    { name: 'Good (70-89%)', value: scoreDistribution.good, color: '#3b82f6' },
    { name: 'Fair (50-69%)', value: scoreDistribution.fair, color: '#f59e0b' },
    { name: 'Poor (<50%)', value: scoreDistribution.poor, color: '#ef4444' }
  ] : [];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-8 max-w-7xl">

      {/* back button to go back to home page small button */}
        <button
          onClick={() => window.history.back()}
          className="mb-4 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          {/* back arrow */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>

          Back to Home
        </button>

        {/* Header with Sample File Button */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Excel Evaluation Dashboard
            </h1>
            <p className="text-gray-400">Upload and analyze your Excel files with AI-powered evaluation</p>
          </div>
          <button
            onClick={() => setShowGuideModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
          >
            <Download className="h-4 w-4" />
            Sample File
          </button>
        </div>

        {/* Guide Modal */}
        {showGuideModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Sample File Guidelines</h2>
                <button
                  onClick={() => setShowGuideModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-5 w-5 text-blue-400" />
                    <h3 className="font-semibold text-blue-300">Excel Format Requirements</h3>
                  </div>
                  <ul className="text-blue-200 space-y-1 text-sm">
                    <li>• Keep only 5 queries maximum for fast results</li>
                    <li>• First column name: <code className="bg-gray-700 px-1 rounded">query</code></li>
                    <li>• Second column name: <code className="bg-gray-700 px-1 rounded">expected_ids</code></li>
                    <li>• Use comma-separated Google Drive file IDs in expected_ids</li>
                    <li>• Save as .xlsx or .csv format</li>
                  </ul>
                </div>

                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-white">Sample Data Structure:</h4>
                  <div className="bg-gray-900 rounded p-3 font-mono text-sm overflow-x-auto">
                    <div className="grid grid-cols-2 gap-8 text-gray-300">
                      <div>
                        <div className="text-blue-400 font-bold mb-1">query</div>
                        <div>What is FastAPI?</div>
                        <div>AI कैसे काम करता है?</div>
                        <div>What is Artificial Intelligence?</div>
                        <div>Machine Learning basics</div>
                        <div>Deep Learning concepts</div>
                      </div>
                      <div>
                        <div className="text-green-400 font-bold mb-1">expected_ids</div>
                        <div className="text-xs">1LryeZs...,13rl3Fc...</div>
                        <div className="text-xs">1gXod5v...</div>
                        <div className="text-xs">1tm8shL...,12bvQvT...</div>
                        <div className="text-xs">1abc123...,1xyz987...</div>
                        <div className="text-xs">1deep456...</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-yellow-300">Important Notes:</h4>
                  <ul className="text-yellow-200 space-y-1 text-sm">
                    <li>• Google Drive file IDs should be actual valid IDs</li>
                    <li>• Multiple IDs in expected_ids should be comma-separated</li>
                    <li>• Queries can be in any language (English, Hindi, etc.)</li>
                    <li>• Keep queries concise and specific</li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={downloadSampleFile}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl flex-1"
                  >
                    <FileDown className="h-4 w-4" />
                    Download Sample Excel
                  </button>
                  <button
                    onClick={() => setShowGuideModal(false)}
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-500 rounded-lg font-medium transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Section */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors">
                <FileSpreadsheet className="h-5 w-5 text-blue-400" />
                <span className="text-sm">
                  {file ? file.name : "Choose Excel file..."}
                </span>
              </div>
            </div>
            
            <button
              onClick={handleUpload}
              disabled={loading || !file}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                loading || !file
                  ? "bg-gray-600 cursor-not-allowed text-gray-400"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Evaluating...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload & Evaluate
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-900/50 border border-red-700 rounded-lg">
              <XCircle className="h-5 w-5 text-red-400" />
              <p className="text-red-300">{error}</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-8">
            {/* Overall Metrics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 rounded-xl p-4 border border-blue-700/50">
                <div className="flex items-center justify-between mb-1">
                  <Target className="h-6 w-6 text-blue-400" />
                  <span className="text-xl font-bold text-blue-300">
                    {Math.round((result.overall_metrics.overall_average_score || 0) * 100)}%
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white">Overall Score</h3>
              </div>

              <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 rounded-xl p-4 border border-green-700/50">
                <div className="flex items-center justify-between mb-1">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                  <span className="text-xl font-bold text-green-300">
                    {Math.round((result.overall_metrics.precision || 0) * 100)}%
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white">Precision</h3>
              </div>

              <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 rounded-xl p-4 border border-purple-700/50">
                <div className="flex items-center justify-between mb-1">
                  <TrendingUp className="h-6 w-6 text-purple-400" />
                  <span className="text-xl font-bold text-purple-300">
                    {Math.round((result.overall_metrics.recall || 0) * 100)}%
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white">Recall</h3>
              </div>

              <div className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 rounded-xl p-4 border border-yellow-700/50">
                <div className="flex items-center justify-between mb-1">
                  <Target className="h-6 w-6 text-yellow-400" />
                  <span className="text-xl font-bold text-yellow-300">
                    {Math.round((result.overall_metrics.MAP || 0) * 100)}%
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white">MAP</h3>
              </div>

              <div className="bg-gradient-to-br from-cyan-900/50 to-cyan-800/30 rounded-xl p-4 border border-cyan-700/50">
                <div className="flex items-center justify-between mb-1">
                  <TrendingUp className="h-6 w-6 text-cyan-400" />
                  <span className="text-xl font-bold text-cyan-300">
                    {Math.round((result.overall_metrics.MRR || 0) * 100)}%
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white">MRR</h3>
              </div>

              <div className="bg-gradient-to-br from-indigo-900/50 to-indigo-800/30 rounded-xl p-4 border border-indigo-700/50">
                <div className="flex items-center justify-between mb-1">
                  <CheckCircle className="h-6 w-6 text-indigo-400" />
                  <span className="text-xl font-bold text-indigo-300">
                    {Math.round((result.overall_metrics.NDCG || 0) * 100)}%
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white">NDCG</h3>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Radar Chart - Overall Metrics */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-white">Overall Metrics Overview</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#374151" />
                      <PolarAngleAxis dataKey="metric" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                      <PolarRadiusAxis 
                        domain={[0, 100]} 
                        tick={{ fill: '#9ca3af', fontSize: 10 }} 
                        angle={90}
                      />
                      <Radar
                        name="Metrics"
                        dataKey="value"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                        formatter={(value) => [`${value}%`, 'Score']}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bar Chart - Query Performance */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-white">Query Performance Metrics</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="name" 
                        stroke="#9ca3af"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis stroke="#9ca3af" domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                        formatter={(value, name) => [
                          `${value}%`,
                          name === 'score' ? 'Average Score' : 
                          name === 'precision' ? 'Precision' :
                          name === 'recall' ? 'Recall' : 'NDCG'
                        ]}
                        labelFormatter={(label, payload) => 
                          payload?.[0]?.payload?.fullQuery || label
                        }
                      />
                      <Bar dataKey="score" fill="#3b82f6" name="score" />
                      <Bar dataKey="precision" fill="#10b981" name="precision" />
                      <Bar dataKey="recall" fill="#f59e0b" name="recall" />
                      <Bar dataKey="ndcg" fill="#8b5cf6" name="ndcg" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Score Distribution and ID Matching */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Pie Chart - Score Distribution */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-white">Score Distribution</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-2">
                  {pieData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: entry.color }}
                      ></div>
                      <span className="text-sm text-gray-300">{entry.name}: {entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ID Matching Analysis */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-white">ID Matching Analysis</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="name" 
                        stroke="#9ca3af"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                        labelFormatter={(label, payload) => 
                          payload?.[0]?.payload?.fullQuery || label
                        }
                      />
                      <Bar dataKey="expected" fill="#8b5cf6" name="Expected IDs" />
                      <Bar dataKey="predicted" fill="#06b6d4" name="Predicted IDs" />
                      <Bar dataKey="correct" fill="#10b981" name="Correct Matches" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Query Details List */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-700">
                <h3 className="text-xl font-semibold text-white">Detailed Query Analysis</h3>
              </div>
              <div className="divide-y divide-gray-700">
                {result.details.map((item, idx) => (
                  <div key={idx} className="p-6 hover:bg-gray-750 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="font-medium text-white text-lg">{item.query}</h4>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          item.average_score >= 0.9 ? 'bg-green-900/50 text-green-300' :
                          item.average_score >= 0.7 ? 'bg-blue-900/50 text-blue-300' :
                          item.average_score >= 0.5 ? 'bg-yellow-900/50 text-yellow-300' :
                          'bg-red-900/50 text-red-300'
                        }`}>
                          {Math.round(item.average_score * 100)}%
                        </span>
                      </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-4">
                      <div className="bg-gray-700 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">Precision</div>
                        <div className="text-sm font-semibold text-white">{Math.round(item.precision * 100)}%</div>
                      </div>
                      <div className="bg-gray-700 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">Recall</div>
                        <div className="text-sm font-semibold text-white">{Math.round(item.recall * 100)}%</div>
                      </div>
                      <div className="bg-gray-700 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">Avg Precision</div>
                        <div className="text-sm font-semibold text-white">{Math.round(item.average_precision * 100)}%</div>
                      </div>
                      <div className="bg-gray-700 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">Reciprocal Rank</div>
                        <div className="text-sm font-semibold text-white">{Math.round(item.reciprocal_rank * 100)}%</div>
                      </div>
                      <div className="bg-gray-700 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">NDCG</div>
                        <div className="text-sm font-semibold text-white">{Math.round(item.ndcg * 100)}%</div>
                      </div>
                      <div className="bg-gray-700 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">Score</div>
                        <div className="text-sm font-semibold text-white">{Math.round(item.average_score * 100)}%</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Expected IDs:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {item.expected?.map((id, i) => (
                            <span key={i} className="px-2 py-1 bg-purple-900/30 text-purple-300 rounded text-xs">
                              {id.length > 10 ? `${id.substring(0, 10)}...` : id}
                            </span>
                          )) || <span className="text-gray-500">None</span>}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-400">Predicted IDs:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {item.predicted?.map((id, i) => (
                            <span key={i} className="px-2 py-1 bg-cyan-900/30 text-cyan-300 rounded text-xs">
                              {id.length > 10 ? `${id.substring(0, 10)}...` : id}
                            </span>
                          )) || <span className="text-gray-500">None</span>}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-400">Match Scores:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {item.score_per_id?.map((score, i) => (
                            <span key={i} className={`px-2 py-1 rounded text-xs ${
                              score === 1 ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'
                            }`}>
                              {score.toFixed(1)}
                            </span>
                          )) || <span className="text-gray-500">None</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}