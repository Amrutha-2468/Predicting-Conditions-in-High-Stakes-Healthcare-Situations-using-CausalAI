"use client"
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Calendar, Activity, Heart, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';

const MedicalHistory = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const {userId}=useAuth();

  // Fetch medical records
  useEffect(() => {
    //   setRecords(dummyData);
      setLoading(false);
    const fetchRecords = async () => {
      try {
        const response = await fetch(`/api/user/${userId}`);
        const data=await response.json();
        setRecords(data);
      } catch (error) {
        console.error('Error fetching records:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [userId]);

  // Delete record
  const handleDelete = async (id) => {
    try {
      await fetch('/api/record/',{method:"DELETE",body:JSON.stringify({recordId:id,userId})});
      setRecords(records.filter(record => record._id !== id));
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  // Dummy data for testing
  const dummyData = [
    {
      _id: '1',
      symptoms: ['Fever', 'Cough', 'Fatigue'],
      diseaseNames: [
        { name: 'COVID-19', confidence: 95 },
        { name: 'Flu', confidence: 80 }
      ],
      xraySeverity: 'Moderate',
      predictionDate: '2024-02-15'
    },
    {
      _id: '2',
      symptoms: ['Chest Pain', 'Shortness of Breath'],
      diseaseNames: [
        { name: 'Pneumonia', confidence: 90 },
        { name: 'Asthma', confidence: 70 }
      ],
      xraySeverity: 'Severe',
      predictionDate: '2024-02-10'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (userId &&
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-gray-100 p-6">

      <h1 className="text-4xl font-extrabold text-white text-center mb-8 drop-shadow-lg">Medical History</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {records.map(record => (
          <motion.div
            key={record._id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-2 right-2">
              <button
                onClick={() => handleDelete(record._id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={24} />
              </button>
            </div>

            <div className="mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2 text-blue-700">
                <Activity size={20} /> Symptoms
              </h2>
              <p className="text-gray-700">{record.symptoms.join(', ')}</p>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-green-700">
                <ShieldCheck size={20} /> Predicted Diseases
              </h3>
              {record.diseaseNames.map((disease, index) => (
                <div key={index} className="flex justify-between text-gray-800">
                  <span>{disease.name}</span>
                  <span className="font-bold">{disease.confidence.toFixed(2)}%</span>
                </div>
              ))}
            </div>

            {record.xraySeverity && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-red-700">
                  <Heart size={20} /> X-ray Severity
                </h3>
                <p className="text-gray-800 font-medium">{record.xraySeverity=="NaN"?"No xray Analysis":record.xraySeverity}</p>
              </div>
            )}

            <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
              <Calendar size={18} />
              {new Date(record.predictionDate).toLocaleDateString()}
            </div>
          </motion.div>
        ))}
      </div>

      {records.length === 0 && (
        <div className="text-center mt-10">
          <AlertCircle size={40} className="text-yellow-400 mx-auto" />
          <p className="text-white mt-4 text-lg">No medical history available.</p>
        </div>
      )}
    </div>
  );
};

export default MedicalHistory;
