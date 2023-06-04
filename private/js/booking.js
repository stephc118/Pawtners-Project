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
        } else {
            const planSelection = document.querySelector(`.plan-selection.${serviceSelected}`);
            planSelection.classList.add("selected");
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

        
        // form custom input handling
        const clickedPlanDiv = event.target.closest(".card");

        const frequencyEle = document.querySelector(`.booking-form .frequency`);
        if (frequencyEle) {
            frequencyEle.classList.remove('regular');
            const frequency = clickedPlanDiv.dataset.frequency;

            if (frequency) {
                frequencyEle.classList.add(frequency);
            }
        }


        const durationEle = document.querySelector(`.booking-form .duration`);
        if (durationEle) {
            durationEle.classList.remove('short');
            durationEle.classList.remove('long');

            const duration = clickedPlanDiv.dataset.duration;
            console.log('duration', duration);
            if (duration) {
                const durationEle = document.querySelector(`.booking-form .duration`);
                durationEle.classList.add(duration);
            }
        }
    })
}