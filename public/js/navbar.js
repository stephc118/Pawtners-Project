const username =  decodeURI(document.cookie.substring(9));

if (username) {
    const notLogIn = document.querySelector("#not-login-nav");
    const LogIn =  document.querySelector("#login-nav");
    const showUsername = document.querySelector(".user");
    notLogIn.style.display = 'none';
    LogIn.style.display = 'block';
    showUsername.innerHTML = username;
} else {
    const notLogIn = document.querySelector("#not-login-nav");
    const LogIn =  document.querySelector("#login-nav");
    notLogIn.style.display = 'block';
    LogIn.style.display = 'none'; 
}
