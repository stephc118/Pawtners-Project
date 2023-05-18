//TODO: check if user already logged in
// const username = sessionStorage.getItem('username');



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

        const response = await res.json();

        //If not success
        if (res.status === 400) {
            // alert(response.message);
            //TODO: show error on UI
            alert('Registration failed. Please try again')
        }

        if (res.status === 200) {
            if (response?.username) {
                sessionStorage.setItem('username', response.username);
                window.location = '/booking.html';
            } else {
                throw new Error('unable to register.');
            }
        }

    } catch (err) {
        console.error(err);
        // alert(err.message);
        //TODO: show error on UI
        alert('Something went wrong. Please try to register again.')
    }
});