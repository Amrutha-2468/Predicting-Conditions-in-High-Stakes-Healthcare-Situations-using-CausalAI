// Import necessary modules
import connectToDB from '@/utils/connectToDB';
import medicalRecord from '@/models/medicalRecord';

// Route 1: POST - Add a Medical Record
export async function POST(req) {
  try {
    const { userId, diseaseNames, symptoms ,xraySeverity} = await req.json();
    await connectToDB();
    console.log("HI"+userId);
    const newRecord = new medicalRecord({ userId, diseaseNames, symptoms,xraySeverity });
    await newRecord.save();
    return new Response(JSON.stringify({ message: 'Record added successfully' }), { status: 201 });
  } catch (error) {
    console.log("error :"+error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// Route 2: DELETE - Delete a Medical Record
export async function DELETE(req) {
  try {
    const { userId, recordId } = await req.json();
    await connectToDB();
    const deletedRecord = await medicalRecord.findOneAndDelete({ _id: recordId, userId });
    if (!deletedRecord) {
      return new Response(JSON.stringify({ message: 'Record not found' }), { status: 404 });
    }
    return new Response(JSON.stringify({ message: 'Record deleted successfully' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
