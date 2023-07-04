// BUG: gromming missing plan
var spinner = document.querySelector("#load");

async function showUserProfile() {
    const resp = await fetch('/profile');
    const json = await resp.json();

    const { username, id, email } = json.profile;
    const idRow = document.querySelector('.information p[data-row="id"] span');
    const usernameRow = document.querySelector('.information p[data-row="username"] span');
    const emailRow = document.querySelector('.information p[data-row="email"] span');

    idRow.innerHTML = id;
    usernameRow.innerHTML = username;
    emailRow.innerHTML = email;

    const propicDOM = document.querySelector(".propic img");

    const getPropicResp = await fetch(`/uploads/propic/${id}.jpg`);
    if (getPropicResp.ok) {
        //set propic
        const blob = await getPropicResp.blob();
        propicDOM.src = URL.createObjectURL(blob);
    }

    // set profile picture
    const propicInput = document.getElementById("propic-upload");
    propicInput.addEventListener("change", (event) => {
        propicDOM.src = URL.createObjectURL(event.target.files[0]);

        const submitButton = document.querySelector(".propic .button.submit");
        submitButton.style.display = "inherit";
        const editButton = document.querySelector(".propic label.button");
        editButton.style.display = "none";
    })

    //submit profile picture
    const propicForm = document.querySelector("form.propic");
    propicForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        try {
            const formData = new FormData(event.currentTarget);
            const response = await fetch("/propic", {
                method: 'POST',
                body: formData
            });

            if (response.status === 200) {
                const submitButton = document.querySelector(".propic .button.submit");
                submitButton.style.display = "none";
                const editButton = document.querySelector(".propic label.button");
                editButton.style.display = "inherit";
            } else {
                // TODO: show error if failed to submit
                const errorMessage = document.querySelector('.propic .error-message');
                errorMessage.style.display = 'inherit';
            }
        } catch (error) {
            console.error(error);
        }
    })
}

