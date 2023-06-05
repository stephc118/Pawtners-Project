const reviewContainer = document.querySelector('.review-container');

const reviews = [
    {
        img: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
        alt: 'dog',
        name: 'Mary',
        text: `Good Service. Lorem ipsum dolor sit amet,
        consectetur adipisicing elit. Quod eos id officiis hic tenetur quae quaerat
        ad velit ab hic tenetur.`
    },
    {
        img: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZG9nfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
        alt: 'dog',
        name: 'Lily',
        text: `Nice job! Lorem ipsum dolor sit amet,
        consectetur adipisicing elit. Quod eos id officiis hic tenetur quae quaerat
        ad velit ab hic tenetur.`
    },
    {
        img: 'https://media.istockphoto.com/id/1402117306/photo/adorable-one-year-old-cockapoo.webp?b=1&s=170667a&w=0&k=20&c=mHh4dOIf4jUMEkTtmNJvJN_BmmeIVeZAQ9RsPl1bbOQ=',
        alt: 'dog',
        name: 'Tony',
        text: `Excellent. Lorem ipsum dolor sit amet,
        consectetur adipisicing elit. Quod eos id officiis hic tenetur quae quaerat
        ad velit ab hic tenetur.`
    }
    ]

function createCard () {
    reviews.forEach (review => {
        const cardElement = document.createElement('div');
        cardElement.className = 'rev-card';

        cardElement.addEventListener('mouseover', showCard);
        cardElement.addEventListener('mouseleave', blurCard);
        
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');
        const imageElement = document.createElement('img');
        imageElement.setAttribute('src', review.img);
        imageElement.setAttribute('alt', review.alt);
        imageContainer.appendChild(imageElement);

        const starContainer = document.createElement('ul');
        starContainer.innerHTML = `
            <li>
                <i class="fas fa-star fa-sm text-info"></i>
              </li>
              <li>
                <i class="fas fa-star fa-sm text-info"></i>
              </li>
              <li>
                <i class="fas fa-star fa-sm text-info"></i>
              </li>
              <li>
                <i class="fas fa-star fa-sm text-info"></i>
              </li>
              <li>
              <i class="fas fa-star fa-sm text-info"></i>
            </li>
        `
        
        const nameContainer = document.createElement('div');
        nameContainer.classList.add('name-container');
        nameContainer.textContent = review.name;
        const paragraphElement = document.createElement('p');
        paragraphElement.textContent = review.text;

        
        cardElement.append(imageContainer, starContainer, nameContainer, paragraphElement)
        reviewContainer.append(cardElement);   
    })       
    }

createCard()

function showCard () {
    this.classList.add('mouseover');
}

function blurCard () {
    this.classList.remove('mouseover');
}