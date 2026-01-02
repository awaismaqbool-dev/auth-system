// slider funtion for responsive layout 
function toggleMenu() {
    const slider = document.getElementById('mySlider');
    // 'active' class ko toggle karega (add/remove)
    slider.classList.toggle('active');
}
// load Dashbaord funtion
async function loadDashboard() {
  try {
    const res = await fetch("/user-dashBoard/", {
      credentials: "include"
    });

    const data = await res.json();

    if (!data.success) {
      window.location.href = "../pages/login.html";
      return;
    }
    document.getElementById("userName").innerText = data.userData.name;
    const notificationCard= document.querySelector('.notification-card');
    const blurDiv=document.querySelector('.blur');
        if (data.userData.isAccountVerified) {
      // Verified hai - notification hide kar do
      notificationCard.classList.add('notify_open');
      blurDiv.classList.add('openBlur');
    } else {
      // Not verified - notification dikhao
      notificationCard.classList.remove('notify_open');
      blurDiv.classList.remove('openBlur');
    }
  } catch (error) {
 console.error("Error loading dashboard:", error);  // Debug ke liye
    window.location.href = "../pages/login.html";
  }
}

// logout funtion call when logout button press
const logoutButton= document.getElementById("logoutButton");
logoutButton.addEventListener("click", logOut)

//logout api fetch
async function logOut(e) {
    e.preventDefault();
    try {
      const response = await fetch(
        "/authSystem/logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include"
        }
      );
      const data = await response.json();
      if (data.success) {
        window.location.href = "../pages/index.html";
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  }
  // send otp funtion
async function sendOtpVerify(){
  try {
      const response = await fetch("/authSystem/send-otp",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        credentials:"include" //for cookies  
      });
      const data = await response.json();
       
      if(data.success){
        alert(data.message);
          window.location.href = "../pages/otpVerification.html?type=verify-email";
      }else{
        alert(data.message)
      }
      
  } catch (error) {
          console.error("Error sending OTP:", error);
      alert("Server error while sending OTP");
  }
}

// funtion call
  loadDashboard();