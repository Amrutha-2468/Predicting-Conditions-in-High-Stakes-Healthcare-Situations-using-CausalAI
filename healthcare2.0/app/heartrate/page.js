'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import ResendMail from '@/utils/resend';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend);

const HeartRateTracking = () => {
    const [heartRate, setHeartRate] = useState(70);
    const [userInfo, setUserInfo] = useState({});
    const [alertEmail, setAlertEmail] = useState('');
    const [alertSent, setAlertSent] = useState(false);
    const [predictionData, setPredictionData] = useState([]);
    const [heartRateData,setHeartRateData]=useState([80,70,90]);
    const { userId } = useAuth();
    const { user } = useUser();
   
    const userPhoto = user?.imageUrl || '/default-avatar.png';

    // Fetch user info and predictions
    useEffect(() => {
        fetch(`/api/user/${userId}`)
            .then((res) => res.json())
            .then((data) => {
                setUserInfo(data);
                fetchPredictionData();
            })
            .catch(() => console.error("Failed to fetch user info"));
    }, [userId]);

    // Fetch prediction data for the last 6 months
    const fetchPredictionData = () => {
        fetch(`/api/user/${userId}`)
            .then((res) => res.json())
            .then((data) => setPredictionData(data))
            .catch(() => console.error("Failed to fetch prediction data"));
    };

    // Fetch heart rate every 30 seconds
    useEffect(() => {
        
        fetchHeartRate();
        const interval = setInterval(fetchHeartRate, 30000);
        return () => clearInterval(interval);
    }, [userId]);


    const fetchHeartRate =async () => {
        try{
            const res=await fetch(`/api/heartrate/${userId}`)
            const data=await res.json();
            setHeartRate(data[0].heartrate || 0);
            setAlertEmail(data[0].email);
            setHeartRateData([...heartRateData,data[0].heartrate])
            const rate=data[0].heartrate
            const email=data[0].email
            console.log(rate+"-->"+email);
            if(!alertSent)
                if(rate<50 || rate>120)
                   await sendAlertEmail(rate,email);
        }catch(error){
            setHeartRate(0);
        }
            
            
    }
    // Check for abnormal heart rate and trigger alert
    const checkHeartRate = (rate,email) => {
        console.log(rate+"->"+email)
        if ((rate < 50 || rate > 120) && email.length>0) {
            sendAlertEmail();
            console.log("Yeah")
        }
    };


    //save email
    const saveEmail=async()=>{
        if(alertEmail.length>4){
            const res=await fetch(`/api/heartrate/${userId}`,{method:"POST",body:JSON.stringify({email:alertEmail})})
    }
    }


    // Send alert email
    const sendAlertEmail = async(rate,email) => {
            //     if(email>4){
            //         const res=await fetch(`/api/heartrate/${userId}`,{method:"PATCH",body:JSON.stringify({email:email})})
            // }
            if(alertSent){
                return;
            }
                const message= `Heart rate alert: ${rate} bpm. Immediate attention required.`
                ResendMail(user.firstName,email,`Heart rate of ${user.firstName}`,message);
                setAlertSent(true);
        
    };

    // Prepare prediction chart data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const predictionsCount = months.map((month) => {
        const monthData = predictionData.filter((record) => {
            const recordMonth = new Date(record.predictionDate).getMonth();
            return months.indexOf(month) === recordMonth;
        });
        return monthData.length;
    });

    const predictionChartData = {
        labels: months,
        datasets: [
            {
                label: 'Predictions Last 6 Months',
                data: predictionsCount,
                backgroundColor: 'rgba(54, 162, 235, 0.6)'
            }
        ]
    };

    const heartRateChartData = {
        labels: Array.from({ length: 30 }, (_, i) => i + 1),
        datasets: [
            {
                label: 'Heart Rate (bpm)',
                // data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 40) + 60),
                data:heartRateData,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
                tension: 0.4
            }
        ]
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-200 to-blue-300 p-6 flex flex-col items-center gap-6 pt-10">
            <div className="w-full  shadow-xl p-6 bg-white rounded-2xl space-y-6 pt-10">
                <div className="flex items-center space-x-6">
                    <img src={userPhoto} alt="Profile" className="w-20 h-20 rounded-full border-4 border-blue-500" />
                    <div>
                        <h4 className="text-3xl font-extrabold text-gray-800">{user?.firstName}</h4>
                        <h6 className="text-xl font-extrabold text-gray-800">{user?.emailAddresses[0].emailAddress}</h6>
                        <p className="text-lg text-gray-500">Heart rate End Point : domain.com/api/heartrate/{userId} send heart rate via patch request</p>
                        <p className="text-lg text-gray-500">Total Predictions: {userInfo.length}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gradient-to-r from-pink-200 to-purple-300 p-4 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-2 text-gray-600">Heart Rate Monitoring</h2>
                        <div className="text-5xl font-extrabold text-red-600 animate-pulse">{heartRate} bpm</div>
                        <Line data={heartRateChartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                    </div>

                    <div className="bg-gradient-to-r from-green-200 to-yellow-300 p-4 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-2 text-gray-600">Predictions Analysis</h2>
                        <Bar data={predictionChartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                    </div>
                </div>

                <div className="flex flex-col items-center space-y-4 text-gray-800">
                    <input
                        type="email"
                        placeholder="Enter family member's email"
                        value={alertEmail}
                        onChange={(e) => setAlertEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={() => sendAlertEmail(heartRate,alertEmail)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-transform transform hover:scale-105"
                    >
                        Resend Email Alert
                    </button>
                    <button
                        onClick={saveEmail}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-transform transform hover:scale-105"
                    >
                       Save
                    </button>
                </div>
            </div>
        </div>
        
    );
};

export default HeartRateTracking;