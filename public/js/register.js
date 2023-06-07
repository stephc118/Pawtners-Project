//TODO: check if user already logged in
// const username = sessionStorage.getItem('username');

const errorContainer = document.querySelector('.error-container');
const errorEle = document.createElement('div');
errorEle.className = 'error-message';
errorEle.className = 'error-message';


const registerForm = document.querySelector("#register");
//When register form submitted
registerForm.addEventListener('submit', async (event) => {
    try {
        event.preventDefault();

        const username = document.querySelector(".username").value;
        const email = document.querySelector(".email").value;
        const password = document.querySelector(".password").value;


        if (!username || !email || !password) {
            alert('Please enter username/email/password');
            return;
        }
        const formData = {
            username: username,
            email: email,
            password: password
        };

        const res = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });


        //If not success
        if (res.status === 400) {
            //TODO: show error on UI
            errorEle.innerHTML = `
            <h3>Registration failed. Please try again.</h3>
            `
            errorContainer.append(errorEle);
        }

        if (res.status === 404) {
            //TODO: show error on UI
            errorEle.innerHTML = `
            <h3>You have been logged in or <br>this email has already been registered.</h3>
            `
            errorContainer.append(errorEle);
        }

        if (res.status === 200) {
                window.location = '/booking.html';
        }
    } catch (err) {
        //TODO: show error on UI
        errorEle.innerHTML = `
            <h3>Something went wrong. Please try to register again.</h3>
            `
            errorContainer.append(errorEle);
    }
});