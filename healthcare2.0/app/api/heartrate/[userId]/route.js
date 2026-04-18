import connectToDB from '@/utils/connectToDB';
import HeartrateRecord from '@/models/heartRate';


export async function POST(req, { params }) {
    // Destructure userId from the params
    const { userId } =await params;
    console.log("HI")
    try {
        const {email}=await req.json();
        await connectToDB();
        const newRecord = new HeartrateRecord({ userId, email, heartrate:0 });
        await newRecord.save();
        return new Response(JSON.stringify({ message: 'Record added successfully' }), { status: 201 });
      } catch (error) {
        console.log("error :"+error)
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
      }
}




export async function PATCH(req, { params }) {
    const { userId } =await params;

    try {
        // Connect to the database
        await connectToDB();

        // Parse the incoming request body
        const { heartrate, email } = await req.json();

        // Find the record by userId and update the fields
        const updatedRecord = await HeartrateRecord.findOneAndUpdate(
            { userId }, // Find the record by userId
            {
                $set: {
                    heartrate: heartrate !== undefined ? heartrate : 0, // Only update if a heartrate value is provided
                    email: email || undefined, // Update email if provided
                },
            },
            { new: true } // Return the updated document
        );

        // If the record is not found, return a 404 error
        if (!updatedRecord) {
            return new Response(JSON.stringify({ error: 'Record not found' }), { status: 404 });
        }

        // Return the updated record
        return new Response(JSON.stringify(updatedRecord), { status: 200 });

    } catch (error) {
        // If an error occurs, return an error message
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}


export async function GET(req, { params }) {
    const { userId } =await  params;
    try {
      await connectToDB();
      const records = await HeartrateRecord.find({ userId });
      return new Response(JSON.stringify(records), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }