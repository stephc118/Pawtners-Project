const loginForm = document.querySelector("#login");
const errorContainer = document.querySelector('.error-container');
const errorEle = document.createElement('div');
errorEle.className = 'error-message';

//When Login form submitted
loginForm.addEventListener('submit', async (event) => {
    try {
        event.preventDefault();

        const email = document.querySelector(".email").value;
        const password = document.querySelector(".password").value;

        //check if BOTH email and password are entered
        if (!email || !password) {
            alert('Please enter email/password');
            return;
        }
        const formData = {
            email: email,
            password: password
        };

        const res = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        //If no user was found
        if (res.status === 404) {
            //TODO: show error on UI
            errorEle.innerHTML = `
            <h3>No user was found, please try again.</h3>
            `
            errorContainer.append(errorEle);
        }
        if (res.status === 400) {
            errorEle.innerHTML = `
            <h3>Wrong email or password. Please try again.</h3>
            `
            errorContainer.append(errorEle);
        }

        if (res.status === 200) {
                window.location = '/booking.html';
        }
    } catch (err) {
        //TODO: show error on UI
        errorEle.innerHTML = `
        <h3>Something went wrong. Please try logging in again.</h3>
        `
        errorContainer.append(errorEle);
    }
});

