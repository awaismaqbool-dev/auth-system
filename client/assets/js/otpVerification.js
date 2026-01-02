// otp input aout fill funtion 
 const inputs = document.querySelectorAll(".otpInput");


 inputs.forEach((input, index)=>{
  
  // typing move to next input
input.addEventListener("input", (e)=>{
  if (e.target.value.length===1 &&  index<inputs.length-1) {
    inputs[index+1].focus();
  }
});
// backspace move to previous input
input.addEventListener("keydown", (e)=>{
  if (e.key==="Backsapace" && !input.value && index>0) {
    inputs[index-1].focus();
  }
});
// paste full OTP
    input.addEventListener("paste", (e) => {
      e.preventDefault();
      const pasteData = e.clipboardData.getData("text").slice(0, inputs.length);

      pasteData.split("").forEach((char, i) => {
        if (inputs[i]) {
          inputs[i].value = char;
        }
      });

      inputs[pasteData.length - 1]?.focus();
    });
 });

// URL getting
function getVerificationType(){
  const params= new URLSearchParams(window.location.search);
  return params.get('type');    
}
// funtion for verify Email by otp 
async function verifyEmail(otp){
try {
const response = await fetch("/authSystem/verify-email",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({otp:otp}),
        credentials:"include" //for cookies  
      });
      const data = await response.json();
       
      if(data.success){
        alert(data.message);
  window.location.href = "../pages/dashBoard.html";
      }else{
        alert(data.message)
      }
}  catch (error) {
          console.error("Error verifying OTP:", error);
      alert("Server error while verifying OTP");
  }
}

// funtion for verify otp for forget password 
async function forgetPassword(otp){
try {
  const email= localStorage.getItem('resetEmail')
  if (!email) {
    alert("Email not Found");
  return;
  }
const response = await fetch("/authSystem/verify-otp",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({otp:otp, email:email}),
        credentials:"include" //for cookies  
      });
      const data = await response.json();
       
      if(data.success){
        alert(data.message);
  window.location.href = "../pages/typeNewPassword.html";
      }else{
        alert(data.message)
      }
}  catch (error) {
          console.error("Error verifying OTP:", error);
      alert("Server error while verifying OTP");
  }
}
//----- funtion for send again otp --------------
async function resendOtp() {
try {
    const verificationType= getVerificationType();
  let endpoint="";
  let body={};

// forget password otp resend
    if (verificationType=== "reset-password") {
      endpoint = "/authSystem/forget-pasword";
      const email= localStorage.getItem('resetEmail');
      body={email:email};
    }
      // verify email 
    else if (verificationType=== "verify-email") {
      endpoint="/authSystem/send-otp";
    }
        if (!endpoint) {
      alert("Invalid verification type");
      return;
    }
    const response=await fetch(endpoint, {
          method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include"
    });
    const data = await response.json();
    
    if(data.success) {
      alert("OTP send again on you Email");
    } else {
      alert(data.message);
    }
} catch (error) {
      console.error("Error:", error);
    alert("Server error");
} 
}

// main funtion for verifying otp
async function verifyOtp(){
  
  try {
    const otp1= document.getElementById("otpInput1").value;
    const otp2= document.getElementById("otpInput2").value;
    const otp3= document.getElementById("otpInput3").value;
    const otp4= document.getElementById("otpInput4").value;

    const otp= otp1+otp2+otp3+otp4;
    if (otp.length !==4) {
        alert("Please enter a valid 4-digit OTP");
        return;
    }
    const verificationType= getVerificationType();
    console.log("Type:", verificationType);

    if (verificationType=== "reset-password") {
      await forgetPassword(otp);
    }
    else if (verificationType=== "verify-email") {
      await verifyEmail(otp)
    }
    else{
      alert("Wrong Request");
      return;
    }

}  catch (error) {
          console.error("Error verifying OTP:", error);
      alert("Server error while verifying OTP");
  }

}