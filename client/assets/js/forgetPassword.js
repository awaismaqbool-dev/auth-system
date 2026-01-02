    // send otp funtion for forget password
    const userEmail = document.getElementById("emailInput") ;
async function sendOtp(){
  try {
    const email= userEmail.value;
if (!email) {
    alert("Please enter your email");
    return;
}
      const response = await fetch("/authSystem/forget-pasword",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({email:email}),
        credentials:"include" //for cookies  
      });
      const data = await response.json();
       
      if(data.success){
        alert(data.message);
        localStorage.setItem('resetEmail', email);
        window.location.href = "../pages/otpVerification.html?type=reset-password"
      }else{
        alert(data.message)
      }
      
  } catch (error) {
          console.error("Error sending OTP:", error);
      alert("Server error while sending OTP");
  }
}

document.querySelector('form').addEventListener('submit', (e)=>{
    e.preventDefault();
    sendOtp();
})