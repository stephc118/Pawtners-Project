const username = getCookie('username');

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

function getCookie(key){
    const regex = new RegExp('(?:^|;\s*)' + key + '=([^;]*)');
    const match = regex.exec(document.cookie);

    return match && match[1] ? decodeURIComponent(match[1]) : null;
}