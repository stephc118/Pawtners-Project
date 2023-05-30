const hkBtn = document.querySelector('.hk');
const klBtn = document.querySelector('.kl');
const ntBtn = document.querySelector('.nt');
const hkIsland = document.getElementById('hk-island');
const kowloon = document.getElementById('kowloon');
const newTer = document.getElementById('new-territories');

hkIsland.style.display = 'none';
kowloon.style.display = 'none';
newTer.style.display = 'none';

hkBtn.addEventListener('click', (event) => {

    hkIsland.style.display = '';
    kowloon.style.display = 'none';
    newTer.style.display = 'none';
    klBtn.classList.add('unchosen');
    ntBtn.classList.add('unchosen');

})

klBtn.addEventListener('click', (event) => {

    kowloon.style.display = '';
    hkIsland.style.display = 'none';
    newTer.style.display = 'none';
    hkBtn.classList.add('unchosen');
    ntBtn.classList.add('unchosen');
})

ntBtn.addEventListener('click', (event) => {

    newTer.style.display = '';
    hkIsland.style.display = 'none';
    kowloon.style.display = 'none';
    klBtn.classList.add('unchosen');
    hkBtn.classList.add('unchosen');
})

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
                    var districtName = element.value;
                    var chosenDistrict = response.result.rows.filter((item) => item.district === districtName)
                    chosenDistrict.forEach(staffInfo => {
                        var tag = document.createElement('p');
                        var name = document.createTextNode(staffInfo.name);
                        tag.appendChild(name);
                        var container = document.getElementById('container');
                        container.appendChild(tag);
                    })
                })
            });
        } else {
            throw new Error ('No found Pawtners in your area.')
        }
    } catch (err) {
        console.log(err);
    }
})()