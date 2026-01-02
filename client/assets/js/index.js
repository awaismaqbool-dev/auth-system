const signInButton = document.getElementById("signInButton")
const signUpButton = document.getElementById("signUpButton")
signInButton.addEventListener("click", singInpage);
signUpButton.addEventListener("click", singUppage);

function singInpage(){
window.location.href = "../pages/login.html";    
}
function singUppage(){
window.location.href = "../pages/Singup.html";    
}
