const hkBtn = document.querySelector('.hk');
const klBtn = document.querySelector('.kl');
const ntBtn = document.querySelector('.nt');
const hkIsland = document.getElementById('hk-island');
const kowloon = document.getElementById('kowloon');
const newTer = document.getElementById('new-territories');

const containerDOM = document.getElementById('container');

hkBtn.addEventListener('click', (event) => {

    hkIsland.style.display = 'flex';
    kowloon.style.display = 'none';
    newTer.style.display = 'none';
    klBtn.classList.add('unchosen');
    ntBtn.classList.add('unchosen');
    containerDOM.innerHTML = '';

})

klBtn.addEventListener('click', (event) => {

    kowloon.style.display = 'flex';
    hkIsland.style.display = 'none';
    newTer.style.display = 'none';
    hkBtn.classList.add('unchosen');
    ntBtn.classList.add('unchosen');
    containerDOM.innerHTML = '';
})

ntBtn.addEventListener('click', (event) => {

    newTer.style.display = 'flex';
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

const allDistrictButtons = document.querySelectorAll('.district-btn');
let chosenDistrict;
let currentNumberOfStaff = 0;
let totalNumberOfStaff = 0;

allDistrictButtons.forEach(districtButton => {
    districtButton.addEventListener('click', async () => {
        // clear previous result
        const districtName = districtButton.value;

        if (chosenDistrict === districtName){
            // avoid re-fetching staff information
            return;
        } else {
            // reset variable when district changes
            totalNumberOfStaff = 0;
            currentNumberOfStaff = 0;
            chosenDistrict = districtName;
            containerDOM.innerHTML = '';

            // get staff information from backend
            const staffResp = await getStaff(chosenDistrict, { limit: 2, offset: 0 });
            const staffInfos = staffResp.staff;
            totalNumberOfStaff = staffResp.total;

            if (staffInfos.length) {
                currentNumberOfStaff = staffInfos.length;

                // create a card for each staff
                staffInfos.forEach(staff => createStaffCard(staff));
            } else {
                // show no staff msg
                const noFoundStaff = document.createElement('div');
                noFoundStaff.className = 'not-found';
                noFoundStaff.innerHTML = `
                <h2>No registered staff found in this district, <br>
                please search for another district closer to you.
                </h2>`
                containerDOM.appendChild(noFoundStaff);
            }
        }
    })
})

function createStaffCard(staff) {
    const { name, district, services, experience } = staff;

    const card = document.createElement('div');
    card.className = "card";
    card.innerHTML = `
        <ul>
            <h2>Pawtner's details</h2>
            <li><b>Name:</b> ${name}</li>
            <li><b>District:</b> ${districtNameMapping[district]}</li>
            <li><b>Services:</b> ${services}</li>
            <li><b>Experiences:</b> ${experience}</li>
            <a href='/booking.html'><button class="submit">Choose this Pawtner</button></a>
            </ul>
            `
    containerDOM.appendChild(card);
}

// Infinite scrolling

async function getStaff(districtName, options) {
    try{
        const { limit = 3, offset = 0 } = options;
        const resp = await fetch(`/district/${districtName}?limit=${limit}&offset=${offset}`);
        const json = await resp.json();
        return json;
    } catch (err) {
        console.error('unable to get staff', err);
    }
}

window.addEventListener('scroll', async () => {
    if (
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight
        && chosenDistrict
        && currentNumberOfStaff < totalNumberOfStaff
    ) {
        const staffResp = await getStaff(chosenDistrict, { limit: 2, offset: currentNumberOfStaff });
        const staffInfos = staffResp.staff;
        
        if (staffInfos.length) {
            currentNumberOfStaff += staffInfos.length;

            // create a card for each staff
            staffInfos.forEach(staff => createStaffCard(staff));
        }
    }
})