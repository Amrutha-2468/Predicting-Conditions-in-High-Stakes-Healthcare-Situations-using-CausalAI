// Create an array of heart rate values (for example purposes, random values between 60 and 100)
// const heartRateArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 41) + 60);
const heartRateArray=[70,60,47,90,92,70]

// Function to send the heart rate array via PATCH request
async function sendHeartRate(userId, heartrate) {
  const url = `http://localhost:3000/api/heartrate/${userId}/`;

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      body: JSON.stringify({ heartrate }),
    });

    if (response.ok) {
      console.log('Heart rate data sent successfully');
    } else {
      console.log('Error sending heart rate data', response.status);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Send heart rate data every 30 seconds
const userId = '123'; // Replace with the actual userId
let index = 0;

const interval = setInterval(() => {
  sendHeartRate('user_2su4lyrQiQiMiQejoM9vxgdCFiG', heartRateArray[index]);

  index += 1;
  if (index >= heartRateArray.length) {
    clearInterval(interval); // Stop after 10 intervals
  }
}, 30000); // 30 seconds interval
