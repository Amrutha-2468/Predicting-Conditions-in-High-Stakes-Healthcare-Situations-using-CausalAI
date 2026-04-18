"use client"
import { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto';

export default function HomePage() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Dummy data for demonstration
    const data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June'],
      datasets: [
        {
          label: 'Disease Cases Over Time',
          data: [65, 59, 80, 81, 56, 55],
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
      ],
    };
    setChartData(data);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-200 p-6">

      {/* Hero Section */}
      <div className="text-center mt-16 mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-blue-900 mb-4 animate-fadeIn">Welcome to Cause AI</h1>
        <p className="text-lg md:text-xl text-blue-700">Your intelligent assistant for disease prediction and analysis</p>
      </div>

      {/* Chart Section */}
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-blue-900">Disease Trends (2024)</h2>
        {chartData && <Line data={chartData} options={{ responsive: true, maintainAspectRatio: true }} />}
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-6 mt-10">
        <div className="bg-white p-6 rounded-xl shadow-md hover:scale-105 transition-transform duration-300">
          <h3 className="text-lg font-bold mb-2 text-blue-800">Symptom Analysis</h3>
          <p className="text-gray-600">Advanced AI algorithms analyze symptoms to predict potential diseases.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md hover:scale-105 transition-transform duration-300">
          <h3 className="text-lg font-bold mb-2 text-blue-800">X-Ray Insights</h3>
          <p className="text-gray-600">Upload chest X-rays for Pneumonia and COVID-19 detection.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md hover:scale-105 transition-transform duration-300">
          <h3 className="text-lg font-bold mb-2 text-blue-800">Real-Time Statistics</h3>
          <p className="text-gray-600">Interactive dashboards display real-time disease statistics.</p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-500 transition-all duration-300">
          Get Started
        </button>
      </div>
    </div>
  );
}
