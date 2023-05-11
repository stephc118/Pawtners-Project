
function loginRequest() {
    const loginForm = document.querySelector("#login");

    //When Login form submitted
    loginForm.addEventListener('submit', async(event) => {
        console.log('here');
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
                password:password
            };

            const res = await fetch ('/login', {
                Method: 'POST',
                headers: {
                    'Content-Type': 'application/json',    
                },
                body: JSON.stringify(formData),
            });

            const response = await res.json();

            //If no user was found
            if (res.status === 400) {
                alert(response.message);
            }

            if (res.status === 200) {
                console.log(response);
                window.location = '/booking.html'
                const logInBtn = document.querySelector(".topnav-btn.green-btn");
                const registerBtn = document.querySelector(".topnav-btn.outline-btn");

                logInBtn.style.display = 'none';
                registerBtn.style.display = 'none';
            }



        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    });
};