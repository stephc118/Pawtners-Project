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

        const m15 = document.querySelector(".m15");
        const m30 = document.querySelector(".m30");
        const m45 = document.querySelector(".m45");
        const hr = document.querySelector(".hr");

        if (option1 === chosenPlan || option2 === chosenPlan) {
            bookingForm.style.visibility = 'visible';
            frequencyLabel.style.display = 'none';
            frequency.style.display = 'none';
            m15.style.display = '';
            m30.style.display = '';
            m45.style.display = 'none';
            hr.style.display = 'none';
            
        } else if (option3 === chosenPlan) {
            bookingForm.style.visibility = 'visible';
            frequencyLabel.style.display = '';
            frequency.style.display = '';
            m15.style.display = 'none';
            m30.style.display = 'none';
            m45.style.display = '';
            hr.style.display =  '';
        }


    })
});
        