(async () => {
    try {
        const timeoutId = setTimeout(() => {
            // show spinner
            spinner.style.display = 'flex';
        }, 100)

        // Get User Info
        // TODO: check loading speed
        await showUserProfile();
        const profile = document.querySelector(".profile");
        profile.style.display = 'flex';

        const tables = document.querySelector(".tables");
    

        // Get booking history
        const res = await fetch('/history');
        const response = await res.json();

        // Get booking reviews
        const resReview = await fetch(`/reviews`);
        const jsonReview = await resReview.json();

        clearTimeout(timeoutId); //remove spinner

        if (res.status !== 200) {
            throw new Error('Something went wrong with your booking history, please try again.')
        }

        // if (resReview !== 200) {
        //     throw new Error ('Cannot load reviews.')
        // }

        // Show booking history tables
        spinner.style.display = 'none';
        const { sitting, walking, grooming, ride } = response.orders;

        if (!Object.values(response.orders).flat().length) {
            const bookBtn = document.querySelector(".no-booking-content");
            bookBtn.style.display = 'block';
            return;
        }

        tables.style.display = 'flex';

        // Check if have review or not
        const reviews = jsonReview.review;

        function showReview(booking_id) {

            for (const review of reviews) {
                if (review.booking_id === booking_id) {
                        const ratingContainer = document.querySelector(`tr[data-booking-id='${booking_id}'] td.stars`);
                        ratingContainer.className = 'raiting-container';
                        ratingContainer.innerHTML = `
                        Rated <strong>${review.star}</strong> Stars, click to see review.
                        `
                    const reviewOverlay = document.querySelector('.review-overlay');
                    
                    ratingContainer.addEventListener('click', () => {
                        reviewOverlay.style.display = 'flex';
                        const textContainer = document.querySelector('.review-container');
                        textContainer.innerHTML = `${review.text}`
                    })
        
                    // Close Pop-Up by clicking elsewhere
                    window.addEventListener('click', (event) => {
                        if (event.target == reviewOverlay) {
                            reviewOverlay.style.display = 'none';
                        }
                    })
                    
                    // Close Pop-Up by clicking close button
                    const closeBtn = document.querySelector('.review-overlay .popup .fa-xmark');
                    
                    closeBtn.addEventListener('click', () => {
                        reviewOverlay.style.display = 'none';
                    })   
                }
            } 
        }

        if (sitting.length) {

            const tableBody = document.querySelector(".pet-sitting table tbody");
            for (const order of sitting) {
                const { booking_id, date, location, district, numberofpets, frequency, created_at, status } = order;

                const row = document.createElement('tr');
                row.setAttribute("data-booking-id", booking_id);
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

                    const stars = document.querySelectorAll(`.pet-sitting tr[data-booking-id="${booking_id}"] .stars i`);
                    rating(stars);

                    showReview(booking_id);
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
                row.setAttribute("data-booking-id", booking_id);
                row.innerHTML = `
                    <td>${booking_id}</td>
                    <td>${new Date(date).toLocaleString('en-GB')}</td>
                    <td>${duration}</td>
                    <td>${numberofpets}</td>
                    <td>${frequency ? frequency : "-"}</td>
                    <td>${new Date(created_at).toLocaleString('en-GB')}</td>
                    <td>${status}</td>
                    <td class="stars">
                        <i class="fa-solid fa-star star"></i>
                        <i class="fa-solid fa-star star"></i>
                        <i class="fa-solid fa-star star"></i>
                        <i class="fa-solid fa-star star"></i>
                        <i class="fa-solid fa-star star"></i>
                    </td> 
                `;
                tableBody.appendChild(row);

                const stars = document.querySelectorAll(`.dog-walking tr[data-booking-id="${booking_id}"] .stars i`);
                rating(stars);

                showReview(booking_id);
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
                row.setAttribute("data-booking-id", booking_id);
                row.innerHTML = `
                    <td>${booking_id}</td>
                    <td>${new Date(date).toLocaleString('en-GB')}</td>
                    <td>${numberofpets}</td>
                    <td>${new Date(created_at).toLocaleString('en-GB')}</td>
                    <td>${status}</td>
                    <td class="stars">
                        <i class="fa-solid fa-star star"></i>
                        <i class="fa-solid fa-star star"></i>
                        <i class="fa-solid fa-star star"></i>
                        <i class="fa-solid fa-star star"></i>
                        <i class="fa-solid fa-star star"></i>
                    </td> 
                `;
                tableBody.appendChild(row);

                const stars = document.querySelectorAll(`.pets-grooming tr[data-booking-id="${booking_id}"] .stars i`);
                rating(stars);

                showReview(booking_id);
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
                row.setAttribute("data-booking-id", booking_id);
                row.innerHTML = `
                    <td>${booking_id}</td>
                    <td>${new Date(date).toLocaleString('en-GB')}</td>
                    <td>${capitalize(pickup)}</td>
                    <td>${capitalize(dropoff)}</td>
                    <td>${numberofpets}</td>
                    <td>${new Date(created_at).toLocaleString('en-GB')}</td>
                    <td>${status}</td>
                    <td class="stars">
                        <i class="fa-solid fa-star star"></i>
                        <i class="fa-solid fa-star star"></i>
                        <i class="fa-solid fa-star star"></i>
                        <i class="fa-solid fa-star star"></i>
                        <i class="fa-solid fa-star star"></i>
                    </td>
                `;
                tableBody.appendChild(row);

                const stars = document.querySelectorAll(`.pets-ride tr[data-booking-id="${booking_id}"] .stars i`);
                rating(stars);

                showReview(booking_id);
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

function capitalize(str) {
    const words = str.split(" ");
    if (words.length > 1) {
        const capitalizedWords = words.map(word => capitalize(word));
        return capitalizedWords.join(" ");
    } else {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

let serviceToBeReviewed = "";
let starIndexSelected = 4;
let bookingId;

function rating(stars) {
    stars.forEach((star, currentStarIndex) => {
        star.addEventListener('click', () => {
            stars.forEach((star, index) => {
                currentStarIndex >= index ? star.classList.add('active') : star.classList.remove('active');
            })

            starIndexSelected = currentStarIndex;
            const clickedRow = star.closest("table");
            serviceToBeReviewed = clickedRow.dataset.serviceName;
            const clickedOrder = star.closest('tr');
            bookingId = clickedOrder.dataset.bookingId;

            showOverlay();
        })
        star.addEventListener('mouseenter', () => {
            const highlightedStars = [...stars].slice(0, currentStarIndex + 1); // spread to convert NodeList to Array
            highlightedStars.map(star => star.classList.add('hover'));
        })

        star.addEventListener('mouseleave', () => {
            const highlightedStars = [...stars].slice(0, currentStarIndex + 1);
            highlightedStars.map(star => star.classList.remove('hover'));
        })
    })
}

// Show Pop-up
const overlay = document.querySelector('.popup-overlay');
const errorContainer = document.querySelector('.error-container');
const textArea = document.querySelector('textarea[name="text"]');



const showOverlay = () => {
    document.querySelector(`#rating #star-${starIndexSelected + 1}`).checked = true;
    textArea.value = '';
    errorContainer.style.display = 'none';
    overlay.style.display = 'flex';
}

// Close Pop-up by clicking outside Pop-up
window.addEventListener('click', (event) => {
    if (event.target == overlay) {
        overlay.style.display = 'none';
    }
})
// window.onclick = function (event) {
//     if (event.target == overlay) {
//         console.log(event.target);
//         overlay.style.display = 'none';
//     }
// }

// Close Pop-Up by clicking close button
const closeBtn = document.querySelector('.fa-xmark');

closeBtn.addEventListener('click', () => {
    overlay.style.display = 'none';
})

// Fetch API to submit review form
const form = document.getElementById('rating');

form.addEventListener('submit', async (event) => {
    try {
        event.preventDefault();

        const formData = new FormData(event.target);
        const rating = formData.get('rating');
        const text = formData.get('text');

        // Check if all fields are filled
        if (!rating || !text) {
            errorContainer.style.display = 'initial';
            errorContainer.innerHTML = 'Please give rating and write some reviews before submission.';
            return;
        }

        // Check if exceeds the max word count
        if (text.length > 255) {
            errorContainer.style.display = 'initial';
            errorContainer.innerHTML = 'The maximum word count for writing the review is 255 characters.';
            return;
        }

        const reviewData = {
            bookingId: bookingId,
            rating: rating,
            text: text
        }

        const respReview = await fetch('/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewData)
        })

        if (respReview.status === 200) {
            window.location = '/history.html'
        } else {
            errorContainer.style.display = 'initial';
            errorContainer.innerHTML = 'Failed to submit, please try again.'
        }
    } catch (err) {
        console.log(err);     
    }
})