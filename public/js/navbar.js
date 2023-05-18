

const username = sessionStorage.getItem('username');
const usernameGoogle = sessionStorage.getItem('username_google');
// console.log('username', username);

if (username || usernameGoogle) {
    const notLogIn = document.querySelector("#not-login-nav");
    const LogIn =  document.querySelector("#login-nav");
    const showUsername = document.querySelector(".user");
    notLogIn.style.display = 'none';
    LogIn.style.display = 'block';
    showUsername.innerHTML = username;
} else  {
    const notLogIn = document.querySelector("#not-login-nav");
    const LogIn =  document.querySelector("#login-nav");
    notLogIn.style.display = 'block';
    LogIn.style.display = 'none'; 
}
