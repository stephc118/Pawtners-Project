const loginForm = document.querySelector("#login");

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
        if (res.status === 400) {
            // alert(response.message);
            //TODO: show error on UI
            alert('No User was found. Please try again')
        }

        if (res.status === 200) {
                window.location = '/booking.html';
        }
    } catch (err) {
        console.error(err);
        // alert(err.message);
        //TODO: show error on UI
        alert('Something went wrong. Please try logging in again.')
    }
});

