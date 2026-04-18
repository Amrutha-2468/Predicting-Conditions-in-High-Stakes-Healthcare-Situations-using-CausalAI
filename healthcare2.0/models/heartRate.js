import mongoose ,{models,Schema,model}from 'mongoose';

// Define schema for individual medical records
const heartRateSchema = new Schema({
  userId:{type:String,required:true},
  heartrate: {type:Number},
  email:{type:String,required:true}
});

const HeartrateRecord = models.Heartrate || model('Heartrate', heartRateSchema);

export default HeartrateRecord;