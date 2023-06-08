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

        tables.style.display = 'block';

        if (sitting.length) {
            const tableBody = document.querySelector("table.pet-sitting tbody");
            for (const order of sitting) {
                console.log(order);
                const { id, date, location, district, numberofpets, frequency, created_ts } = order;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${id}</td>
                    <td>${new Date(date).toLocaleString('en-GB')}</td>
                    <td>At ${location}: ${capitalize(district)}</td>
                    <td>${numberofpets}</td>
                    <td>${frequency !== null ? frequency : "-"}</td>
                    <td>${new Date(created_ts).toLocaleString('en-GB')}</td>
                    <td>Pending</td>
                `;
                tableBody.appendChild(row);
            }
        }

        if (walking.length) {
            const tableBody = document.querySelector("table.dog-walking tbody");
            for (const order of walking) {
                const { id, date, duration, numberofpets, frequency, created_ts } = order;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${id}</td>
                    <td>${new Date(date).toLocaleString('en-GB')}</td>
                    <td>${duration}</td>
                    <td>${numberofpets}</td>
                    <td>${frequency !== null ? frequency : "-"}</td>
                    <td>${new Date(created_ts).toLocaleString('en-GB')}</td>
                    <td>Pending</td>
                `;
                tableBody.appendChild(row);
            }
        }

        if (grooming.length) {
            const tableBody = document.querySelector("table.pets-grooming tbody");
            for (const order of grooming) {
                const { id, date, numberofpets, created_ts } = order;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${id}</td>
                    <td>${new Date(date).toLocaleString('en-GB')}</td>
                    <td>${numberofpets}</td>
                    <td>${new Date(created_ts).toLocaleString('en-GB')}</td>
                    <td>Pending</td>
                `;
                tableBody.appendChild(row);
            }
        }

        if (ride.length) {
            const tableBody = document.querySelector("table.pets-ride tbody");
            for (const order of ride) {
                const { id, date, pickup, dropoff, numberofpets, created_ts } = order;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${id}</td>
                    <td>${new Date(date).toLocaleString('en-GB')}</td>
                    <td>${capitalize(pickup)}</td>
                    <td>${capitalize(dropoff)}</td>
                    <td>${numberofpets}</td>
                    <td>${new Date(created_ts).toLocaleString('en-GB')}</td>
                    <td>Pending</td>
                `;
                tableBody.appendChild(row);
            }
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