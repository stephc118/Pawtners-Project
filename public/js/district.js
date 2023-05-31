const hkBtn = document.querySelector('.hk');
const klBtn = document.querySelector('.kl');
const ntBtn = document.querySelector('.nt');
const hkIsland = document.getElementById('hk-island');
const kowloon = document.getElementById('kowloon');
const newTer = document.getElementById('new-territories');

const containerDOM = document.getElementById('container');

hkIsland.style.display = 'none';
kowloon.style.display = 'none';
newTer.style.display = 'none';

hkBtn.addEventListener('click', (event) => {

    hkIsland.style.display = '';
    kowloon.style.display = 'none';
    newTer.style.display = 'none';
    klBtn.classList.add('unchosen');
    ntBtn.classList.add('unchosen');
    containerDOM.innerHTML = '';

})

klBtn.addEventListener('click', (event) => {

    kowloon.style.display = '';
    hkIsland.style.display = 'none';
    newTer.style.display = 'none';
    hkBtn.classList.add('unchosen');
    ntBtn.classList.add('unchosen');
    containerDOM.innerHTML = '';
})

ntBtn.addEventListener('click', (event) => {

    newTer.style.display = '';
    hkIsland.style.display = 'none';
    kowloon.style.display = 'none';
    klBtn.classList.add('unchosen');
    hkBtn.classList.add('unchosen');
    containerDOM.innerHTML = '';
})

const districtNameMapping = {
    "central-western": "Central & Western",
    "wan-chai": "Wan Chai",
    "eastern": "Eastern",
    "southern": "Southern",
    "yau-tsim-mong": "Yau Tsim Mong",
    "sham-shui-po": "Sham Shui Po",
    "kowloon-city": "Kowloon-City",
    "wong-tai-sin": "Wong-Tai-Sin",
    "kwun-tong": "Kwun-Tong",
    "kwai-tsing": "Kwai-Tsing",
    "tsuen-wan": "Tsuen-Wan",
    "tuen-mun": "Tuen-Mun",
    "yuen-long": "Yuen-Long",
    "north": "North",
    "tai-po": "Tai-po",
    "sha-tin": "Sha Tin"  
}

// Infinite scrolling

const card = document.querySelector('.card');
const loader = document.querySelector('.loader');

(async () => {
    try {
        const res = await fetch('/district');
        const response = await res.json();

        if (response?.result) {
            var anyDistrict = document.querySelectorAll('.district-btn');
            anyDistrict.forEach(element => {
                element.addEventListener('click', (event) => {
                    containerDOM.innerHTML = '';

                    var districtName = element.value;
                    var chosenDistrict = response.result.rows.filter((item) => item.district === districtName)
                    chosenDistrict.forEach(staffInfo => {
                        const { name, district, services, experience } = staffInfo

                        const card = document.createElement('div');
                        card.className = "card";
                        card.innerHTML = `
                            <ul>
                                <h2>Pawtner's details</h2>
                                <li><b>Name:</b> ${name}</li>
                                <li><b>District:</b> ${districtNameMapping[district]}</li>
                                <li><b>Services:</b> ${services}</li>
                                <li><b>Experiences:</b> ${experience}</li>
                            </ul>
                        `
                        containerDOM.appendChild(card);
                    });
                });
            });
        } else {
            throw new Error('No found Pawtners in your area.')
        }
    } catch (err) {
        console.log(err);
    }
})()