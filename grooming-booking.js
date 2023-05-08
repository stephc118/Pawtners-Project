const chosenPlan = document.querySelectorAll(".choice-card");

chosenPlan.forEach(chosenPlan => {
    chosenPlan.addEventListener('click', () => {
        var prevChoice = document.querySelector(".action-card");
        const bookingForm = document.querySelector("#booking-form");

        if (prevChoice) {
            prevChoice.classList.remove("action-card");
        } chosenPlan.classList.add("action-card");
            bookingForm.style.visibility = 'visible';
    })
});
        