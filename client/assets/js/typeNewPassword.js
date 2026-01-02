
  // ===== Elements =====
  const passwordInput= document.getElementById('passwordInput');
  const status = document.getElementById("passwordStatus");
  const line1 = document.querySelector(".line1");
  const line2 = document.querySelector(".line2");
  const line3 = document.querySelector(".line3");

  // ===== Password Validation =====
  function validatePassword(password) {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*()]/.test(password)) score++;

    if (score <= 1) return "Very Weak";
    if (score === 2) return "Weak";
    if (score === 3) return "Medium";
    return "Strong";
  }

  // ===== Password Strength UI =====
  function displayStrength() {
    const password = passwordInput.value;

    // reset
    line1.classList.remove("lineStyle");
    line2.classList.remove("lineStyle");
    line3.classList.remove("lineStyle");

    if (password.trim() === "") {
      status.innerText = "";
      return;
    }

    const strength = validatePassword(password);
    status.innerText = strength;

    if (strength === "Very Weak" || strength === "Weak") {
      line1.classList.add("lineStyle");
    }

    if (strength === "Medium") {
      line1.classList.add("lineStyle");
      line2.classList.add("lineStyle");
    }

    if (strength === "Strong") {
      line1.classList.add("lineStyle");
      line2.classList.add("lineStyle");
      line3.classList.add("lineStyle");
    }
  }

  passwordInput.addEventListener("input", displayStrength);

// new password server api call
async function changePassword() {
   try {
  const email= localStorage.getItem('resetEmail')
  if (!email) {
    alert("Email not Found");
  return;
  }
  const password=passwordInput.value;
  if (!password) {
    alert("Enter Password Please");
    return;
  }
const response = await fetch("/authSystem/change-Password",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({email:email,password:password}),
        credentials:"include" //for cookies  
      });
      const data = await response.json();
       
      if(data.success){
        alert(data.message);
              localStorage.removeItem('resetEmail');
  window.location.href = "../pages/login.html";
      }else{
        alert(data.message)
      }
}  catch (error) {
          console.error("Error verifying OTP:", error);
      alert("Server error while verifying OTP");
  }
}