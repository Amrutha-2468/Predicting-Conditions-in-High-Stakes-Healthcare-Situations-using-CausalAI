import Resend from 'resend';

// Initialize the Resend client with your API key (get it from Resend dashboard)
const resend = new Resend('YOUR_API_KEY'); // Replace with your actual API key

export async function POST(req) {
    const { email, message } = await req.json();

    try {
        // Send the email using Resend
        const emailResponse = await resend.emails.send({
            from: 'no-reply@yourdomain.com', // Replace with your verified sender email
            to: email, // The recipient email
            subject: 'Heart Rate Alert',
            text: message,
        });

        // Return success response if the email is sent successfully
        return new Response(
            JSON.stringify({ success: true, message: 'Email sent successfully' }),
            { status: 200 }
        );
    } catch (error) {
        // Handle any errors that occur while sending the email
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500 }
        );
    }
}
