const username =  decodeURI(document.cookie.substring(9));

if (username) {
    const notLogIn = document.querySelector("#not-login-nav");
    const LogIn =  document.querySelector("#login-nav");
    const showUsername = document.querySelector(".user");
    const registerBtn = document.querySelector("#register-btn");
    notLogIn.style.display = 'none';
    LogIn.style.display = 'block';
    showUsername.innerHTML = username;
    registerBtn.style.display = 'none';
} else {
    const notLogIn = document.querySelector("#not-login-nav");
    const LogIn =  document.querySelector("#login-nav");
    notLogIn.style.display = 'block';
    LogIn.style.display = 'none'; 
}
