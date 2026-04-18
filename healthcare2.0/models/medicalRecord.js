import mongoose ,{models,Schema,model}from 'mongoose';

// Define schema for individual medical records
const medicalRecordSchema = new Schema({
  userId:{type:String,required:true},
  diseaseNames: {type:[Object]},
  symptoms: [String],
  xraySeverity:String,
  predictionDate: { type: Date, default: Date.now },
});

const medicalRecord = models.Record || model('Record', medicalRecordSchema);

export default medicalRecord;