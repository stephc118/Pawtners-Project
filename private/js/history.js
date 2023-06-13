// BUG: gromming missing plan
var spinner = document.querySelector("#load");

(async () => {
    try {
        const tables = document.querySelector(".tables");
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

        if (res.status !== 200) {
            throw new Error('Something went wrong with your booking history, please try again.')
        }

        // Show Profile
        const {username, id, email} = jsonProfile.profile;
        const leftContainer = document.querySelector('.left');
        const rightContainer = document.querySelector('.right');

        const profileEle = document.createElement('div');
        profileEle.className = 'profile-element';
        profileEle.innerHTML = `
            <p><strong>Username:</strong> ${username}</p>
            <p><strong>User ID:</strong> ${id}</p>
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

        // Show booking history tables
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
                const { id, date, location, district, numberofpets, frequency, created_ts } = order;

                const row = document.createElement('tr');
                row.setAttribute("data-booking-id", id);
                row.innerHTML = `
                    <td>${id}</td>
                    <td>${new Date(date).toLocaleString('en-GB')}</td>
                    <td>At ${location}: ${capitalize(district)}</td>
                    <td>${numberofpets}</td>
                    <td>${frequency !== null ? frequency : "-"}</td>
                    <td>${new Date(created_ts).toLocaleString('en-GB')}</td>
                    <td>Pending</td>
                    <td class="stars">
                        <i class="fa-solid fa-star star"></i>
                        <i class="fa-solid fa-star star"></i>
                        <i class="fa-solid fa-star star"></i>
                        <i class="fa-solid fa-star star"></i>
                        <i class="fa-solid fa-star star"></i>
                    </td>
                `;
                tableBody.appendChild(row);
                
                const stars = document.querySelectorAll(`.pet-sitting tr[data-booking-id="${id}"] .stars i`);
                rating(stars);
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
                const { id, date, duration, numberofpets, frequency, created_ts } = order;

                const row = document.createElement('tr');
                row.setAttribute("data-booking-id", id);
                row.innerHTML = `
                    <td>${id}</td>
                    <td>${new Date(date).toLocaleString('en-GB')}</td>
                    <td>${duration}</td>
                    <td>${numberofpets}</td>
                    <td>${frequency ? frequency : "-"}</td>
                    <td>${new Date(created_ts).toLocaleString('en-GB')}</td>
                    <td>Pending</td>
                    <td class="stars">
                        <i class="fa-solid fa-star star"></i>
                        <i class="fa-solid fa-star star"></i>
                        <i class="fa-solid fa-star star"></i>
                        <i class="fa-solid fa-star star"></i>
                        <i class="fa-solid fa-star star"></i>
                    </td> 
                `;
                tableBody.appendChild(row);

                const stars = document.querySelectorAll(`.dog-walking tr[data-booking-id="${id}"] .stars i`);
                rating(stars);
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
                const { id, date, numberofpets, created_ts } = order;

                const row = document.createElement('tr');
                row.setAttribute("data-booking-id", id);
                row.innerHTML = `
                    <td>${id}</td>
                    <td>${new Date(date).toLocaleString('en-GB')}</td>
                    <td>${numberofpets}</td>
                    <td>${new Date(created_ts).toLocaleString('en-GB')}</td>
                    <td>Pending</td>
                    <td class="stars">
                        <i class="fa-solid fa-star star"></i>
                        <i class="fa-solid fa-star star"></i>
                        <i class="fa-solid fa-star star"></i>
                        <i class="fa-solid fa-star star"></i>
                        <i class="fa-solid fa-star star"></i>
                    </td> 
                `;
                tableBody.appendChild(row);
               
                const stars = document.querySelectorAll(`.pets-grooming tr[data-booking-id="${id}"] .stars i`);
                rating(stars);
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
                const { id, date, pickup, dropoff, numberofpets, created_ts } = order;

                const row = document.createElement('tr');
                row.setAttribute("data-booking-id", id);
                row.innerHTML = `
                    <td>${id}</td>
                    <td>${new Date(date).toLocaleString('en-GB')}</td>
                    <td>${capitalize(pickup)}</td>
                    <td>${capitalize(dropoff)}</td>
                    <td>${numberofpets}</td>
                    <td>${new Date(created_ts).toLocaleString('en-GB')}</td>
                    <td>Pending</td>
                    <td class="stars">
                        <i class="fa-solid fa-star star"></i>
                        <i class="fa-solid fa-star star"></i>
                        <i class="fa-solid fa-star star"></i>
                        <i class="fa-solid fa-star star"></i>
                        <i class="fa-solid fa-star star"></i>
                    </td>
                `;
                tableBody.appendChild(row);
                
                const stars = document.querySelectorAll(`.pets-ride tr[data-booking-id="${id}"] .stars i`);
                rating(stars);
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

const loadFile = function(event) {
    const image = document.getElementById('output');
    image.src = URL.createObjectURL(event.target.files[0]);
}

function capitalize(str){
    const words = str.split(" ");
    if (words.length > 1) {
        const capitalizedWords = words.map(word => capitalize(word));
        return capitalizedWords.join(" ");
    } else {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

function rating(stars) {
    stars.forEach((star, index1) => {
        star.addEventListener('click', () => {
        stars.forEach((star, index2) => {
            index1 >= index2 ? star.classList.add('active'): star.classList.remove('active');
            showOverlay()
        })
    })
    })
}

// Show Pop-up
const overlay = document.querySelector('.popup-overlay');
const showOverlay = () => {
    overlay.style.display = 'flex';
}

// Close Pop-up
window.onclick = function (event) {
    if (event.target == overlay) {
        overlay.style.display = 'none';
    }
}

const form = document.getElementById('rating');
const errorContainer = document.querySelector('.error-container');
// const element = document.querySelector('#rating');
// let service = element.dataset.service;

form.addEventListener('submit', async(event) => {
    
    try {
        event.preventDefault();

        const formData = new FormData(event.target);
        formData.append('username', getCookie('username'));
        formData.append('service', 'dog-walking')
        const username = formData.get('username');
        const service = formData.get('service');
        const rating = formData.get('rating');
        const text = formData.get('text');

        console.log(username);
        console.log(service);
        console.log(rating);
        console.log(text);

        // Check if all fields are filled
        if ( !rating || !text ) {
            errorContainer.style.display = 'initial';
            return;
        }

        const reviewData = {
            username: username,
            service: service,
            rating: rating,
            text: text
        }
        
        console.log(reviewData);

        const respReview = await fetch ('/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewData)
        })

        if (respReview.status === 200) {
            window.location = '/history.html'
        } else {
            alert('Failed to submit review, please try again.')
        }
    } catch (err) {
    console.log(err);
    }   
})

function getCookie(key){
    const regex = new RegExp('(?:^|;\s*)' + key + '=([^;]*)');
    const match = regex.exec(document.cookie);

    return match && match[1] ? decodeURIComponent(match[1]) : null;
}