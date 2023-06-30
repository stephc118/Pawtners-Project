// BUG: gromming missing plan
var spinner = document.querySelector("#load");

(async () => {
    try {
        const tables = document.querySelector(".tables");
        const timeoutId = setTimeout(() => {
            // show spinner
            spinner.style.display = 'flex';
        }, 1000)

        const res = await fetch('/history');

        const response = await res.json();

        clearTimeout(timeoutId); //remove spinner

        if (res.status !== 200) {
            throw new Error('Something went wrong with your booking history, please try again.')
        }

        spinner.style.display = 'none';
        const { sitting, walking, grooming, ride} = response.orders;

        if (!Object.values(response.orders).flat().length){
            const bookBtn = document.querySelector(".no-booking-content");
            bookBtn.style.display = 'block';
            return;
        }

        tables.style.display = 'flex';

        if (sitting.length) {
            const tableBody = document.querySelector(".pet-sitting table tbody");
            for (const order of sitting) {
                const { booking_id, date, location, district, numberofpets, frequency, created_at, status } = order;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${booking_id}</td>
                    <td>${new Date(date).toLocaleString('en-GB')}</td>
                    <td>At ${location}: ${capitalize(district)}</td>
                    <td>${numberofpets}</td>
                    <td>${frequency !== null ? frequency : "-"}</td>
                    <td>${new Date(created_at).toLocaleString('en-GB')}</td>
                    <td>${status}</td>
                    <td class="stars">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                    </td> 

                `;
                tableBody.appendChild(row);
            }
        } else {
            const table = document.querySelector('.pet-sitting table');
            table.style.display = 'none';

            const noBookingMessage = document.querySelector('.pet-sitting .no-booking');
            noBookingMessage.style.display = 'initial';
        }

        if (walking.length) {
            const tableBody = document.querySelector(".dog-walking table tbody");
            for (const order of walking) {
                const { booking_id, date, duration, numberofpets, frequency, created_at, status } = order;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${booking_id}</td>
                    <td>${new Date(date).toLocaleString('en-GB')}</td>
                    <td>${duration}</td>
                    <td>${numberofpets}</td>
                    <td>${frequency ? frequency : "-"}</td>
                    <td>${new Date(created_at).toLocaleString('en-GB')}</td>
                    <td>${status}</td>
                    <td class="stars">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                    </td> 
                `;
                tableBody.appendChild(row);
            }
        } else {
            const table = document.querySelector('.dog-walking table');
            table.style.display = 'none';

            const noBookingMessage = document.querySelector('.dog-walking .no-booking');
            noBookingMessage.style.display = 'initial';
        }

        if (grooming.length) {
            const tableBody = document.querySelector(".pets-grooming table tbody");
            for (const order of grooming) {
                const { booking_id, date, numberofpets, created_at, status } = order;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${booking_id}</td>
                    <td>${new Date(date).toLocaleString('en-GB')}</td>
                    <td>${numberofpets}</td>
                    <td>${new Date(created_at).toLocaleString('en-GB')}</td>
                    <td>${status}</td>
                    <td class="stars">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                    </td> 
                `;
                tableBody.appendChild(row);
            }
        } else {
            const table = document.querySelector('.pets-grooming table');
            table.style.display = 'none';

            const noBookingMessage = document.querySelector('.pets-grooming .no-booking');
            noBookingMessage.style.display = 'initial';
        }
       
        if (ride.length) {
            const tableBody = document.querySelector(".pets-ride table tbody");
            for (const order of ride) {
                const { booking_id, date, pickup, dropoff, numberofpets, created_at, status } = order;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${booking_id}</td>
                    <td>${new Date(date).toLocaleString('en-GB')}</td>
                    <td>${capitalize(pickup)}</td>
                    <td>${capitalize(dropoff)}</td>
                    <td>${numberofpets}</td>
                    <td>${new Date(created_at).toLocaleString('en-GB')}</td>
                    <td>${status}</td>
                    <td class="stars">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                    </td>
                `;
                tableBody.appendChild(row);
            }
        } else {
            const table = document.querySelector('.pets-ride table');
            table.style.display = 'none';

            const noBookingMessage = document.querySelector('.pets-ride .no-booking');
            noBookingMessage.style.display = 'initial';
        }      
    } catch (err) {
        console.log(err);
    }
})()

function capitalize(str){
    const words = str.split(" ");
    if (words.length > 1) {
        const capitalizedWords = words.map(word => capitalize(word));
        return capitalizedWords.join(" ");
    } else {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}