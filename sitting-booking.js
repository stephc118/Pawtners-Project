const chosenPlan = document.querySelectorAll(".choice-card");

chosenPlan.forEach(chosenPlan => {
    chosenPlan.addEventListener('click', () => {
        var prevChoice = document.querySelector(".action-card");
        const bookingForm = document.querySelector("#booking-form");

        if (prevChoice) {
            prevChoice.classList.remove("action-card");

        } chosenPlan.classList.add("action-card");

        const option1 = document.querySelector(".one");
        const option2 = document.querySelector(".two");
        const option3 = document.querySelector(".three");

        const frequencyLabel = document.querySelector(".frequency-label");
        const frequency = document.querySelector(".frequency");

        if (option1 === chosenPlan) {
            bookingForm.style.visibility = 'visible';
            frequencyLabel.style.display = 'none';
            frequency.style.display = 'none';
        } else {
            bookingForm.style.visibility = 'visible';
            frequencyLabel.style.display = '';
            frequency.style.display = '';
        }


    })
});
        