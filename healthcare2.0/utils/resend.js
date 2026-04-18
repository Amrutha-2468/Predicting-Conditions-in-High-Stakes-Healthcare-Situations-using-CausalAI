"use server"
import { Resend } from 'resend';



const validate=(val,maxL)=>{
    if(val.length>3 && val.length<maxL) return true
    return false
}
const ResendMail = async(name,email,subject,message) => {
    const resendApiKey = process.env.RESEND_API_KEY

if (!resendApiKey) {
  throw new Error("Missing RESEND_API_KEY in environment variables");
}

const resend = new Resend(resendApiKey);
console.log(name,email,subject)
    const check=!validate(name,500) || !validate(email,500) || !validate(subject,500) 
    if(check){
        return {success:false,message:"Enter valid credentials"}
    }
    if(!validate(message,5000)){
        return {success:false,message:"Message length should be in range(3-5000)"}
    }
    try {
        
   const mail=await resend.emails.send({
      from: 'HeartRate <onboarding@resend.dev>',
      to: [email],
      name:name,
      subject: `HEART RATE CAUTION OF ${name}`,
    //   text:message,
      html:`<div><h1><strong>${subject}</strong></h1><h4>${message}</h4></div>`
    });
   
    return {success:true,message:"Sucessfully sent to Vinay"}
} catch (error) {
        return {success:false,message:"Internal server error"}
}
}

export default ResendMail