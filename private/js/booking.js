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
        serviceSelected = event.target.dataset.value;
        console.log('serviceSelected', serviceSelected);
        // BUG: service selected is sometime null
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
        const prevSelectedCard = document.querySelector(".plan-selection .card.selected");
        if (prevSelectedCard) {
            prevSelectedCard.classList.remove("selected");
        }

        card.classList.add("selected");

        const bookingForm = document.querySelector(`.booking-form.${serviceSelected}`);
        bookingForm.classList.add("selected");
        //TODO: refactor to one form?
    })
}

// const chosenServices = document.querySelectorAll("#service-choice .choice-card");

// chosenServices.forEach(chosenService => {
//     chosenService.addEventListener('click', () => {
//         const prevChoice = document.querySelector(".action-card");

//         const petSitting = document.querySelectorAll(".choice-card")[0];
//         const dogWalking = document.querySelectorAll(".choice-card")[1];
//         const petsGrooming = document.querySelectorAll(".choice-card")[2];
//         const petsRide = document.querySelectorAll(".choice-card")[3];

//         const planHeading = document.querySelector("#plan-heading");
//         const planChoice = document.querySelector("#plan-choice");
//         const sittingPlan = document.querySelectorAll("#plan-choice")[0];
//         const walkingPlan = document.querySelectorAll("#plan-choice")[1];
//         const groomingPlan = document.querySelectorAll("#plan-choice")[2];


//         const sittingForm = document.querySelectorAll("#booking-form")[0];
//         const walkingForm = document.querySelectorAll("#booking-form")[1];
//         const groomingForm = document.querySelectorAll("#booking-form")[2];
//         const rideForm = document.querySelectorAll("#booking-form")[3];

//         const chosenPlan = document.querySelectorAll("#plan-choice .choice-card");

//         if (prevChoice) {
//             prevChoice.classList.remove("action-card");
//         }

//         chosenService.classList.add("action-card");

//         const OTP = document.querySelectorAll(".choice-card")[4];
//         const RDP = document.querySelectorAll(".choice-card")[5];
//         const ROP = document.querySelectorAll(".choice-card")[6];
//         const EODP = document.querySelectorAll(".choice-card")[7];
//         const DP = document.querySelectorAll(".choice-card")[8];
//         const RAP = document.querySelectorAll(".choice-card")[9];
//         const shower = document.querySelectorAll(".choice-card")[10];
//         const hair = document.querySelectorAll(".choice-card")[11];
//         const spa = document.querySelectorAll(".choice-card")[12];


//         if (petSitting === chosenService) {
//             planHeading.style.visibility = 'visible';
//             sittingPlan.style.display = 'flex';
//             walkingPlan.style.display = 'none';
//             groomingPlan.style.display = 'none';

//             chosenPlan.forEach(chosenPlan => {
//                 chosenPlan.addEventListener('click', () => {
//                     var prevChoice = document.querySelector(".action-card");
//                     if (prevChoice) {
//                         prevChoice.classList.remove("action-card");
//                     } chosenPlan.classList.add("action-card");
//                     var frequencyLabel1 = document.querySelectorAll(".frequency-label")[0];
//                     var frequency1 = document.querySelectorAll(".frequency")[0];
//                     if (OTP === chosenPlan) {
//                         sittingForm.style.display = 'flex';
//                         walkingForm.style.display = 'none';
//                         groomingForm.style.display = 'none';
//                         rideForm.style.display = 'none';
//                         frequencyLabel1.style.display = 'none';
//                         frequency1.style.display = 'none';
//                     } else {
//                         sittingForm.style.display = 'flex';
//                         walkingForm.style.display = 'none';
//                         groomingForm.style.display = 'none';
//                         rideForm.style.display = 'none';
//                         frequencyLabel1.style.display = '';
//                         frequency1.style.display = '';
//                     }
//                 })
//             })
//         }

//         if (dogWalking === chosenService) {
//             planHeading.style.visibility = 'visible';
//             walkingPlan.style.display = 'flex';
//             sittingPlan.style.display = 'none';
//             groomingPlan.style.display = 'none';

//             const m15 = document.querySelector(".m15");
//             const m30 = document.querySelector(".m30");
//             const m45 = document.querySelector(".m45");
//             const hr = document.querySelector(".hr");

//             chosenPlan.forEach(chosenPlan => {
//                 chosenPlan.addEventListener('click', () => {
//                     var prevChoice = document.querySelector(".action-card");
//                     if (prevChoice) {
//                         prevChoice.classList.remove("action-card");
//                     } chosenPlan.classList.add("action-card");

//                     var frequencyLabel2 = document.querySelectorAll(".frequency-label")[1];
//                     var frequency2 = document.querySelectorAll(".frequency")[1];

//                     if (EODP === chosenPlan || DP === chosenPlan) {
//                         walkingForm.style.display = 'flex';
//                         sittingForm.style.display = 'none';
//                         groomingForm.style.display = 'none';
//                         rideForm.style.display = 'none';
//                         frequencyLabel2.style.display = 'none';
//                         frequency2.style.display = 'none';
//                         m15.style.display = '';
//                         m30.style.display = '';
//                         m45.style.display = 'none';
//                         hr.style.display = 'none';
//                     } else {
//                         walkingForm.style.display = 'flex';
//                         sittingForm.style.display = 'none';
//                         groomingForm.style.display = 'none';
//                         rideForm.style.display = 'none';
//                         frequencyLabel2.style.display = '';
//                         frequency2.style.display = '';
//                         m15.style.display = 'none';
//                         m30.style.display = 'none';
//                         m45.style.display = '';
//                         hr.style.display = '';
//                     }
//                 })
//             })
//         };

//         if (petsGrooming === chosenService) {
//             planHeading.style.visibility = 'visible';
//             groomingPlan.style.display = 'flex';
//             walkingPlan.style.display = 'none';
//             sittingPlan.style.display = 'none';
//             chosenPlan.forEach(chosenPlan => {
//                 chosenPlan.addEventListener('click', () => {
//                     var prevChoice = document.querySelector(".action-card");
//                     if (prevChoice) {
//                         prevChoice.classList.remove("action-card");
//                     } chosenPlan.classList.add("action-card");
//                     groomingForm.style.display = 'flex';
//                     sittingForm.style.display = 'none';
//                     walkingForm.style.display = 'none';
//                     rideForm.style.display = 'none';
//                 })
//             })
//         };

//         if (petsRide === chosenService) {
//             planHeading.style.visibility = 'hidden';
//             walkingPlan.style.display = 'none';
//             sittingPlan.style.display = 'none';
//             groomingPlan.style.display = 'none';
//             rideForm.style.display = 'flex';
//             sittingForm.style.display = 'none';
//             walkingForm.style.display = 'none';
//             groomingForm.style.display = 'none';
//         }

//     })
// });