"use client";
import { useState, useEffect, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { CloudCog } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';

export default function DiagnosePage() {
  const [symptoms, setSymptoms] = useState([]); // Selected symptoms
  const [allSymptoms, setAllSymptoms] = useState([]); // All available symptoms
  const [prediction, setPrediction] = useState(null); // Prediction result
  const [loading, setLoading] = useState(false); // Loading state
  const [xrayA, setXrayA] = useState([]); // xrayA
  const [file, setFile] = useState(null); // X-ray file
  const [rloading,setRloading]=useState(false);
  const {userId}=useAuth();

  // Fetch symptoms from the backend
  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/symptoms', { method: 'GET' });
        if (!response.ok) {
          throw new Error('Failed to fetch symptoms');
        }
        const data = await response.json();
        setAllSymptoms(data);
      } catch (error) {
        console.error('Error fetching symptoms:', error);
        // Fallback to dummy data
        setAllSymptoms([
          'Fever', 'Cough', 'Fatigue', 'Shortness of breath', 'Chest pain',
          'Headache', 'Muscle pain', 'Sore throat', 'Loss of taste or smell',
          'Nausea', 'Vomiting', 'Diarrhea', 'Abdominal pain', 'Runny nose',
          'Sneezing', 'Chills', 'Sweating', 'Dizziness', 'Confusion', 'Rash'
        ]);
      }
    };

    fetchSymptoms();
  }, []);

  ///Save patient disese
  const saveRecord=async()=>{
    setRloading(true);
    const diseaseNames=prediction.map((res)=>({name:res.disease,confidence:res.confidence}))
    const res=await fetch("/api/record",{
      method:"POST",
      body:JSON.stringify({userId,symptoms,diseaseNames,xraySeverity:(100 - xrayA.confidence * 100).toFixed(2)})
    });
    setRloading(false);
  }

  // Handle symptom selection
  const handleSymptomClick = (symptom) => {
    if (symptoms.includes(symptom)) {
      setSymptoms(symptoms.filter((s) => s !== symptom)); // Deselect symptom
    } else {
      setSymptoms([...symptoms, symptom]); // Select symptom
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Submit symptoms for diagnosis
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symptoms }),
      });
      const data = await response.json();
      console.log(data);
      setPrediction(data);

    } catch (error) {
      console.error('Prediction failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle X-ray upload
  const handleFileUpload = async (disease) => {
    // const file = e.target.files[0];
    if (!file) return;

    // setFile(file);
    const formData = new FormData();
    formData.append('xray', file);
    formData.append('disease',disease)

    try {
      const response = await fetch('http://127.0.0.1:5000/upload_xray', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setXrayA(data); // Update prediction with X-ray analysis
      console.log(data);
    } catch (error) {
      console.error('X-ray upload failed:', error);
    }
  };

  // Memoized chart data
  const chartData = useMemo(() => {
    const diseases = [
      'Pneumonia', 'COVID-19', 'Lung Cancer', 'Asthma', 'Tuberculosis', 'Bronchitis', 'COPD', 'Influenza'
    ];
    const years = Array.from({ length: 6 }, (_, i) => 2019 + i);

    return {
      labels: years,
      datasets: diseases.map((disease, index) => ({
        label: disease,
        data: years.map(() => Math.floor(Math.random() * 1000)),
        borderColor: `hsl(${index * 45}, 70%, 50%)`,
        backgroundColor: `hsla(${index * 45}, 70%, 50%, 0.2)`,
        fill: true,
        tension: 0.4,
      })),
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-gray-100 p-6">

      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-xl mt-10">
        <h2 className="text-4xl font-extrabold text-blue-900 mb-6 text-center animate-bounce">Disease Diagnosis</h2>

        {/* Symptom Selection */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">Select Symptoms:</h3>
          <div className="h-48 overflow-y-auto border border-blue-400 rounded-lg p-2">
            <div className="flex flex-wrap gap-2">
              {allSymptoms.map((symptom) => (
                <button
                  key={symptom}
                  onClick={() => handleSymptomClick(symptom)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    symptoms.includes(symptom)
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                  }`}
                >
                  {symptom.replace('_',' ').toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Symptoms */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">Selected Symptoms:</h3>
          <div className="flex flex-wrap gap-2">
            {symptoms.map((symptom) => (
              <span
                key={symptom}
                className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium"
              >
                {symptom.replace('_',' ').toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        {/* Diagnose Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg shadow-lg hover:scale-105 transition duration-300"
          disabled={loading || symptoms.length === 0}
        >
          {loading ? 'Predicting...' : 'Diagnose'}
        </button>
        </div>
          <div className='grid grid-cols-3 gap-x-10 gap-y-5  bg-white p-6 rounded-xl shadow-xl mt-10 mx-4'>
        {/* Prediction Result */}
        {prediction && (prediction.map((res,idx)=>(
          <div className="mt-6 bg-blue-100 p-4 rounded-lg animate-fadeIn" key={idx}>
          <h3 className="text-xl font-semibold text-blue-800 mb-2">Prediction Result:</h3>
          <p className="text-blue-900 font-semibold">{res.disease}</p>
          <p className="text-blue-900 font-semibold ">Probability: {res.confidence.toFixed(2)}%</p>
          <p className="text-blue-900 font-semibold">Precautions:</p>
          <ol>
          {res.precautions.map((pre,idx)=>(<li key={idx} className='text-blue-700 capitalize'>{idx+1}. {pre}</li>))}
          </ol>
          {res.needs_xray && (
           <div className="mt-6 bg-blue-100 p-6 rounded-lg animate-fadeIn">
           <h3 className="text-xl font-semibold text-blue-800 mb-4">Upload X-ray for Further Analysis</h3>
           
           {/* Drag-and-Drop Area */}
           <div
             className={`border-2 border-dashed ${
               file ? 'border-green-500 bg-green-50' : 'border-blue-400 bg-blue-50'
             } rounded-lg p-6 text-center transition-all duration-300`}
             onDragOver={(e) => {
               e.preventDefault();
               e.currentTarget.classList.add('border-blue-600', 'bg-blue-100');
             }}
             onDragLeave={(e) => {
               e.preventDefault();
               e.currentTarget.classList.remove('border-blue-600', 'bg-blue-100');
             }}
             onDrop={(e) => {
               e.preventDefault();
               const droppedFile = e.dataTransfer.files[0];
               if (droppedFile && droppedFile.type.startsWith('image/')) {
                 setFile(droppedFile);
               }
             }}
           >
             {file ? (
               // File Preview
               <div className="flex flex-col items-center space-y-4">
                 <img
                   src={URL.createObjectURL(file)}
                   alt="X-ray Preview"
                   className="max-w-full h-48 object-contain rounded-lg shadow-md"
                 />
                 <p className="text-green-700 font-medium">{file.name}</p>
                 <button
                   onClick={() => {setFile(null);
                    setXrayA(null)
                   }}
                   className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                 >
                   Remove File
                 </button>
               </div>
             ) : (
               // Upload Prompt
               <div>
                 <label
                   htmlFor="xray-upload"
                   className="cursor-pointer flex flex-col items-center space-y-2"
                 >
                   <svg
                     xmlns="http://www.w3.org/2000/svg"
                     className="h-12 w-12 text-blue-600"
                     fill="none"
                     viewBox="0 0 24 24"
                     stroke="currentColor"
                   >
                     <path
                       strokeLinecap="round"
                       strokeLinejoin="round"
                       strokeWidth={2}
                       d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                     />
                   </svg>
                   <p className="text-blue-700">
                     Drag and drop an X-ray image or{' '}
                     <span className="text-blue-600 font-semibold underline">click to upload</span>.
                   </p>
                   <p className="text-sm text-gray-500">Supports JPG, JPEG, PNG (max. 5MB)</p>
                 </label>
                 <input
                   id="xray-upload"
                   type="file"
                   accept="image/*"
                   onChange={(e) => setFile(e.target.files[0])}
                   className="hidden"
                 />
               </div>
             )}
           </div>
         
           {/* Upload Button */}
           {file && (<>
             <button
               onClick={()=>handleFileUpload(res.disease)}
               className="w-full mt-4 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg shadow-lg hover:scale-105 transition duration-300"
               disabled={!file}
             >
               Analyze X-ray
             </button>
             {xrayA &&
             <p className='text-blue-800 font-semibold tracking-normal m-2'>Severity :{(100 - xrayA.confidence * 100).toFixed(2)}%</p>
             }</>
           )}
         </div>
          )}
        </div>
        ))
          
        )}
        
        </div>
       { prediction && <div className='flex items-center justify-center'>
        <button
          onClick={saveRecord}
          className="w-32 mt-10 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg shadow-lg hover:scale-105 transition duration-300"
          disabled={rloading}
        >
          {rloading ? 'Saving...' : 'Save'}
        </button>
        </div>}
        
      {/* Patient History */}
      {/* <div className="max-w-5xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold text-blue-900 mb-4 text-center">Patient History</h2>
        <div className="space-y-4">
          {history.map((entry, index) => (
            <div key={index} className="bg-blue-100 p-4 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-800">{entry.disease}</h3>
              <p className="text-blue-700">Confidence: {entry.confidence}%</p>
              <p className="text-blue-700">Date: {new Date(entry.timestamp).toLocaleString()}</p>
              {entry.image_url && (
                <img src={entry.image_url} alt="X-ray" className="mt-2 max-w-full h-auto rounded-lg" />
              )}
            </div>
          ))}
        </div>
      </div> */}

      {/* Disease Trends Chart */}
      <div className="max-w-5xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold text-blue-900 mb-4 text-center">Disease Trends (Last 6 Years)</h2>
        <Line data={chartData} options={{ responsive: true, maintainAspectRatio: true }} style={{ height: '400px' }} />
      </div>
    </div>
  );
}