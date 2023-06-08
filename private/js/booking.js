//BUG: form is able to sent past datatime, non exist district
const serviceCards = document.querySelectorAll(".service-selection .card");
let serviceSelected;

for (const card of serviceCards){
    //TODO: un-select when clicked elsewhere
    card.addEventListener('click', (event) => {   
        // clean up service and plan selection
        serviceSelected = null;
        const selection = document.querySelectorAll('.selected');

        if (selection.length) {
            for (const section of selection) {
                section.classList.remove("selected");
            }
        }

        card.classList.add("selected"); //highlight button
        
        //show specific plan based on service selected
        const clickedCardDiv = event.target.closest(".card");
        serviceSelected = clickedCardDiv.dataset.serviceName;

        if (serviceSelected === 'pets-ride') {
            const bookingForm = document.querySelector(`.booking-form.${serviceSelected}`);
            bookingForm.classList.add("selected");
            bookingForm.scrollIntoView({behavior: 'smooth', block: 'nearest'});
        } else {
            const planSelection = document.querySelector(`.plan-selection.${serviceSelected}`);
            planSelection.classList.add("selected");
            planSelection.scrollIntoView({behavior: 'smooth'});
        }
    })
}

const planCards = document.querySelectorAll(".plan-selection .card");

for (const card of planCards){
    card.addEventListener('click', (event) => {
        // remove previous selected plan
        const prevSelectedCard = document.querySelector(".plan-selection .card.selected");
        if (prevSelectedCard) {
            prevSelectedCard.classList.remove("selected");
        }

        card.classList.add("selected");

        // show booking form
        const bookingForm = document.querySelector(`.booking-form.${serviceSelected}`);
        bookingForm.classList.add("selected");
        bookingForm.scrollIntoView({behavior: 'smooth', block: 'nearest'});

        
        // form custom input handling
        //BUG: required custom field doesn't work on dynamic form
        const clickedPlanDiv = event.target.closest(".card");

        const frequencyEle = document.querySelector(`.booking-form.${serviceSelected} .frequency`);
        if (frequencyEle) {
            frequencyEle.classList.remove('regular');
            const frequency = clickedPlanDiv.dataset.frequency;

            if (frequency) {
                frequencyEle.classList.add(frequency);
            }
        }


        const durationEle = document.querySelector(`.booking-form.${serviceSelected} .duration`);
        if (durationEle) {
            durationEle.classList.remove('short');
            durationEle.classList.remove('long');

            const duration = clickedPlanDiv.dataset.duration;
            if (duration) {
                durationEle.classList.add(duration);
            }
        }
    })
}

// Pets Grooming Booking Form Handling

const groomingForm = document.querySelector('.pets-grooming.booking-form');

groomingForm.addEventListener('submit', async (event) => {
    try {
        event.preventDefault();

        const date = document.querySelector('.pets-grooming .date').value;
        const time = document.querySelector('.pets-grooming .time').value;
        const numberOfPets = document.querySelector('.pets-grooming .number').value;
        const errorContainer = document.querySelector('.pets-grooming .error-container');
        errorEle = document.createElement('div');
        errorEle.className = 'error-message';

        if ( !date || !time || !numberOfPets ) {
            errorEle.innerHTML = `<p>Please fill in all the fields!</p>`
            errorContainer.append(errorEle);
            return;
        }

        const formData = {
            date: date,
            time: time,
            number: numberOfPets
        }

        const res = await fetch ('/grooming-booking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (res.status === 400) {
            errorEle.innerHTML = `<p>Booking failed, please try again.</p>`
            errorContainer.append(errorEle);
            errorContainer.scrollIntoView({behavior: 'smooth', block: 'top'});
        }
        if (res.status === 500) {
            errorEle.innerHTML = `<p>Invalid input, please try again.</p>`
            errorContainer.append(errorEle);
            errorContainer.scrollIntoView({behavior: 'smooth', block: 'top'});
        }
        if (res.status === 200) {
            window.location = '/success.html'
        }
    } catch (err) {
        errorEle.innerHTML = `<p>Something went wrong, please try again.</p>`
        errorContainer.append(errorEle);
        errorContainer.scrollIntoView({behavior: 'smooth', block: 'top'});
    }
});

// Pets Ride Booking Form Handling

const rideForm = document.querySelector('.pets-ride.booking-form');

rideForm.addEventListener('submit', async (event) => {
    try {
        event.preventDefault();

        const date = document.querySelector('.pets-ride .date').value;
        const time = document.querySelector('.pets-ride .time').value;
        const pickUp = document.querySelector('.pets-ride .pickup').value;
        const dropOff = document.querySelector('.pets-ride .dropoff').value;
        const numberOfPets = document.querySelector('.pets-ride .number').value;
        const errorContainer = document.querySelector('.pets-ride .error-container');
        errorEle = document.createElement('div');
        errorEle.className = 'error-message';

        if ( !date || !time || !pickUp || !dropOff || !numberOfPets ) {
            errorEle.innerHTML = `<p>Please fill in all the fields!</p>`
            errorContainer.append(errorEle);
            return;
        }

        const formData = {
            date: date,
            time: time,
            pickup: pickUp,
            dropoff: dropOff,
            number: numberOfPets
        }

        const res = await fetch ('/ride-booking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (res.status === 400) {
            errorEle.innerHTML = `<p>Booking failed, please try again.</p>`
            errorContainer.append(errorEle);
        }
        if (res.status === 500) {
            errorEle.innerHTML = `<p>Invalid input, please try again.</p>`
            errorContainer.append(errorEle);
        }
        if (res.status === 200) {
            window.location = '/success.html'
        }
    } catch (err) {
        errorEle.innerHTML = `<p>Something went wrong, please try again.</p>`
        errorContainer.append(errorEle);
    }
});

// const petSittingForm = document.querySelector('.pet-sitting.booking-form');

// petSittingForm.addEventListener('submit', async (event) => {
//     try {
//         event.preventDefault();

//         const date = document.querySelector('.date').value;
//         const time = document.querySelector('.time').value;
//         const location = document.querySelector('.location').value;
//         const numberOfPets = document.querySelector('.number').value;
//         const district = document.querySelector('.district').value;

//         if ( !date || !time || !location || !numberOfPets || district ) {
//             alert ('Please fill in all the fields!')
//             return;
//         }

//         const formData = {
//             date: date,
//             time: time,
//             location: location,
//             numberofpets: numberOfPets,
//             district: district
//         }

//         const res = await fetch ('/sitting-booking', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(formData),
//         });

//         if (res.status === 400) {
//             alert ('Booking failed, please try again.')
//         }

//         if (res.status === 200) {
//             window.location = '/success.html'
//         }
//     } catch (err) {
//         console.log(err);
//     }
// });