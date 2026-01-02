// function validatePassword() {
//   const passwordInput = document.getElementById("userPassword");
//   const password = passwordInput.value;

//   // Example validation rules
//   const minLength = 8;
//   let score = 0;
//   const hasUpperCase = /[A-Z]/.test(password);
//   const hasLowerCase = /[a-z]/.test(password);
//   const hasNumber = /[0-9]/.test(password);
//   const hasSpecialChar = /[!@#$%^&*()]/.test(password);

//   if (password.length >= minLength) {
//     score += 1;
//   }
//    // Rule 2: Check for uppercase letters
//   if (/[A-Z]/.test(password)) {
//     score += 1;
//   }
  
//   // Rule 3: Check for lowercase letters
//   if (/[a-z]/.test(password)) {
//     score += 1;
//   }

//   // Rule 4: Check for numbers
//   if (/[0-9]/.test(password)) {
//     score += 1;
//   }

//   // Rule 5: Check for special characters
//   if (/[!@#$%^&*()]/.test(password)) {
//     score += 1;
//   }

//   // Determine strength level based on the total score (0 to 5)
//   switch (score) {
//     case 0:
//     case 1:
//       return "Very Weak";
//     case 2:
//       return "Weak";
//     case 3:
//       return "Medium";
//     case 4:
//     case 5:
//       return "Strong";
//     default:
//       return "Password does not meet requirements.";
//   }
// }

// function displayStrength() {
//   const strength = validatePassword();       // get strength text
// let status=document.getElementById("passwordStatus");
//   status.innerText = strength;  
//   const line1 = document.querySelector(".line1");
//   const line2 = document.querySelector(".line2");
//   const line3 = document.querySelector(".line3");
// const password = document.getElementById("userPassword").value;
//   if (password.trim() == "") {
//     status.innerText = "";
//      line1.classList.remove("lineStyle");
//   line2.classList.remove("lineStyle");
//   line3.classList.remove("lineStyle");
//     return;
//   }

//    // strength ke hisaab se class add karo
//   if (strength === "Very Weak" || strength === "Weak") {
//     line1.classList.add("lineStyle");
//   }

//   if (strength === "Medium") {
//     line1.classList.add("lineStyle");
//     line2.classList.add("lineStyle");
//   }

//   if (strength === "Strong") {
//     line1.classList.add("lineStyle");
//     line2.classList.add("lineStyle");
//     line3.classList.add("lineStyle");
//   }

// };

document.addEventListener("DOMContentLoaded", () => {

  console.log("Signup JS Loaded");

  // ===== Elements =====
  const form = document.getElementById("signupForm");
  const userNameInput = document.getElementById("userName");
  const userEmailInput = document.getElementById("userEmail");
  const userPasswordInput = document.getElementById("userPassword");

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
    const password = userPasswordInput.value;

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

  userPasswordInput.addEventListener("input", displayStrength);

  // ===== Signup Submit =====
  form.addEventListener("submit", sendData);

  async function sendData(e) {
    e.preventDefault();

    const userName = userNameInput.value.trim();
    const userEmail = userEmailInput.value.trim();
    const userPassword = userPasswordInput.value.trim();

    if (!userName || !userEmail || !userPassword) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch(
        "/authSystem/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            name: userName,
            email: userEmail,
            password: userPassword
          })
        }
      );

      const data = await response.json();

      if (data.success) {
        window.location.href = "../pages/dashboard.html";
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  }
});
