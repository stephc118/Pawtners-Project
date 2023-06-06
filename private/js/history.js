var spinner = document.querySelector("#load");

(async () => {
    try {
        const table = document.querySelector("#table");
        const timeoutId = setTimeout(() => {
            // show spinner
            spinner.style.display = 'flex';
        }, 1000)

        // Get User Info
        const resProfile = await fetch('/profile');
        const jsonProfile = await resProfile.json();

        // Get booking history
        const res = await fetch('/history');
        const response = await res.json();

        clearTimeout(timeoutId); //remove spinner

        if (res.status === 400) {
            throw new Error('Something went wrong with your booking history, please try again.')
        }

        if (res.status === 200) {
            // Show Profile
           const {username, user_id, email} = jsonProfile.profile;
           const leftContainer = document.querySelector('.left');
           const rightContainer = document.querySelector('.right');
    
           const profileEle = document.createElement('div');
           profileEle.className = 'profile-element';
           profileEle.innerHTML = `
               <p><strong>Username:</strong> ${username}</p>
               <p><strong>User ID:</strong> ${user_id}</p>
               <p><strong>Email:</strong> ${email}</p>
           `
           leftContainer.append(profileEle);
    
           const imageEle = document.createElement('div');
           imageEle.innerHTML = `
               <p><strong><label for="file">Choose Your Profile Picture
               <p><input type="file" accept="image/png, image/jpeg" name="image" id="file" onchange="loadFile(event)"></p>
               <p><img id="output" width="150px" /></p>
               <p><input type="submit" name="submit" value="Upload"></p>
           `
           rightContainer.append(imageEle);

            //if no booking
            if (!response.orderRide && !response.orderSitting &&
                !response.orderGrooming && !response.orderWalking) {

                spinner.style.display = 'none';
                const bookBtn = document.querySelector(".no-booking-content");
                bookBtn.style.display = 'block';
            }
            //if have booking
            else if (response?.orderRide || response?.orderSitting ||
                response?.orderGrooming || response?.orderWalking) {

                spinner.style.display = 'none';
                table.style.display = 'table';

                if (response?.orderRide) {
                    for (i = 0; i < response.orderRide.length; i++) {
                        const { ride_order_id, date, time } = response.orderRide[i];
                        const row = document.createElement('tr');
                        row.innerHTML = `
                        <td id="order-no">${ride_order_id}</td>
                        <td id="serivce">Pet's Ride</td>
                        <td id="date">${date}</td>
                        <td id="other-details">Time: ${time}</td>
                        <td>Pending</td>
                        `
                        table.appendChild(row);
                    }
                }

                if (response?.orderSitting.length) {
                    for (i = 0; i < response?.orderSitting.length; i++) {
                        const { sitting_order_id, date, location } = response.orderSitting[i];
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td id="order-no">${sitting_order_id}</td>
                            <td id="serivce">Pet Sitting</td>
                            <td id="date">${date}</td>
                            <td id="other-details">Location: At ${location}</td>
                            <td>Pending</td>
                            `
                        table.appendChild(row);
                    }
                }

                if (response?.orderGrooming) {
                    for (i = 0; i < response.orderGrooming.length; i++) {
                        const { grooming_order_id, date, numberofpets } = response.orderGrooming[i];
                        const row = document.createElement('tr');
                        row.innerHTML = `
                        <td id="order-no">${grooming_order_id}</td>
                        <td id="serivce">Pets Grooming</td>
                        <td id="date">${date}</td>
                        <td id="other-details">Number of Pets: ${numberofpets}</td>
                        <td>Pending</td>
                        `
                        table.appendChild(row);
                    }
                }

                if (response?.orderWalking) {
                    for (i = 0; i < response.orderWalking.length; i++) {
                        const { walking_order_id, date, time, duration } = response.orderWalking[i];
                        const row = document.createElement('tr');
                        row.innerHTML = `
                        <td id="order-no">${walking_order_id}</td>
                        <td id="serivce">Dogs Walking</td>
                        <td id="date">${date}</td>
                        <td id="other-details">Time: ${time}, Duration: ${duration} mins</td>
                        <td>Pending</td>
                        `
                        table.appendChild(row);
                    }
                }
            }
        }
    } catch (err) {
        console.log(err);
    }
})()

const loadFile = function(event) {
    const image = document.getElementById('output');
    image.src = URL.createObjectURL(event.target.files[0]);
}
