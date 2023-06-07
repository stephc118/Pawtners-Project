const reviewContainer = document.querySelector('.review-container');

(async () => {
    try {
        // if (window.location = '/pet-sitting.html') {
        //     const resp = await fetch('/reviews/pet-sitting');
        // }
        const resp = await fetch('/reviews/pet-sitting?limit=3');
        const jsonReview = await resp.json();

        const reviews = jsonReview.review;

        function createCard() {
            reviews.forEach(review => {
                const cardElement = document.createElement('div');
                cardElement.className = 'rev-card';

                cardElement.addEventListener('mouseover', showCard);
                cardElement.addEventListener('mouseleave', blurCard);

                const imageContainer = document.createElement('div');
                imageContainer.classList.add('image-container');
                const imageElement = document.createElement('img');
                imageElement.setAttribute('src', '../image/image.jpeg');
                imageElement.setAttribute('alt', 'pro-pic');
                imageContainer.appendChild(imageElement);

                const starContainer = document.createElement('ul');
                if (review.star === 5) {
                    starContainer.innerHTML = `
                <li><i class="fas fa-star fa-sm text-info"></i></li>
                <li><i class="fas fa-star fa-sm text-info"></i></li>
                <li><i class="fas fa-star fa-sm text-info"></i></li>
                <li><i class="fas fa-star fa-sm text-info"></i></li>
                <li><i class="fas fa-star fa-sm text-info"></i></li>
                 
            `
                } else if (review.star === 4) {
                    starContainer.innerHTML = `
                    <li><i class="fas fa-star fa-sm text-info"></i></li>
                    <li><i class="fas fa-star fa-sm text-info"></i></li>
                    <li><i class="fas fa-star fa-sm text-info"></i></li>
                    <li><i class="fas fa-star fa-sm text-info"></i></li>
            `
                } else {
                    starContainer.innerHTML = `
                    <li><i class="fas fa-star fa-sm text-info"></i></li>
                    <li><i class="fas fa-star fa-sm text-info"></i></li>
                    <li><i class="fas fa-star fa-sm text-info"></i></li>
            `
                }

                const serviceMapping = {
                    'pet-sitting': 'Pet Sitting',
                    'dog-walking': 'Dog Walking',
                    'pets-grooming': 'Pets Grooming',
                    'pets-ride': 'Pets Ride'
                }
                const serviceContainer = document.createElement('div');
                serviceContainer.className = 'service-container';
                serviceContainer.innerHTML =`
                    <strong>Service used:</strong> ${serviceMapping[review.service]}
                ` 


                const nameContainer = document.createElement('div');
                nameContainer.classList.add('name-container');
                nameContainer.textContent = review.username;
                const paragraphElement = document.createElement('p');
                paragraphElement.textContent = review.text;


                cardElement.append(imageContainer, nameContainer, starContainer, serviceContainer, paragraphElement)
                reviewContainer.append(cardElement);
            })
        }
        createCard()

        function showCard() {
            this.classList.add('mouseover');
        }

        function blurCard() {
            this.classList.remove('mouseover');
        }
    } catch (err) {
        console.log(err);
    }
})()

