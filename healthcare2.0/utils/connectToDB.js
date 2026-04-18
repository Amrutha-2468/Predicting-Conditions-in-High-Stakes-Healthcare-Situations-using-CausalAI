import mongoose from "mongoose"



const connectToDB=async()=>{
    if(mongoose.connection.readyState===1){
        return mongoose.connection.asPromise();
    }
    else{
        const url=process.env.MONGODB_URI;
        console.log("Connected")
        return mongoose.connect(url);
        }

}

export default connectToDB;