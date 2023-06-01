const containerDOM = document.getElementById('container');
const areaBtn = document.querySelectorAll('.area-btn');
const districtDiv = document.querySelectorAll('.district');

// Listen to area button when clicked to open up the district buttons
areaBtn.forEach(area => {
    area.addEventListener('click', () => {
        containerDOM.innerHTML = '';
        // if HK-island
        if (area === areaBtn[0]) {
            districtDiv[0].style.display = 'flex';
            districtDiv[1].style.display = 'none';
            districtDiv[2].style.display = 'none';
            areaBtn[1].classList.add('unchosen');
            areaBtn[2].classList.add('unchosen');

        }
        // if Kowloon
        else if (area === areaBtn[1]) {
            districtDiv[1].style.display = 'flex';
            districtDiv[0].style.display = 'none';
            districtDiv[2].style.display = 'none';
            areaBtn[0].classList.add('unchosen');
            areaBtn[2].classList.add('unchosen');
        }
        // if N.T.
        else if (area === areaBtn[2]) {
            districtDiv[2].style.display = 'flex';
            districtDiv[1].style.display = 'none';
            districtDiv[0].style.display = 'none';
            areaBtn[0].classList.add('unchosen');
            areaBtn[1].classList.add('unchosen');
        }
    })
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

        if (chosenDistrict === districtName) {
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
    try {
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