const logOut = document.querySelector("#logout");

logOut.addEventListener('submit', async (event) => {
    try {
        event.preventDefault();
        const res = await fetch('/logout');
        if (res.status === 200) {
            sessionStorage.clear();
            window.location = '/not-login.html';
        }
    } catch (err) {
        throw new Error('unable to log out.');
    }
});