var spinner = document.querySelector("#load");

(async () => {
    try {
        const table = document.querySelector("#table");
        const timeoutId = setTimeout(() => {
            // show spinner
            spinner.style.display = 'flex';
        }, 1000)

        const res = await fetch('/history');

        const response = await res.json();

        clearTimeout(timeoutId); //remove spinner

        if (res.status === 400) {
            throw new Error('Something went wrong with your booking history, please try again.')
        }

        if (res.status === 200) {
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