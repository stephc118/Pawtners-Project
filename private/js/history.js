(async () => {
    try {

        const res = await fetch('/history');

        const response = await res.json();

        console.log(response);

        if (res.status === 400) {
            throw new Error('Something went wrong with your booking history, please try again.')
        }

        if (res.status === 200) {
            if (response?.order) {
                const noBooking = document.querySelector("#no-booking");
                const table = document.querySelector("#table");
                const orderNo = document.querySelectorAll("#info td")[0];
                const service = document.querySelectorAll("#info td")[1];
                const date = document.querySelectorAll("#info td")[2];
                const otherDetails = document.querySelectorAll("#info td")[3];
                const bookBtn = document.querySelector("#book-btn");
                noBooking.style.display = 'none';
                bookBtn.style.display = 'none';
                orderNo.innerHTML = response.order.ride_order_id;
                service.innerHTML = 'Pets Ride';
                date.innerHTML = response.order.date;
               
            } else {
                table.style.display = 'none';
        }
    }
    } catch (err) {
        console.log(err);
    }
})()