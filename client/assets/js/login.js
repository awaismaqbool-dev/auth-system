// ===== Signup Submit =====
// console.log("LOGIN USER:", existEmail.email);


const form = document.getElementById("loginForm");
    const userEmailInput = document.getElementById("userEmail");
const userPasswordInput = document.getElementById("userPassword");
form.addEventListener("submit", sendData);

  async function sendData(e) {
    e.preventDefault();
    

    const userEmail = userEmailInput.value.trim();
    const userPassword = userPasswordInput.value.trim();


    if (!userEmail || !userPassword) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch(
        "/authSystem/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: userEmail,
            password: userPassword
          }),
          credentials: "include"
        }
      );

      const data = await response.json();

     if (data.success) {
  window.location.href = "../pages/dashBoard.html";  // Changed to relative path
} else {
  alert(data.message);
}

    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  }

