// Import necessary modules
import connectToDB from '@/utils/connectToDB';
import medicalRecord from '@/models/medicalRecord';


export async function GET(req, { params }) {
    const { userId } =await  params;
    try {
      await connectToDB();
      const records = await medicalRecord.find({ userId });
      return new Response(JSON.stringify(records), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }