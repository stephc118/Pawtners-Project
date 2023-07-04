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

        if (serviceSelected === 'ride') {
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
let planIdSelected;

for (const card of planCards){
    card.addEventListener('click', (event) => {
        // remove previous selected plan
        const prevSelectedCard = document.querySelector(".plan-selection .card.selected");
        if (prevSelectedCard) {
            prevSelectedCard.classList.remove("selected");
        }

        card.classList.add("selected");
        planIdSelected = card.dataset.planId;

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

// Set available booking dates to 3 months from today
const dateEle = document.querySelectorAll(`input.date`);
for (const date of dateEle) {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var mm3 = today.getMonth() + 4;
    var yyyy = today.getFullYear();
  
    var hh = today.getHours();
    var m = today.getMinutes();

    if (dd < 10) {
    dd = '0' + dd;
    }

    if (mm < 10) {
    mm = '0' + mm;
    }
        
    today = yyyy + "-" + mm + "-" + dd + "T" + hh + ":" + m;
    date.setAttribute("min", today);
    var threeMonthsAway = yyyy + "-" + mm3 + "-" + dd + "T" + hh + ":" + m;
    date.setAttribute("max", threeMonthsAway);
}

//TODO: clean form after send
// TODO: check invalid value (e.g. incorrect date)

// const planIdToNameMapping = {
//     1: "single",
//     2: "regular-day",
//     3: "regular-overnight",
//     4: "every-other-day",
//     5: "daily",
//     6: "regular-active",
//     7: "shower",
//     8: "trimming",
//     9: "spa"
// }

const servicesBookingInfo = {
    "grooming": {
        selectors: {
            date: "input.date",
            numberOfPets: "input.numberOfPets"
        }
    },
    "ride": {
        selectors: {
            date: "input.date",
            pickup: "input.pickup",
            dropoff: "input.dropoff",
            numberOfPets: "input.numberOfPets"
        }
    },
    "sitting": {
        1: {
            selectors: {
                date: "input.date",
                location: "select.location",
                district: "input.district",
                numberOfPets: "input.numberOfPets"
            },
        },
        2: {
            selectors: {
                date: "input.date",
                frequency: ".frequency select",
                location: "select.location",
                district: "input.district",
                numberOfPets: "input.numberOfPets"
            },
        },
        3: {
            selectors: {
                date: "input.date",
                frequency: ".frequency select",
                location: "select.location",
                district: "input.district",
                numberOfPets: "input.numberOfPets"
            }
        }
    },
    "walking": {
        4: {
            selectors: {
                date: "input.date",
                duration: "select.duration",
                numberOfPets: "input.numberOfPets"
            }
        },
        5: {
            selectors: {
                date: "input.date",
                duration: "select.duration",
                numberOfPets: "input.numberOfPets"
            }
        },
        6: {
            selectors: {
                date: "input.date",
                frequency: ".frequency select",
                duration: "select.duration",
                numberOfPets: "input.numberOfPets"
            }
        }
    }
}

const forms = document.querySelectorAll('.booking-form');

for (const form of forms) {
    form.addEventListener('submit', async (event) => {
        try {
            event.preventDefault();         
    
            const selectors = servicesBookingInfo[serviceSelected][planIdSelected]
                ? servicesBookingInfo[serviceSelected][planIdSelected].selectors
                : servicesBookingInfo[serviceSelected].selectors;
             
            const formData = Object.entries(selectors).reduce((acc, selector) => {
                const [field, className] = selector;
                
                if (!acc[field]) {
                    acc[field] = document.querySelector(`.${serviceSelected} ${className}`)?.value
                }
    
                return acc;
            }, {});
    
            // value checking for each field
            const errorMessage = document.querySelector(`.${serviceSelected} .error-message p`);
            for (const field in formData) {
                const valueEntered = formData[field];
                if(!valueEntered) {
                    errorMessage.innerHTML = `Please enter all the fields!`;
                    throw new Error(`missing value for field: ${field}`);
                }
            }

            const res = await fetch (`/booking/${serviceSelected}?plan_id=${planIdSelected}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
    
            if (res.status === 200) {
                window.location = '/success.html'
            } else {
                throw new Error('unable to book service');
            }
        } catch (err) {
            const errorContainer = document.querySelector(`.${serviceSelected} .error-message`);
            errorContainer.classList.add('show');
            console.error(err);
        }
    });
}