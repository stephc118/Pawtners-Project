(async () => {
    try {
        const table = document.querySelector("#table");
        const noBooking = document.querySelector("#no-booking");
        const bookBtn = document.querySelector("#book-btn");
        table.style.display = 'none';
        noBooking.style.display = 'none';
        bookBtn.style.display = 'none';
        setTimeout (()=> {
            const spinner = document.querySelector("#load");
            spinner.style.display = 'none';
        }, "1000");
            
        const res = await fetch('/history');

        const response = await res.json();

        console.log(response);

        if (res.status === 400) {
            throw new Error('Something went wrong with your booking history, please try again.')
        }

        if (res.status === 200) {
            if (!response.orderRide && !response.orderSitting &&
                !response.orderGrooming && !response.orderWalking) {

                setTimeout (()=> {
                    noBooking.style.display = '';
                    bookBtn.style.display = '';
                }, 980);
            }
            else if (response?.orderRide || response?.orderSitting ||
                response?.orderGrooming || response?.orderWalking) {

                setTimeout (()=> {
                    noBooking.style.display = 'none';
                    bookBtn.style.display = 'none';
                    table.style.display = '';
                }, 980);

                if (response?.orderRide) {

                    const orderNo1 = document.querySelectorAll("#row1 td")[0];
                    const service1 = document.querySelectorAll("#row1 td")[1];
                    const date1 = document.querySelectorAll("#row1 td")[2];
                    const otherDetails1 = document.querySelectorAll("#row1 td")[3];
                    orderNo1.innerHTML = response.orderRide.ride_order_id;
                    service1.innerHTML = 'Pets Ride';
                    date1.innerHTML = response.orderRide.date;
                } else {
                    row1.style.display = 'none';
                }

                if (response?.orderSitting) {
                    row2.style.display = '';
                    const orderNo2 = document.querySelectorAll("#row2 td")[0];
                    const service2 = document.querySelectorAll("#row2 td")[1];
                    const date2 = document.querySelectorAll("#row2 td")[2];
                    const otherDetails2 = document.querySelectorAll("#row2 td")[3];
                    orderNo2.innerHTML = response.orderSitting.sitting_order_id;
                    service2.innerHTML = 'Pets Sitting';
                    date2.innerHTML = response.orderSitting.date;
                } else {
                    row2.style.display = 'none';
                }

                if (response?.orderGrooming) {
                    row3.style.display = '';
                    const orderNo3 = document.querySelectorAll("#row3 td")[0];
                    const service3 = document.querySelectorAll("#row3 td")[1];
                    const date3 = document.querySelectorAll("#row3 td")[2];
                    const otherDetails3 = document.querySelectorAll("#row3 td")[3];
                    orderNo3.innerHTML = response.orderGrooming.grooming_order_id;
                    service3.innerHTML = 'Pets Grooming';
                    date3.innerHTML = response.orderGrooming.date;
                } else {
                    row3.style.display = 'none';
                }

                if (response?.orderWalking) {
                    row4.style.display = '';
                    const orderNo4 = document.querySelectorAll("#row4 td")[0];
                    const service4 = document.querySelectorAll("#row4 td")[1];
                    const date4 = document.querySelectorAll("#row4 td")[2];
                    const otherDetails4 = document.querySelectorAll("#row4 td")[3];
                    orderNo4.innerHTML = response.orderWalking.walking_order_id;
                    service4.innerHTML = 'Dog Walking';
                    date4.innerHTML = response.orderWalking.date;
                } else {
                    row4.style.display = 'none';
                }
            }
        }
    } catch (err) {
        console.log(err);
    }
})()